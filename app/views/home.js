// LionStat — Overview (#/): a command centre that fits 1280×800 above
// the fold: a compact masthead, the geographic map with latest releases
// on the left, six KPI cards and the featured chart on the right. Topic
// cards and the regional summary sit below the fold.

import { PYRAMID_2024, indicatorById } from '../data/indicators.js';
import { AREAS, REGIONS, areaById } from '../data/regions.js';
import { RELEASE_CALENDAR } from '../data/sources.js';
import { renderLineChart, renderPyramidChart, renderRegionMap } from '../charts.js';
import { kpiCard, sectionHead } from './common.js';

const FEATURED = [
  { id: 'gdp', label: 'GDP Growth' },
  { id: 'population', label: 'Population' },
  { id: 'inflation', label: 'Core vs Headline CPI' },
  { id: 'trade', label: 'Port TEUs' },
];

const MAP_METRICS = [
  { id: 'population', label: 'Population' },
  { id: 'density', label: 'Density' },
  { id: 'medianAge', label: 'Median Age' },
  { id: 'hdbShare', label: 'HDB Share' },
];

export function render() {
  const kpis = [
    ['total-population', 'Population'],
    ['nominal-gdp', 'Nominal GDP'],
    ['real-gdp-growth', 'Real GDP Growth'],
    ['resident-unemployment', 'Resident Unemployment'],
    ['cpi-core', 'Core Inflation'],
    ['home-ownership', 'Home Ownership'],
  ].map(([id, short]) => kpiCard(indicatorById(id), true, short)).join('');

  const topicCards = [
    { id: 'demography', name: 'Demography', figure: '6.04M people', note: 'Median age 43.0 years, fertility 0.97' },
    { id: 'economy', name: 'Economy', figure: 'S$719.4B GDP', note: 'Real growth +4.4% in 2024' },
    { id: 'labor', name: 'Labor & Wages', figure: 'S$5,500 median pay', note: 'Resident unemployment 2.9%' },
    { id: 'prices', name: 'Prices & CPI', figure: '+2.4% headline CPI', note: 'Core inflation +2.7%' },
    { id: 'trade', name: 'Trade & Port', figure: '41.1M TEUs', note: 'Changi handled 67.7M passengers' },
    { id: 'society', name: 'Society & Housing', figure: '90.8% own homes', note: 'Life expectancy 83.5 years' },
  ]
    .map(
      (t) => `<a class="topic-card" href="#/topics/${t.id}">
        <h3>${t.name}</h3><p class="topic-figure">${t.figure}</p><p class="topic-note">${t.note}</p>
        <span class="topic-link">Explore ${t.name} →</span>
      </a>`,
    )
    .join('');

  const largest = [...AREAS].sort((a, b) => b.population - a.population)[0];
  const youngest = [...AREAS].sort((a, b) => a.medianAge - b.medianAge)[0];
  const densest = [...AREAS].sort((a, b) => b.densityPerKm2 - a.densityPerKm2)[0];
  const regionRows = REGIONS.map((r) => {
    const pop = AREAS.filter((a) => a.region === r.id).reduce((s, a) => s + a.population, 0);
    const n = AREAS.filter((a) => a.region === r.id).length;
    return `<li><span class="region-dot" style="background:${r.color}"></span><strong>${r.name}</strong><span class="region-pop">${(pop / 1e6).toFixed(2)}M people · ${n} areas</span></li>`;
  }).join('');

  const releases = RELEASE_CALENDAR.slice(0, 3)
    .map(
      (r) => `<li><strong>${r.release}</strong><span> — ${r.agency} · ${r.window}</span></li>`,
    )
    .join('');

  return `
  <section class="masthead">
    <p class="kicker">Independent civic statistical atlas · Republic of Singapore</p>
    <h1>Singapore in numbers.</h1>
    <p class="masthead-facts">30 indicators · 28 planning areas · 20 official citations · 2010–2024 series</p>
    <p class="masthead-sub">Every headline figure from the official releases, checked for consistency, with its source and year.</p>
  </section>

  <div class="command-grid">
    <div class="cc-left">
      <section class="panel cc-map-panel" aria-label="Singapore map">
        <div class="cc-panel-head"><h2>Singapore, area by area</h2><a href="#/regions">Full map →</a></div>
        <div class="map-controls" id="cc-map-controls" role="group" aria-label="Map metric">
          ${MAP_METRICS.map((m, i) => `<button type="button" class="metric-btn${i === 0 ? ' active' : ''}" data-metric="${m.id}">${m.label}</button>`).join('')}
        </div>
        <div id="cc-map"></div>
        <div id="cc-selected" class="cc-selected" aria-live="polite"></div>
      </section>
      <section class="panel cc-releases" aria-label="Latest official releases">
        <div class="cc-panel-head"><h2>Latest official releases</h2><a href="#/sources">Calendar →</a></div>
        <ul class="release-list compact">${releases}</ul>
      </section>
    </div>

    <div class="cc-right">
      <section class="kpi-grid kpi-grid-compact" aria-label="Headline indicators">${kpis}</section>
      <section class="panel featured-panel" aria-label="Featured chart">
        <div class="cc-panel-head"><h2>Featured trend</h2><a href="#/explorer">Data Explorer →</a></div>
        <div class="switcher" role="tablist" aria-label="Featured chart">
          ${FEATURED.map((f, i) => `<button type="button" role="tab" class="switcher-btn${i === 0 ? ' active' : ''}" data-chart="${f.id}" aria-selected="${i === 0}">${f.label}</button>`).join('')}
        </div>
        <div id="featured-chart" class="cc-chart"></div>
        <div id="featured-extra" class="cc-chart"></div>
      </section>
    </div>
  </div>

  <section class="topics-section">
    ${sectionHead('Browse by topic', 'Six topics, one atlas', 'Each topic carries its own charts, a full indicator table and a source for every figure.')}
    <div class="topic-grid">${topicCards}</div>
  </section>

  <section class="split">
    <div class="panel">
      ${sectionHead('Regions', 'Five regions, 28 planning areas', 'The 28 areas below hold about 3.98 million people. The rest live in the other 27 planning areas.')}
      <ul class="region-list">${regionRows}</ul>
      <p class="panel-note">Largest area: <strong>${largest.name}</strong> (${(largest.population / 1000).toFixed(0)}k people) ·
      Youngest: <strong>${youngest.name}</strong> (median age ${youngest.medianAge.toFixed(1)}) ·
      Densest: <strong>${densest.name}</strong> (${densest.densityPerKm2.toLocaleString('en-SG')} / km²)</p>
      <p><a class="btn" href="#/regions">Open the interactive map →</a></p>
    </div>
    <div class="panel">
      ${sectionHead('Method', 'Every figure, sourced and checked', 'No estimates, no placeholders, nothing behind a login.')}
      <p class="panel-note">Thirty indicators across six topics, each with a 2010–2024 series and a numbered official citation. A live audit on the Sources page checks the dataset for consistency — sector shares, age bands, GDP per capita, population parts — and reports every result.</p>
      <p><a class="btn btn-ghost" href="#/sources">Sources, calendar &amp; audit →</a></p>
    </div>
  </section>`;
}

