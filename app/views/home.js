// LionStat — Overview (#/): headline KPIs, featured chart switcher,
// topic cards, a regional highlight and the latest-release strip.

import { PYRAMID_2024, indicatorById } from '../data/indicators.js';
import { AREAS, REGIONS } from '../data/regions.js';
import { RELEASE_CALENDAR } from '../data/sources.js';
import { renderLineChart, renderPyramidChart } from '../charts.js';
import { cite, kpiCard, sectionHead } from './common.js';

const FEATURED = [
  { id: 'gdp', label: 'GDP & Growth 2015–2025' },
  { id: 'population', label: 'Population & Ageing' },
  { id: 'inflation', label: 'Inflation: CPI vs Core' },
  { id: 'trade', label: 'Trade & Port TEUs' },
];

export function render() {
  const kpis = [
    'total-population',
    'nominal-gdp',
    'real-gdp-growth',
    'resident-unemployment',
    'cpi-core',
    'home-ownership',
  ].map((id) => kpiCard(indicatorById(id))).join('');

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
      (r) => `<li><strong>${r.release}</strong><span>${r.agency} · ${r.window}</span></li>`,
    )
    .join('');

  return `
  <section class="hero">
    <p class="kicker">Independent civic statistical atlas · Republic of Singapore</p>
    <h1>Singapore in numbers.</h1>
    <p class="hero-blurb">Every headline figure about the country — population, economy, jobs,
    prices, trade and housing — from the official releases, checked for
    consistency, and shown with its source and year. No estimates, no
    placeholders, nothing behind a login.</p>
    <div class="hero-facts">
      <span><strong>23</strong> indicators</span>
      <span><strong>28</strong> planning areas</span>
      <span><strong>20</strong> numbered sources</span>
      <span><strong>2015–2024</strong> series</span>
    </div>
  </section>

  <section class="kpi-grid" aria-label="Headline indicators">${kpis}</section>

  <section class="featured">
    ${sectionHead('Featured chart', 'The economy, the people, the prices', 'Switch the chart to compare the four stories that define Singapore in 2024.')}
    <div class="switcher" role="tablist" aria-label="Featured chart">
      ${FEATURED.map((f, i) => `<button type="button" role="tab" class="switcher-btn${i === 0 ? ' active' : ''}" data-chart="${f.id}" aria-selected="${i === 0}">${f.label}</button>`).join('')}
    </div>
    <div id="featured-chart" class="chart-panel"></div>
    <div id="featured-extra" class="chart-panel"></div>
  </section>

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
      ${sectionHead('Latest releases', 'Fresh from the agencies', 'The next scheduled official releases behind these figures.')}
      <ul class="release-list">${releases}</ul>
      <p class="panel-note">Dataset vintage: latest verified figures 2024 ${cite(15)}. See the full calendar and the audit on the Sources page.</p>
      <p><a class="btn btn-ghost" href="#/sources">Sources &amp; calendar →</a></p>
    </div>
  </section>`;
}

export function mount() {
  const featured = document.getElementById('featured-chart');
  const extra = document.getElementById('featured-extra');
  const draw = (id) => {
    extra.innerHTML = '';
    if (id === 'gdp') {
      renderLineChart(featured, [
        { label: 'Nominal GDP (S$B)', color: '#0F766E', values: indicatorById('nominal-gdp').series },
      ], { title: 'Nominal GDP, 2015–2024', unit: 'S$B', caption: 'Nominal GDP rose 6.8% in 2024 to S$719.4B [2]. Real growth was +4.4%, up from +1.8% in 2023 [2].' });
    } else if (id === 'population') {
      renderLineChart(featured, [
        { label: 'Total population (M)', color: '#0F766E', values: indicatorById('total-population').series },
        { label: 'Resident population (M)', color: '#B45309', values: indicatorById('resident-population').series },
      ], { title: 'Population, 2015–2024', unit: 'M', caption: 'Total population 6.04M at June 2024; residents 4.18M [1]. The 2021 dip is the pandemic outflow.' });
      renderPyramidChart(extra, PYRAMID_2024, { title: 'Age structure, 2024 — share of total population', caption: 'Working-age residents (15–64) are 72.3% of the population; seniors 65+ are 13.6% [1].' });
    } else if (id === 'inflation') {
      renderLineChart(featured, [
        { label: 'Headline CPI (% YoY)', color: '#BE123C', values: indicatorById('cpi-headline').series },
        { label: 'MAS core inflation (% YoY)', color: '#0F766E', values: indicatorById('cpi-core').series },
      ], { title: 'Inflation, 2015–2024', unit: '% YoY', caption: 'Headline CPI +2.4% and core +2.7% in 2024, both down sharply from 2023 [4] [5].' });
    } else {
      renderLineChart(featured, [
        { label: 'Container throughput (M TEUs)', color: '#0F766E', values: indicatorById('container-throughput').series },
        { label: 'Changi passengers (M)', color: '#B45309', values: indicatorById('changi-passengers').series },
      ], { title: 'Port & airport, 2015–2024', unit: 'million', caption: 'A record 41.1M TEUs through the port [7]; Changi handled 67.7M passengers, near its 2019 record [8].' });
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
