// LionStat — pure offline SVG chart renderers. No canvas, no libraries:
// every chart is an inline SVG string, crisp at any DPI, with hover
// tooltips driven by plain DOM events.

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtNum(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-SG');
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 100) / 100);
}

function attachTooltip(container, svg, points) {
  // points: [{x, y, html}] in SVG viewBox coordinates. The tooltip follows
  // the pointer and shows the nearest point's html.
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.style.display = 'none';
  container.appendChild(tip);
  const cross = document.createElement('div');
  cross.className = 'chart-cross';
  cross.style.display = 'none';
  container.appendChild(cross);
  svg.addEventListener('mousemove', (ev) => {
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const px = ((ev.clientX - rect.left) / rect.width) * vb.width;
    const py = ((ev.clientY - rect.top) / rect.height) * vb.height;
    let best = null;
    let bestD = Infinity;
    for (const p of points) {
      const d = Math.abs(p.x - px);
      if (d < bestD) { bestD = d; best = p; }
    }
    if (!best) return;
    tip.innerHTML = best.html;
    tip.style.display = 'block';
    const tx = Math.min(Math.max(ev.clientX - rect.left + 12, 4), rect.width - 150);
    const ty = Math.max(ev.clientY - rect.top - 12, 4);
    tip.style.left = `${tx}px`;
    tip.style.top = `${ty}px`;
    cross.style.display = 'block';
    cross.style.left = `${(best.x / vb.width) * 100}%`;
    cross.style.top = '0';
    cross.style.height = '100%';
  });
  svg.addEventListener('mouseleave', () => {
    tip.style.display = 'none';
    cross.style.display = 'none';
  });
}

export function renderSparkline(values, color) {
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - 4) + 2;
      const y = h - 4 - ((v - min) / span) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const lastX = w - 2;
  const lastY = h - 4 - ((values[values.length - 1] - min) / span) * (h - 8);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Trend sparkline"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${lastX}" cy="${lastY.toFixed(1)}" r="3" fill="${color}"/></svg>`;
}

export function renderLineChart(container, seriesList, options = {}) {
  const W = 640;
  const H = 300;
  const padL = 56;
  const padR = 16;
  const padT = 14;
  const padB = 34;
  const all = seriesList.flatMap((s) => s.values.map((p) => p.value));
  let min = Math.min(...all);
  let max = Math.max(...all);
  if (min > 0 && min / max > 0.7) min = 0;
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.08;
  min -= pad;
  max += pad;
  const years = seriesList[0].values.map((p) => p.year);
  const x = (i) => padL + (i / (years.length - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const format = options.format || fmtNum;

  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const v = min + ((max - min) * g) / 4;
    const yy = y(v);
    grid += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${W - padR}" y2="${yy.toFixed(1)}" class="grid-line"/><text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" class="axis-label" text-anchor="end">${esc(format(v))}</text>`;
  }
  let xLabels = '';
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      xLabels += `<text x="${x(i).toFixed(1)}" y="${H - 10}" class="axis-label" text-anchor="middle">${yr}</text>`;
    }
  });

  let paths = '';
  const points = [];
  seriesList.forEach((s, si) => {
    const d = s.values
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
      .join(' ');
    paths += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" class="line-series" data-series="${si}"/>`;
    s.values.forEach((p, i) => {
      paths += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3" fill="${s.color}" class="line-dot" data-series="${si}"/>`;
      points.push({
        x: x(i),
        y: y(p.value),
        html: `<strong>${esc(s.label)}</strong><br>${p.year}: ${esc(format(p.value))}${options.unit ? ` ${esc(options.unit)}` : ''}`,
      });
    });
  });

  let legend = '';
  seriesList.forEach((s, si) => {
    legend += `<button type="button" class="legend-item" data-series="${si}" aria-pressed="true"><span class="legend-swatch" style="background:${s.color}"></span>${esc(s.label)}</button>`;
  });

  container.innerHTML = `
    <div class="chart-head">${options.title ? `<h3 class="chart-title">${esc(options.title)}</h3>` : ''}<div class="legend">${legend}</div></div>
    <div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(options.title || 'Line chart')}">${grid}${xLabels}${paths}</svg></div>
    ${options.caption ? `<p class="chart-caption">${esc(options.caption)}</p>` : ''}`;
  const svg = container.querySelector('svg');
  attachTooltip(container.querySelector('.chart-wrap'), svg, points);
  container.querySelectorAll('.legend-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const si = btn.dataset.series;
      const on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!on));
      btn.classList.toggle('off', on);
      container.querySelectorAll(`[data-series="${si}"].line-series, [data-series="${si}"].line-dot`).forEach((el) => {
        el.style.display = on ? 'none' : '';
      });
    });
  });
}

