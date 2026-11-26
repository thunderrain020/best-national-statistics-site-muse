// LionStat — Regions (#/regions): interactive geographic map, area detail
// panel, two-area comparison, and a sortable, filterable table.
//
// V4 layout: a tight two-row grid so map + detail + comparison + the top
// of the ranking table all fit inside a 1280×800 viewport.

import { AREAS, REGIONS, areaById, regionById } from '../data/regions.js';
import { renderRegionMap } from '../charts.js';
import { cite, sectionHead } from './common.js';
import { t } from '../i18n.js';

const METRICS = [
  { id: 'population', key: 'regions.metric.population' },
  { id: 'density', key: 'regions.metric.density' },
  { id: 'medianAge', key: 'regions.metric.medianAge' },
  { id: 'hdbShare', key: 'regions.metric.hdbShare' },
];

const COMPARE_METRICS = [
  { id: 'population', label: 'Population', fmt: (v) => `${(v / 1000).toFixed(0)}k` },
  { id: 'densityPerKm2', label: 'Density / km²', fmt: (v) => v.toLocaleString('en-SG') },
  { id: 'medianAge', label: 'Median age', fmt: (v) => v.toFixed(1) },
  { id: 'hdbSharePct', label: 'HDB share', fmt: (v) => `${v}%` },
];

// Rank helper: position of an area among the 28 by a metric, highest first
// (so median age ranks the oldest area #1, matching the table's desc sort).
const METRIC_VALUES = {
  population: (a) => a.population,
  density: (a) => a.densityPerKm2,
  medianAge: (a) => a.medianAge,
  hdbShare: (a) => a.hdbSharePct,
};
const METRIC_LABELS = {
  population: 'Population', density: 'Density', medianAge: 'Median age', hdbShare: 'HDB share',
};
function rankOf(area, metric) {
  const value = METRIC_VALUES[metric](area);
  return 1 + AREAS.filter((a) => METRIC_VALUES[metric](a) > value).length;
}

export function render() {
  const options = AREAS.map((a) => `<option value="${a.id}">${a.name}</option>`).join('');
  return `
  <section class="regions-page">
    ${sectionHead(t('regions.kicker'), t('regions.title'), t('regions.intro'))}
    <div class="map-controls" role="group" aria-label="Map metric">
      ${METRICS.map((m, i) => `<button type="button" class="metric-btn${i === 0 ? ' active' : ''}" data-metric="${m.id}">${t(m.key)}</button>`).join('')}
    </div>
    <div class="regions-grid">
      <div id="region-map" class="chart-panel map-panel"></div>
      <aside id="area-detail" class="area-detail" aria-live="polite"></aside>

      <div class="panel compare-panel">
        <h3 class="subhead">${t('regions.compare.title')}</h3>
        <div class="compare-pickers">
          <label>Area A <select id="compare-a">${options}</select></label>
          <span class="vs">vs</span>
          <label>Area B <select id="compare-b">${options}</select></label>
        </div>
        <div id="compare-result"></div>
      </div>

      <div class="panel table-panel">
        <div class="cc-panel-head"><h3 class="subhead">${t('regions.table.title')}</h3><button type="button" class="btn-mini" id="dl-areas-csv">${t('regions.table.csv')}</button></div>
        <div class="table-controls">
          <label>Region
            <select id="region-filter">
              <option value="">All regions</option>
              ${REGIONS.map((r) => `<option value="${r.id}">${r.name}</option>`).join('')}
            </select>
          </label>
          <span class="table-count" id="area-count"></span>
        </div>
        <div class="table-scroll table-scroll-short"><table class="data-table" id="areas-table">
          <thead><tr>
            <th class="num">#</th>
            <th data-sort="name">Planning area</th>
            <th data-sort="region">Region</th>
            <th class="num" data-sort="population">Population</th>
            <th class="num" data-sort="densityPerKm2">Density / km²</th>
            <th class="num" data-sort="medianAge">Median age</th>
            <th class="num" data-sort="hdbSharePct">HDB %</th>
          </tr></thead>
          <tbody id="areas-body"></tbody>
        </table></div>
      </div>
    </div>
  </section>`;
}

