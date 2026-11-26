// LionStat — Regions (#/regions): interactive geographic map, area detail
// panel, two-area comparison, and a sortable, filterable table.

import { AREAS, REGIONS, areaById, regionById } from '../data/regions.js';
import { renderRegionMap } from '../charts.js';
import { cite, sectionHead } from './common.js';

const METRICS = [
  { id: 'population', label: 'Population' },
  { id: 'density', label: 'Density / km²' },
  { id: 'medianAge', label: 'Median Age' },
  { id: 'hdbShare', label: 'HDB Share %' },
];

const COMPARE_METRICS = [
  { id: 'population', label: 'Population', fmt: (v) => `${(v / 1000).toFixed(0)}k` },
  { id: 'densityPerKm2', label: 'Density / km²', fmt: (v) => v.toLocaleString('en-SG') },
  { id: 'medianAge', label: 'Median age', fmt: (v) => v.toFixed(1) },
  { id: 'hdbSharePct', label: 'HDB share', fmt: (v) => `${v}%` },
  { id: 'youthPct', label: 'Aged 0–14', fmt: (v) => `${v.toFixed(1)}%` },
  { id: 'seniorPct', label: 'Aged 65+', fmt: (v) => `${v.toFixed(1)}%` },
];

export function render() {
  const options = AREAS.map((a) => `<option value="${a.id}">${a.name}</option>`).join('');
  return `
  <section class="regions-page">
    ${sectionHead('Regions', 'Singapore, area by area', 'Five planning regions, 28 key planning areas. Colour the map by any metric, click a tile to inspect the area, and compare any two areas head to head.')}
    <div class="map-controls" role="group" aria-label="Map metric">
      ${METRICS.map((m, i) => `<button type="button" class="metric-btn${i === 0 ? ' active' : ''}" data-metric="${m.id}">${m.label}</button>`).join('')}
    </div>
    <div class="map-layout">
      <div id="region-map" class="chart-panel map-panel"></div>
      <aside id="area-detail" class="area-detail" aria-live="polite"></aside>
    </div>

    <div class="panel compare-panel">
      <h3 class="subhead">Compare any two planning areas</h3>
      <div class="compare-pickers">
        <label>Area A <select id="compare-a">${options}</select></label>
        <span class="vs">vs</span>
        <label>Area B <select id="compare-b">${options}</select></label>
      </div>
      <div id="compare-result"></div>
    </div>

    <div class="panel">
      <h3 class="subhead">All 28 planning areas</h3>
      <div class="table-controls">
        <label>Region
          <select id="region-filter">
            <option value="">All regions</option>
            ${REGIONS.map((r) => `<option value="${r.id}">${r.name}</option>`).join('')}
          </select>
        </label>
        <span class="table-count" id="area-count"></span>
      </div>
      <div class="table-scroll"><table class="data-table" id="areas-table">
        <thead><tr>
          <th data-sort="name">Planning area</th>
          <th data-sort="region">Region</th>
          <th class="num" data-sort="population">Population</th>
          <th class="num" data-sort="areaKm2">Area km²</th>
          <th class="num" data-sort="densityPerKm2">Density / km²</th>
          <th class="num" data-sort="medianAge">Median age</th>
          <th class="num" data-sort="hdbSharePct">HDB %</th>
          <th class="num" data-sort="mrtStations">MRT stations</th>
        </tr></thead>
        <tbody id="areas-body"></tbody>
      </table></div>
      <p class="panel-note">Populations are 2024 planning-area estimates; areas are URA gazetted sizes [14] [1]. Density is population divided by area.</p>
    </div>
  </section>`;
}

function detailHtml(area) {
  const region = regionById(area.region);
  return `
    <p class="kicker">${region.name}</p>
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
    </dl>
    <p class="panel-note">Known for: ${area.topFeatures.join(' · ')}.</p>
    <p class="panel-note">Sources: population and age structure [1]; boundaries and areas [14].</p>`;
}

export function mount() {
  let metric = 'population';
  // Quick search can pre-select an area (main.js sets this before routing).
  let selectedId = window.__lionstatSelectedArea || 'tampines';
  window.__lionstatSelectedArea = undefined;
  const mapHost = document.getElementById('region-map');
  const detailHost = document.getElementById('area-detail');
  const drawMap = () => {
    renderRegionMap(mapHost, AREAS, REGIONS, selectedId, metric, (id) => {
      selectedId = id;
      detailHost.innerHTML = detailHtml(areaById(id));
      drawMap();
    });
  };
  const selectArea = (id) => {
    selectedId = id;
    detailHost.innerHTML = detailHtml(areaById(id));
    drawMap();
  };
  detailHost.innerHTML = detailHtml(areaById(selectedId));
  drawMap();
  document.querySelectorAll('.metric-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.metric-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      metric = btn.dataset.metric;
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
    result.innerHTML = `<p class="panel-note">${a.name} (${regionById(a.region).name}) vs ${b.name} (${regionById(b.region).name}) — 2024 ${cite(1)}.</p>${rows}`;
  };
  selA.addEventListener('change', drawCompare);
  selB.addEventListener('change', drawCompare);
  drawCompare();

  // Sortable, filterable table.
  const body = document.getElementById('areas-body');
  const count = document.getElementById('area-count');
  const filter = document.getElementById('region-filter');
  let sortKey = 'population';
  let sortDir = -1;
  const drawTable = () => {
    let rows = AREAS.filter((a) => !filter.value || a.region === filter.value);
    rows = [...rows].sort((x, y) => {
      const vx = x[sortKey];
      const vy = y[sortKey];
      const cmp = typeof vx === 'string' ? vx.localeCompare(vy) : vx - vy;
      return cmp * sortDir;
    });
    body.innerHTML = rows
      .map((a) => `<tr>
        <td><button type="button" class="link-btn" data-area="${a.id}">${a.name}</button></td>
        <td>${regionById(a.region).name.replace(' Region', '')}</td>
        <td class="num">${a.population.toLocaleString('en-SG')}</td>
        <td class="num">${a.areaKm2.toFixed(1)}</td>
        <td class="num">${a.densityPerKm2.toLocaleString('en-SG')}</td>
        <td class="num">${a.medianAge.toFixed(1)}</td>
        <td class="num">${a.hdbSharePct}%</td>
        <td class="num">${a.mrtStations}</td>
      </tr>`).join('');
    count.textContent = `${rows.length} of 28 areas shown`;
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
}