export function renderBarChart(container, items, options = {}) {
  const W = 640;
  const rowH = 34;
  const H = items.length * rowH + 46;
  const padL = 190;
  const padR = 64;
  const max = Math.max(...items.map((i) => Math.abs(i.value)));
  const format = options.format || fmtNum;
  let rows = '';
  items.forEach((item, i) => {
    const yTop = 8 + i * rowH;
    const barW = (Math.abs(item.value) / max) * (W - padL - padR);
    const color = item.color || (item.value < 0 ? '#BE123C' : '#0F766E');
    rows += `<text x="${padL - 10}" y="${yTop + 17}" class="bar-label" text-anchor="end">${esc(item.label)}</text>`;
    rows += `<rect x="${padL}" y="${yTop + 5}" width="${Math.max(barW, 2).toFixed(1)}" height="18" rx="3" fill="${color}"><title>${esc(item.label)}: ${esc(format(item.value))}</title></rect>`;
    rows += `<text x="${padL + barW + 8}" y="${yTop + 18}" class="bar-value">${esc(format(item.value))}${options.suffix ? esc(options.suffix) : ''}</text>`;
  });
  container.innerHTML = `
    <div class="chart-head">${options.title ? `<h3 class="chart-title">${esc(options.title)}</h3>` : ''}</div>
    <div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(options.title || 'Bar chart')}">${rows}</svg></div>
    ${options.caption ? `<p class="chart-caption">${esc(options.caption)}</p>` : ''}`;
}

export function renderPyramidChart(container, bands, options = {}) {
  const W = 640;
  const rowH = 22;
  const H = bands.length * rowH + 52;
  const midX = W / 2;
  const maxV = Math.max(...bands.flatMap((b) => [b.male, b.female]));
  const half = W / 2 - 90;
  let rows = '';
  bands.forEach((b, i) => {
    const yTop = 30 + i * rowH;
    const mw = (b.male / maxV) * half;
    const fw = (b.female / maxV) * half;
    rows += `<text x="${midX}" y="${yTop + 13}" class="axis-label" text-anchor="middle">${esc(b.band)}</text>`;
    rows += `<rect x="${(midX - 52 - mw).toFixed(1)}" y="${yTop + 2}" width="${mw.toFixed(1)}" height="15" rx="2" fill="#0F766E"><title>Male ${esc(b.band)}: ${b.male}%</title></rect>`;
    rows += `<rect x="${(midX + 52).toFixed(1)}" y="${yTop + 2}" width="${fw.toFixed(1)}" height="15" rx="2" fill="#B45309"><title>Female ${esc(b.band)}: ${b.female}%</title></rect>`;
    rows += `<text x="${(midX - 58 - mw).toFixed(1)}" y="${yTop + 14}" class="bar-value" text-anchor="end">${b.male.toFixed(1)}%</text>`;
    rows += `<text x="${(midX + 58 + fw).toFixed(1)}" y="${yTop + 14}" class="bar-value">${b.female.toFixed(1)}%</text>`;
  });
  container.innerHTML = `
    <div class="chart-head">${options.title ? `<h3 class="chart-title">${esc(options.title)}</h3>` : ''}
    <div class="legend"><span class="legend-item"><span class="legend-swatch" style="background:#0F766E"></span>Male</span><span class="legend-item"><span class="legend-swatch" style="background:#B45309"></span>Female</span></div></div>
    <div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(options.title || 'Population pyramid')}"><text x="${midX - half / 2 - 26}" y="16" class="axis-label" text-anchor="middle">Male</text><text x="${midX + half / 2 + 26}" y="16" class="axis-label" text-anchor="middle">Female</text>${rows}</svg></div>
    ${options.caption ? `<p class="chart-caption">${esc(options.caption)}</p>` : ''}`;
}

