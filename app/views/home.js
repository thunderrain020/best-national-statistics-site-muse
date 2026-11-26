// LionStat — Overview (#/): a command centre that fits 1280×800 above
// the fold: a compact masthead, the geographic map with latest releases
// on the left, six KPI cards and the featured chart on the right. Topic
// cards and the regional summary sit below the fold.

import { PYRAMID_2024, indicatorById } from '../data/indicators.js';
import { AREAS, REGIONS, areaById } from '../data/regions.js';
import { RELEASE_CALENDAR } from '../data/sources.js';
import { renderLineChart, renderPyramidChart, renderRegionMap } from '../charts.js';
import { kpiCard, sectionHead } from './common.js';
import { t, topicName } from '../i18n.js';

const FEATURED = [
  { id: 'gdp', key: 'feat.gdp' },
  { id: 'population', key: 'feat.population' },
  { id: 'inflation', key: 'feat.inflation' },
  { id: 'trade', key: 'feat.trade' },
];

const MAP_METRICS = [
  { id: 'population', key: 'regions.metric.population' },
  { id: 'density', key: 'regions.metric.density' },
  { id: 'medianAge', key: 'regions.metric.medianAge' },
  { id: 'hdbShare', key: 'regions.metric.hdbShare' },
];

export function render() {
  const kpis = [
    ['total-population', 'kpi.population'],
    ['nominal-gdp', 'kpi.gdp'],
    ['real-gdp-growth', 'kpi.gdpgrowth'],
    ['resident-unemployment', 'kpi.unemp'],
    ['cpi-core', 'kpi.cpi'],
    ['home-ownership', 'kpi.home'],
    ['median-income', 'kpi.income'],
    ['total-trade', 'kpi.trade'],
  ].map(([id, key]) => kpiCard(indicatorById(id), true, t(key))).join('');

  const topicCards = [
    { id: 'demography', figure: '6.04M people', note: 'Median age 43.0 years, fertility 0.97' },
    { id: 'economy', figure: 'S$719.4B GDP', note: 'Real growth +4.4% in 2024' },
    { id: 'labor', figure: 'S$5,500 median pay', note: 'Resident unemployment 2.9%' },
    { id: 'prices', figure: '+2.4% headline CPI', note: 'Core inflation +2.7%' },
    { id: 'trade', figure: '41.1M TEUs', note: 'Changi handled 67.7M passengers' },
    { id: 'society', figure: '90.8% own homes', note: 'Life expectancy 83.5 years' },
  ]
    .map(
      (tc) => `<a class="topic-card" href="#/topics/${tc.id}">
        <h3>${topicName(tc.id)}</h3><p class="topic-figure">${tc.figure}</p><p class="topic-note">${tc.note}</p>
        <span class="topic-link">${t('topics.explore')} ${topicName(tc.id)} →</span>
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
    <p class="kicker">${t('masthead.kicker')}</p>
    <h1>${t('masthead.title')}</h1>
    <p class="masthead-facts">${t('masthead.facts')}</p>
    <p class="masthead-sub">${t('masthead.sub')}</p>
  </section>

  <div class="command-grid">
    <div class="cc-left">
      <section class="panel cc-map-panel" aria-label="Singapore map">
        <div class="cc-panel-head"><h2>${t('ov.map.title')}</h2><a href="#/regions">${t('ov.map.full')}</a></div>
        <div class="map-controls" id="cc-map-controls" role="group" aria-label="Map metric">
          ${MAP_METRICS.map((m, i) => `<button type="button" class="metric-btn${i === 0 ? ' active' : ''}" data-metric="${m.id}">${t(m.key)}</button>`).join('')}
        </div>
        <div id="cc-map"></div>
        <div id="cc-selected" class="cc-selected" aria-live="polite"></div>
      </section>
      <section class="panel cc-releases" aria-label="Latest official releases">
        <div class="cc-panel-head"><h2>${t('ov.releases.title')}</h2><a href="#/sources">${t('ov.releases.cal')}</a></div>
        <ul class="release-list compact">${releases}</ul>
      </section>
    </div>

    <div class="cc-right">
      <section class="kpi-grid kpi-grid-compact" aria-label="Headline indicators">${kpis}</section>
      <section class="panel featured-panel" aria-label="Featured chart">
        <div class="cc-panel-head"><h2>${t('ov.featured.title')}</h2><div class="cc-head-actions"><div class="seg-toggle" role="group" aria-label="Chart units"><button type="button" class="seg-btn active" data-unit="level">${t('unit.level')}</button><button type="button" class="seg-btn" data-unit="yoy">${t('unit.yoy')}</button></div><button type="button" class="btn-mini" id="dl-featured-csv">${t('ov.featured.csv')}</button><button type="button" class="btn-mini" id="copy-featured-cite">${t('ov.featured.cite')}</button><a href="#/explorer">${t('ov.featured.explorer')}</a></div></div>
        <div class="switcher" role="tablist" aria-label="Featured chart">
          ${FEATURED.map((f, i) => `<button type="button" role="tab" class="switcher-btn${i === 0 ? ' active' : ''}" data-chart="${f.id}" aria-selected="${i === 0}">${t(f.key)}</button>`).join('')}
        </div>
        <div id="featured-chart" class="cc-chart"></div>
        <div id="featured-extra" class="cc-chart"></div>
      </section>
    </div>
  </div>

  <section class="topics-section">
    ${sectionHead(t('topics.browse.kicker'), t('topics.browse.title'), t('topics.browse.blurb'))}
    <div class="topic-grid">${topicCards}</div>
  </section>

  <section class="split">
    <div class="panel">
      ${sectionHead(t('ov.regions.kicker'), t('ov.regions.title'), t('ov.regions.blurb'))}
      <ul class="region-list">${regionRows}</ul>
      <p class="panel-note">Largest area: <strong>${largest.name}</strong> (${(largest.population / 1000).toFixed(0)}k people) ·
      Youngest: <strong>${youngest.name}</strong> (median age ${youngest.medianAge.toFixed(1)}) ·
      Densest: <strong>${densest.name}</strong> (${densest.densityPerKm2.toLocaleString('en-SG')} / km²)</p>
      <p><a class="btn" href="#/regions">Open the interactive map →</a></p>
    </div>
    <div class="panel">
      ${sectionHead(t('ov.method.kicker'), t('ov.method.title'), t('ov.method.blurb'))}
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

  // Featured chart switcher, with a Level / YoY % unit toggle and inline
  // event callouts on every series.
  const featured = document.getElementById('featured-chart');
  const extra = document.getElementById('featured-extra');
  let currentFeatured = null;
  let currentChart = 'gdp';
  let yoyMode = false;
  const toYoY = (values) => values.slice(1).map((p, i) => ({ year: p.year, value: ((p.value / values[i].value) - 1) * 100 }));
  const draw = (id) => {
    currentChart = id;
    extra.innerHTML = '';
    const yoy = (list) => (yoyMode ? list.map((s) => ({ ...s, label: s.label.includes('% YoY') ? s.label : `${s.label} (% YoY)`, values: toYoY(s.values) })) : list);
    if (id === 'gdp') {
      currentFeatured = { label: 'GDP Growth', caption: 'S$719.4B in 2024, up 6.8%; real growth +4.4% [2].', indicators: ['nominal-gdp'] };
      renderLineChart(featured, yoy([
        { label: 'Nominal GDP (S$B)', color: '#0F766E', values: indicatorById('nominal-gdp').series },
      ]), { title: '', unit: yoyMode ? '% YoY' : 'S$B', compact: true, height: 110, caption: 'S$719.4B in 2024, up 6.8%; real growth +4.4% [2].', annotations: [{ year: 2020, text: 'COVID-19 dip −4.9%' }, { year: 2022, text: 'Rebound +16.5%' }] });
    } else if (id === 'population') {
      currentFeatured = { label: 'Population', caption: 'Total 6.04M; residents 4.18M at June 2024 [1].', indicators: ['total-population', 'resident-population'] };
      renderLineChart(featured, yoy([
        { label: 'Total population (M)', color: '#0F766E', values: indicatorById('total-population').series },
        { label: 'Resident population (M)', color: '#B45309', values: indicatorById('resident-population').series },
      ]), { title: '', unit: yoyMode ? '% YoY' : 'M', compact: true, height: 110, caption: 'Total 6.04M; residents 4.18M at June 2024 [1].', annotations: [{ year: 2020, text: 'Border controls −4.2%' }, { year: 2023, text: 'Rebound +5.0%' }] });
      if (!yoyMode) {
        renderPyramidChart(extra, PYRAMID_2024, { title: 'Age structure, 2024 — share of total population', caption: 'Working-age residents (15–64) are 72.3% of the population; seniors 65+ are 13.6% [1].' });
      }
    } else if (id === 'inflation') {
      currentFeatured = { label: 'Core vs Headline CPI', caption: 'Headline +2.4%, core +2.7% in 2024 [4] [5].', indicators: ['cpi-headline', 'cpi-core'] };
      renderLineChart(featured, yoy([
        { label: 'Headline CPI (% YoY)', color: '#BE123C', values: indicatorById('cpi-headline').series },
        { label: 'MAS core inflation (% YoY)', color: '#0F766E', values: indicatorById('cpi-core').series },
      ]), { title: '', unit: '% YoY', compact: true, height: 110, caption: 'Headline +2.4%, core +2.7% in 2024 [4] [5].', annotations: [{ year: 2020, text: 'Deflation −0.2%' }, { year: 2022, text: 'Peak +6.1%' }] });
    } else {
      currentFeatured = { label: 'Port TEUs', caption: 'Record 41.1M TEUs [7]; Changi 67.7M passengers [8].', indicators: ['container-throughput', 'changi-passengers'] };
      renderLineChart(featured, yoy([
        { label: 'Container throughput (M TEUs)', color: '#0F766E', values: indicatorById('container-throughput').series },
        { label: 'Changi passengers (M)', color: '#B45309', values: indicatorById('changi-passengers').series },
      ]), { title: '', unit: yoyMode ? '% YoY' : 'million', compact: true, height: 110, caption: 'Record 41.1M TEUs [7]; Changi 67.7M passengers [8].', annotations: [{ year: 2020, text: 'Changi −82.7%' }, { year: 2024, text: 'Record 41.1M TEUs' }] });
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
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      yoyMode = btn.dataset.unit === 'yoy';
      draw(currentChart);
    });
  });

  // Export the featured chart: CSV of its series, and a copyable citation.
  const flash = (btn, text) => {
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = old; }, 1500);
  };
  const download = (filename, text, type) => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const csvCell = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  document.getElementById('dl-featured-csv').addEventListener('click', (ev) => {
    const lines = [['indicator', 'year', 'value', 'unit', 'source_id'].join(',')];
    for (const id of currentFeatured.indicators) {
      const ind = indicatorById(id);
      for (const p of ind.series) {
        lines.push([ind.title, p.year, p.value, ind.unit, ind.sourceId].map(csvCell).join(','));
      }
    }
    download(`lionstat-${currentFeatured.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-2010-2024.csv`, lines.join('\r\n'), 'text/csv');
    flash(ev.currentTarget, 'Saved ✓');
  });
  document.getElementById('copy-featured-cite').addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const text = `LionStat — Singapore in Numbers: ${currentFeatured.label} — ${currentFeatured.caption}`;
    try {
      await navigator.clipboard.writeText(text);
      flash(btn, 'Copied ✓');
    } catch {
      btn.textContent = text;
    }
  });
}