function detailHtml(area, metric = 'population') {
  const region = regionById(area.region);
  const rank = rankOf(area, metric);
  return `
    <p class="kicker crumb"><span>Singapore</span> <span class="crumb-sep">›</span> <button type="button" class="crumb-btn" data-region="${area.region}">${region.name}</button></p>
    <h3>${area.name}</h3>
    <dl class="detail-grid">
      <div><dt>Population</dt><dd>${area.population.toLocaleString('en-SG')}</dd></div>
      <div><dt>Area</dt><dd>${area.areaKm2} km²</dd></div>
      <div><dt>Density</dt><dd>${area.densityPerKm2.toLocaleString('en-SG')} / km²</dd></div>
      <div><dt>Median age</dt><dd>${area.medianAge.toFixed(1)} yrs</dd></div>
      <div><dt>Aged 0–14</dt><dd>${area.youthPct.toFixed(1)}%</dd></div>
      <div><dt>Aged 65+</dt><dd>${area.seniorPct.toFixed(1)}%</dd></div>
      <div><dt>HDB share</dt><dd>${area.hdbSharePct}%</dd></div>
      <div><dt>MRT stations</dt><dd>${area.mrtStations}</dd></div>
      <div><dt>Rank · ${METRIC_LABELS[metric]}</dt><dd>#${rank} of 28</dd></div>
    </dl>
    <p class="panel-note">Known for: ${area.topFeatures.join(' · ')}. Sources [1] [14].</p>
    <p class="panel-note prov-note">SingStat Population Trends · Jun 2024 · Primary · Boundaries: URA Master Plan 2019 · Verified</p>
    <div class="detail-actions">
      <button type="button" class="btn btn-mini" data-dl-csv>Download CSV</button>
      <button type="button" class="btn btn-ghost btn-mini" data-copy-cite>Copy citation</button>
    </div>
    <span class="copy-note" data-copy-note aria-live="polite"></span>`;
}

function areaCsv(area) {
  const csvCell = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [
    ['planning_area', 'region', 'population', 'area_km2', 'density_per_km2', 'median_age', 'youth_pct_0_14', 'senior_pct_65_plus', 'hdb_share_pct', 'mrt_stations'],
    [area.name, area.region, area.population, area.areaKm2, area.densityPerKm2, area.medianAge, area.youthPct, area.seniorPct, area.hdbSharePct, area.mrtStations],
  ];
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
}

function areaCitation(area) {
  return `LionStat — Singapore in Numbers: ${area.name} (${regionById(area.region).name}), 2024: population ${area.population.toLocaleString('en-SG')}, density ${area.densityPerKm2.toLocaleString('en-SG')}/km², median age ${area.medianAge.toFixed(1)} years, HDB share ${area.hdbSharePct}%. Sources [1] population and age structure; [14] boundaries and areas.`;
}

function downloadFile(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wireDetailActions(area, onRegionClick) {
  const csvBtn = document.querySelector('[data-dl-csv]');
  const citeBtn = document.querySelector('[data-copy-cite]');
  const note = document.querySelector('[data-copy-note]');
  const crumbBtn = document.querySelector('[data-region]');
  if (crumbBtn && onRegionClick) {
    crumbBtn.addEventListener('click', () => onRegionClick(area.region));
  }
  if (!csvBtn || !citeBtn) return;
  csvBtn.addEventListener('click', (ev) => {
    const btn = ev.currentTarget;
    downloadFile(`lionstat-${area.id}-2024.csv`, areaCsv(area), 'text/csv');
    const old = btn.textContent;
    btn.textContent = 'Saved ✓';
    setTimeout(() => { btn.textContent = old; }, 1500);
  });
  citeBtn.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const text = areaCitation(area);
    try {
      await navigator.clipboard.writeText(text);
      note.textContent = 'Citation copied.';
      const old = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => { btn.textContent = old; note.textContent = ''; }, 2500);
    } catch {
      note.textContent = text;
    }
  });
}

