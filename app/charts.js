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
  const H = options.compact ? 150 : 300;
  const padL = 56;
  const padR = 16;
  const padT = 14;
  const padB = options.compact ? 28 : 34;
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
  // Axis labels stay readable: integers for large values, one decimal
  // for tens, two decimals only for small values. Tooltips keep fmtNum.
  const gridFormat = (v) => {
    const a = Math.abs(v);
    if (a >= 100) return Math.round(v).toLocaleString('en-SG');
    if (a >= 10) return (Math.round(v * 10) / 10).toFixed(1);
    return fmtNum(v);
  };

  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const v = min + ((max - min) * g) / 4;
    const yy = y(v);
    grid += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${W - padR}" y2="${yy.toFixed(1)}" class="grid-line"/><text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" class="axis-label" text-anchor="end">${esc(gridFormat(v))}</text>`;
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

// Geographic tile map of Singapore: one tile per planning area, centred
// at its real geographic position over a simplified coastline silhouette
// (mainland plus Sentosa, Jurong Island, Pulau Ubin and Pulau Tekong).
// metric: 'population' | 'density' | 'medianAge' | 'hdbShare'.
export function renderRegionMap(container, areas, regions, selectedId, metric, onSelect) {
  const TILE_W = 84;
  const TILE_H = 58;
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
  const valText = (a) => {
    const val = metricOf(a);
    return metric === 'population' ? `${(val / 1000).toFixed(0)}k` : metric === 'medianAge' ? val.toFixed(1) : val.toLocaleString('en-SG');
  };
  // Simplified coastline silhouette of Singapore. Coordinates are in the
  // same 1000×620 viewBox as the tiles: the mainland runs roughly 50 km
  // east–west, so the 88-unit scale bar below is about 5 km.
  const coastline = `
    <path class="landmass" d="M 95,520 L 70,440 L 60,360 L 80,300 L 130,240 L 210,180 L 290,150 L 370,135 L 450,130 L 540,125 L 620,130 L 690,140 L 760,155 L 830,180 L 890,230 L 925,280 L 905,350 L 880,410 L 840,450 L 780,480 L 710,505 L 650,520 L 590,515 L 520,510 L 450,505 L 380,505 L 320,510 L 210,525 L 140,530 Z"/>
    <path class="landmass" d="M 600,545 L 660,540 L 690,552 L 660,568 L 610,566 Z"/>
    <path class="landmass" d="M 120,545 L 200,540 L 260,548 L 280,568 L 230,585 L 150,580 L 110,565 Z"/>
    <path class="landmass" d="M 700,95 L 770,88 L 800,100 L 780,118 L 720,118 L 695,105 Z"/>
    <path class="landmass" d="M 830,105 L 890,100 L 910,118 L 880,135 L 840,130 Z"/>
    <text x="748" y="106" class="map-island-label" text-anchor="middle">Pulau Ubin</text>
    <text x="872" y="120" class="map-island-label" text-anchor="middle">Pulau Tekong</text>
    <text x="195" y="568" class="map-island-label" text-anchor="middle">Jurong Island</text>
    <text x="645" y="558" class="map-island-label" text-anchor="middle">Sentosa</text>
    <text x="500" y="46" class="map-water-label" text-anchor="middle">Strait of Johor</text>
    <text x="500" y="585" class="map-water-label" text-anchor="middle">Singapore Strait</text>
    <g class="map-compass"><polygon points="945,48 939,68 951,68" fill="#0F172A"/><text x="945" y="84" class="map-compass-n" text-anchor="middle">N</text></g>
    <g class="map-scale"><line x1="800" y1="576" x2="888" y2="576" stroke="#0F172A" stroke-width="2"/><line x1="800" y1="571" x2="800" y2="581" stroke="#0F172A" stroke-width="2"/><line x1="888" y1="571" x2="888" y2="581" stroke="#0F172A" stroke-width="2"/><text x="844" y="566" class="map-scale-label" text-anchor="middle">5 km</text></g>`;
  let tiles = '';
  areas.forEach((a) => {
    const t = (metricOf(a) - lo) / span;
    const x = a.x - TILE_W / 2;
    const y = a.y - TILE_H / 2;
    const sel = a.id === selectedId;
    const lines = nameLines(a.name);
    const two = lines.length === 2;
    const nameText = lines
      .map((ln, i) => `<text x="${a.x}" y="${y + (two ? 20 + i * 13 : 25)}" class="map-tile-name" fill="${textOn(t)}">${esc(ln)}</text>`)
      .join('');
    tiles += `<g class="map-tile${sel ? ' selected' : ''}" data-area="${esc(a.id)}" tabindex="0" role="button" aria-label="${esc(a.name)}: ${esc(metricLabel)} ${esc(valText(a))}">
      <rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="6" fill="${ramp(t)}" stroke="${sel ? '#0F172A' : '#FFFFFF'}" stroke-width="${sel ? 3 : 1.5}"/>
      ${nameText}
      <text x="${a.x}" y="${y + (two ? 49 : 45)}" class="map-tile-value" fill="${textOn(t)}">${esc(valText(a))}</text>
    </g>`;
  });
  const regionChips = regions
    .map((r) => `<span class="region-chip"><span class="legend-swatch" style="background:${r.color}"></span>${esc(r.name)}</span>`)
    .join('');
  const highest = areas.reduce((b, a) => (metricOf(a) > metricOf(b) ? a : b), areas[0]);
  const lowest = areas.reduce((b, a) => (metricOf(a) < metricOf(b) ? a : b), areas[0]);
  container.innerHTML = `
    <div class="chart-wrap map-wrap"><svg viewBox="0 30 1000 560" role="img" aria-label="Geographic map of Singapore planning areas">${coastline}${tiles}</svg></div>
    <div class="map-legend"><span class="map-legend-label">${esc(metricLabel)}: ${esc(metric === 'population' ? `${(lo / 1000).toFixed(0)}k` : String(lo))} — ${esc(metric === 'population' ? `${(hi / 1000).toFixed(0)}k` : String(hi))}</span><span class="map-ramp"><span style="background:#DCEFEA"></span><span style="background:#9CCDC6"></span><span style="background:#4FA79E"></span><span style="background:#0F766E"></span></span></div>
    <div class="map-hilo"><span class="hilo-chip hilo-high">Highest: ${esc(highest.name)} — ${esc(valText(highest))}</span><span class="hilo-chip hilo-low">Lowest: ${esc(lowest.name)} — ${esc(valText(lowest))}</span></div>
    <div class="region-chips">${regionChips}</div>`;
  container.querySelectorAll('.map-tile').forEach((g) => {
    const pick = () => onSelect(g.dataset.area);
    g.addEventListener('click', pick);
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); }
    });
  });
}