// Tile-grid map of Singapore: one tile per planning area, placed by
// geography. metric: 'population' | 'density' | 'medianAge' | 'hdbShare'.
export function renderRegionMap(container, areas, regions, selectedId, metric, onSelect) {
  const COLS = 9;
  const ROWS = 6;
  const TILE = 92;
  const GAP = 8;
  const W = COLS * (TILE + GAP) + GAP;
  const H = ROWS * (TILE + GAP) + GAP + 8;
  const metricOf = (a) =>
    metric === 'population' ? a.population
    : metric === 'density' ? a.densityPerKm2
    : metric === 'medianAge' ? a.medianAge
    : a.hdbSharePct;
  const metricLabel =
    metric === 'population' ? 'Population'
    : metric === 'density' ? 'Density / km²'
    : metric === 'medianAge' ? 'Median age'
    : 'HDB share %';
  const values = areas.map(metricOf);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  // Jade ramp: pale #DCEFEA to deep #0F766E.
  const ramp = (t) => {
    const from = [220, 239, 234];
    const to = [15, 118, 110];
    const c = from.map((f, i) => Math.round(f + (to[i] - f) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };
  const textOn = (t) => (t > 0.55 ? '#FFFFFF' : '#0F172A');
  // Long area names wrap to two lines so no label ever spills past its tile.
  const nameLines = (name) => {
    if (name.length <= 11) return [name];
    const words = name.split(' ');
    let best = [words.slice(0, -1).join(' '), words[words.length - 1]];
    if (best[0].length > 11) best = [words[0], words.slice(1).join(' ')];
    return best;
  };
  let tiles = '';
  areas.forEach((a) => {
    const t = (metricOf(a) - lo) / span;
    const x = GAP + a.col * (TILE + GAP);
    const y = GAP + a.row * (TILE + GAP);
    const sel = a.id === selectedId;
    const val = metricOf(a);
    const valText = metric === 'population' ? `${(val / 1000).toFixed(0)}k` : metric === 'medianAge' ? val.toFixed(1) : val.toLocaleString('en-SG');
    const lines = nameLines(a.name);
    const two = lines.length === 2;
    const nameText = lines
      .map((ln, i) => `<text x="${x + TILE / 2}" y="${y + (two ? 30 + i * 15 : 34)}" class="map-tile-name" fill="${textOn(t)}">${esc(ln)}</text>`)
      .join('');
    tiles += `<g class="map-tile${sel ? ' selected' : ''}" data-area="${esc(a.id)}" tabindex="0" role="button" aria-label="${esc(a.name)}: ${esc(metricLabel)} ${esc(valText)}">
      <rect x="${x}" y="${y}" width="${TILE}" height="${TILE}" rx="8" fill="${ramp(t)}" stroke="${sel ? '#0F172A' : '#FFFFFF'}" stroke-width="${sel ? 3 : 1.5}"/>
      ${nameText}
      <text x="${x + TILE / 2}" y="${y + (two ? 64 : 56)}" class="map-tile-value" fill="${textOn(t)}">${esc(valText)}</text>
      <text x="${x + TILE / 2}" y="${y + (two ? 79 : 74)}" class="map-tile-sub" fill="${textOn(t)}">${esc(metricLabel)}</text>
    </g>`;
  });
  const regionChips = regions
    .map((r) => `<span class="region-chip"><span class="legend-swatch" style="background:${r.color}"></span>${esc(r.name)}</span>`)
    .join('');
  container.innerHTML = `
    <div class="chart-wrap map-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tile-grid map of Singapore planning areas">${tiles}</svg></div>
    <div class="map-legend"><span class="map-legend-label">${esc(metricLabel)}: ${esc(metric === 'population' ? `${(lo / 1000).toFixed(0)}k` : String(lo))} — ${esc(metric === 'population' ? `${(hi / 1000).toFixed(0)}k` : String(hi))}</span><span class="map-ramp"><span style="background:#DCEFEA"></span><span style="background:#9CCDC6"></span><span style="background:#4FA79E"></span><span style="background:#0F766E"></span></span></div>
    <div class="region-chips">${regionChips}</div>`;
  container.querySelectorAll('.map-tile').forEach((g) => {
    const pick = () => onSelect(g.dataset.area);
    g.addEventListener('click', pick);
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); }
    });
  });
}