export function mount() {
  let metric = 'population';
  // Quick search can pre-select an area (main.js sets this before routing).
  let selectedId = window.__lionstatSelectedArea || 'tampines';
  window.__lionstatSelectedArea = undefined;
  const mapHost = document.getElementById('region-map');
  const detailHost = document.getElementById('area-detail');
  const filter = document.getElementById('region-filter');
  const drawMap = () => {
    renderRegionMap(mapHost, AREAS, REGIONS, selectedId, metric, (id) => {
      selectedId = id;
      detailHost.innerHTML = detailHtml(areaById(id), metric);
      wireDetailActions(areaById(id), filterToRegion);
      drawMap();
    }, { compact: true });
  };
  const selectArea = (id) => {
    selectedId = id;
    detailHost.innerHTML = detailHtml(areaById(id), metric);
    wireDetailActions(areaById(id), filterToRegion);
    drawMap();
  };
  const filterToRegion = (regionId) => {
    filter.value = regionId;
    drawTable();
    document.querySelector('.table-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  detailHost.innerHTML = detailHtml(areaById(selectedId), metric);
  wireDetailActions(areaById(selectedId), filterToRegion);
  drawMap();
  document.querySelectorAll('.metric-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.metric-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      metric = btn.dataset.metric;
      detailHost.innerHTML = detailHtml(areaById(selectedId), metric);
      wireDetailActions(areaById(selectedId), filterToRegion);
      drawMap();
    });
  });

  // Comparison widget.
  const selA = document.getElementById('compare-a');
  const selB = document.getElementById('compare-b');
  selA.value = 'tampines';
  selB.value = 'jurong-west';
  const result = document.getElementById('compare-result');
  const drawCompare = () => {
    const a = areaById(selA.value);
    const b = areaById(selB.value);
    const rows = COMPARE_METRICS.map((m) => {
      const max = Math.max(a[m.id], b[m.id]);
      const wa = (a[m.id] / max) * 100;
      const wb = (b[m.id] / max) * 100;
      return `<div class="compare-row">
        <span class="compare-label">${m.label}</span>
        <div class="compare-bars">
          <div class="compare-bar"><span style="width:${wa.toFixed(1)}%"></span><em>${a.name} ${m.fmt(a[m.id])}</em></div>
          <div class="compare-bar b"><span style="width:${wb.toFixed(1)}%"></span><em>${b.name} ${m.fmt(b[m.id])}</em></div>
        </div>
      </div>`;
    }).join('');
    result.innerHTML = `<p class="panel-note">${a.name} vs ${b.name} — 2024 ${cite(1)}.</p>${rows}`;
  };
  selA.addEventListener('change', drawCompare);
  selB.addEventListener('change', drawCompare);
  drawCompare();

  // Sortable, filterable table with a rank column.
  const body = document.getElementById('areas-body');
  const count = document.getElementById('area-count');
  let sortKey = 'population';
  let sortDir = -1;
  let shownRows = [];
  const drawTable = () => {
    let rows = AREAS.filter((a) => !filter.value || a.region === filter.value);
    rows = [...rows].sort((x, y) => {
      const vx = x[sortKey];
      const vy = y[sortKey];
      const cmp = typeof vx === 'string' ? vx.localeCompare(vy) : vx - vy;
      return cmp * sortDir;
    });
    shownRows = rows;
    body.innerHTML = rows
      .map((a, i) => `<tr>
        <td class="num rank">${i + 1}</td>
        <td><button type="button" class="link-btn" data-area="${a.id}">${a.name}</button></td>
        <td><span class="region-pill"><span class="region-dot" style="background:${regionById(a.region).color}"></span>${regionById(a.region).name.replace(' Region', '')}</span></td>
        <td class="num">${a.population.toLocaleString('en-SG')}</td>
        <td class="num">${a.densityPerKm2.toLocaleString('en-SG')}</td>
        <td class="num">${a.medianAge.toFixed(1)}</td>
        <td class="num">${a.hdbSharePct}%</td>
      </tr>`).join('');
    count.textContent = `${rows.length} of 28 areas shown`;
    document.querySelectorAll('#areas-table th[data-sort]').forEach((th) => {
      th.classList.toggle('sorted', th.dataset.sort === sortKey);
      th.classList.toggle('asc', th.dataset.sort === sortKey && sortDir === 1);
    });
    body.querySelectorAll('.link-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectArea(btn.dataset.area);
        document.getElementById('region-map').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  };
  filter.addEventListener('change', drawTable);
  document.querySelectorAll('#areas-table th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = key === 'name' || key === 'region' ? 1 : -1; }
      drawTable();
    });
  });
  drawTable();

  document.getElementById('dl-areas-csv').addEventListener('click', (ev) => {
    const btn = ev.currentTarget;
    const csvCell = (v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [['rank', 'planning_area', 'region', 'population', 'area_km2', 'density_per_km2', 'median_age', 'youth_pct_0_14', 'senior_pct_65_plus', 'hdb_share_pct', 'mrt_stations'].join(',')];
    for (let i = 0; i < shownRows.length; i++) {
      const a = shownRows[i];
      lines.push([i + 1, a.name, a.region, a.population, a.areaKm2, a.densityPerKm2, a.medianAge, a.youthPct, a.seniorPct, a.hdbSharePct, a.mrtStations].map(csvCell).join(','));
    }
    downloadFile('lionstat-28-planning-areas-2024.csv', lines.join('\r\n'), 'text/csv');
    const old = btn.textContent;
    btn.textContent = 'Saved ✓';
    setTimeout(() => { btn.textContent = old; }, 1500);
  });
}