export function mount() {
  // Interactive map in the left column.
  let mapMetric = 'population';
  let selectedArea = window.__lionstatSelectedArea || 'bedok';
  window.__lionstatSelectedArea = undefined;
  const mapHost = document.getElementById('cc-map');
  const selectedHost = document.getElementById('cc-selected');
  const drawSelected = () => {
    const a = areaById(selectedArea);
    selectedHost.innerHTML = `<strong>${a.name}</strong> · ${(a.population / 1000).toFixed(0)}k people · ${a.areaKm2} km² · age ${a.medianAge.toFixed(1)} · HDB ${a.hdbSharePct}% · <a href="#/regions">Open regions →</a>`;
  };
  const drawMap = () => {
    renderRegionMap(mapHost, AREAS, REGIONS, selectedArea, mapMetric, (id) => {
      selectedArea = id;
      drawSelected();
      drawMap();
    });
  };
  drawSelected();
  drawMap();
  document.querySelectorAll('#cc-map-controls .metric-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#cc-map-controls .metric-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mapMetric = btn.dataset.metric;
      drawSelected();
      drawMap();
    });
  });

  // Featured chart switcher.
  const featured = document.getElementById('featured-chart');
  const extra = document.getElementById('featured-extra');
  const draw = (id) => {
    extra.innerHTML = '';
    if (id === 'gdp') {
      renderLineChart(featured, [
        { label: 'Nominal GDP (S$B)', color: '#0F766E', values: indicatorById('nominal-gdp').series },
      ], { title: '', unit: 'S$B', compact: true, caption: 'S$719.4B in 2024, up 6.8%; real growth +4.4% [2].' });
    } else if (id === 'population') {
      renderLineChart(featured, [
        { label: 'Total population (M)', color: '#0F766E', values: indicatorById('total-population').series },
        { label: 'Resident population (M)', color: '#B45309', values: indicatorById('resident-population').series },
      ], { title: '', unit: 'M', compact: true, caption: 'Total 6.04M; residents 4.18M at June 2024 [1].' });
      renderPyramidChart(extra, PYRAMID_2024, { title: 'Age structure, 2024 — share of total population', caption: 'Working-age residents (15–64) are 72.3% of the population; seniors 65+ are 13.6% [1].' });
    } else if (id === 'inflation') {
      renderLineChart(featured, [
        { label: 'Headline CPI (% YoY)', color: '#BE123C', values: indicatorById('cpi-headline').series },
        { label: 'MAS core inflation (% YoY)', color: '#0F766E', values: indicatorById('cpi-core').series },
      ], { title: '', unit: '% YoY', compact: true, caption: 'Headline +2.4%, core +2.7% in 2024 [4] [5].' });
    } else {
      renderLineChart(featured, [
        { label: 'Container throughput (M TEUs)', color: '#0F766E', values: indicatorById('container-throughput').series },
        { label: 'Changi passengers (M)', color: '#B45309', values: indicatorById('changi-passengers').series },
      ], { title: '', unit: 'million', compact: true, caption: 'Record 41.1M TEUs [7]; Changi 67.7M passengers [8].' });
    }
  };
  draw('gdp');
  document.querySelectorAll('.switcher-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.switcher-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      draw(btn.dataset.chart);
    });
  });
}
