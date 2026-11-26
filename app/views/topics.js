// LionStat — Topics (#/topics and #/topics/<slug>): one page per topic
// with its own charts and a full indicator table.

import {
  CPI_COMPONENTS_2024,
  PYRAMID_2024,
  SECTORS_2024,
  TOPICS,
  indicatorById,
  indicatorsByTopic,
} from '../data/indicators.js';
import { renderBarChart, renderLineChart, renderPyramidChart } from '../charts.js';
import { cite, indicatorTable, sectionHead } from './common.js';
import { t, topicName } from '../i18n.js';

function csvCell(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
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

export function render(slug) {
  const topic = TOPICS.find((t) => t.id === slug) || TOPICS[0];
  const pills = TOPICS.map(
    (t) => `<a class="pill${t.id === topic.id ? ' active' : ''}" href="#/topics/${t.id}">${topicName(t.id)}</a>`,
  ).join('');
  if (topic.id === 'demography') {
    // Two-column layout: compact pyramid on the left, annotated trend
    // chart plus the indicator table on the right — all above the fold.
    return `
  <section class="topic-page topic-demography">
    ${sectionHead(t('topics.page.kicker'), topicName(topic.id), topic.blurb)}
    <nav class="pill-row" aria-label="Topics">${pills}</nav>
    <div class="topic-demography-grid">
      <div id="topic-charts-left" class="chart-panel"></div>
      <div class="topic-right-col">
        <div id="topic-charts-right" class="chart-panel"></div>
        <div class="panel topic-table-panel">
          <div class="cc-panel-head"><h3 class="subhead">${t('topics.table.indicators')} — ${topicName(topic.id)}, ${t('topics.table.latestYear')}</h3><button type="button" class="btn-mini" id="dl-topic-csv">${t('topics.table.csv')}</button></div>
          ${indicatorTable(indicatorsByTopic(topic.id))}
        </div>
      </div>
    </div>
    <p class="panel-note">Every figure carries its source. Open any indicator in the
    <a href="#/explorer">Data Explorer</a> to see the full 2010–2024 series and download it.</p>
  </section>`;
  }
  return `
  <section class="topic-page">
    ${sectionHead(t('topics.page.kicker'), topicName(topic.id), topic.blurb)}
    <nav class="pill-row" aria-label="Topics">${pills}</nav>
    <div id="topic-charts"></div>
    <h3 class="subhead">${t('topics.table.indicators')} — ${topicName(topic.id)}, ${t('topics.table.latestYear')}</h3>
    ${indicatorTable(indicatorsByTopic(topic.id))}
    <p class="panel-note">Every figure carries its source. Open any indicator in the
    <a href="#/explorer">Data Explorer</a> to see the full 2010–2024 series and download it.</p>
  </section>`;
}

export function mount(slug) {
  const topic = TOPICS.find((t) => t.id === slug) || TOPICS[0];
  if (topic.id === 'demography') {
    renderPyramidChart(document.getElementById('topic-charts-left'), PYRAMID_2024, { rowH: 15, title: 'Age pyramid, 2024', caption: 'Share of total population by 5-year band and sex [1].' });
    renderLineChart(document.getElementById('topic-charts-right'), [
      { label: 'Total population (M)', color: '#0F766E', values: indicatorById('total-population').series },
      { label: 'Resident population (M)', color: '#B45309', values: indicatorById('resident-population').series },
    ], { title: 'Population trend, 2010–2024', unit: 'M', compact: true, caption: 'Total population 6.04M, residents 4.18M at June 2024; TFR 0.97 [1].', annotations: [{ year: 2020, text: 'Border controls −4.2%' }, { year: 2023, text: 'Rebound +5.0%' }] });
    document.getElementById('dl-topic-csv').addEventListener('click', (ev) => {
      const btn = ev.currentTarget;
      const lines = [['indicator', 'year', 'value', 'unit', 'source_id', 'table_id'].join(',')];
      for (const ind of indicatorsByTopic('demography')) {
        for (const p of ind.series) {
          lines.push([ind.title, p.year, p.value, ind.unit, ind.sourceId, ind.tableId].map(csvCell).join(','));
        }
      }
      downloadFile('lionstat-demography-2010-2024.csv', lines.join('\r\n'), 'text/csv');
      const old = btn.textContent;
      btn.textContent = 'Saved ✓';
      setTimeout(() => { btn.textContent = old; }, 1500);
    });
    return;
  }
  const host = document.getElementById('topic-charts');
  const box = (id) => {
    const div = document.createElement('div');
    div.className = 'chart-panel';
    div.id = id;
    host.appendChild(div);
    return div;
  };
  if (topic.id === 'economy') {
    renderLineChart(box('c1'), [
      { label: 'Nominal GDP (S$B)', color: '#0F766E', values: indicatorById('nominal-gdp').series },
    ], { title: 'Nominal GDP, 2010–2024', unit: 'S$B', caption: 'S$719.4B in 2024, about US$537B [2].', annotations: [{ year: 2020, text: 'COVID-19 dip −4.9%' }, { year: 2022, text: 'Rebound +16.5%' }] });
    renderLineChart(box('c2'), [
      { label: 'Real GDP growth (% YoY)', color: '#B45309', values: indicatorById('real-gdp-growth').series },
    ], { title: 'Real GDP growth, 2010–2024', unit: '% YoY', caption: '+4.4% in 2024, up from +1.8% in 2023; the 2020 contraction was −3.8% [2].', annotations: [{ year: 2020, text: 'Contraction −3.8%' }, { year: 2021, text: 'Rebound +9.7%' }] });
    renderBarChart(box('c3'), SECTORS_2024.map((s) => ({ label: s.name, value: s.share })), { title: 'GDP by industry, 2024 — share of nominal GDP', suffix: '%', caption: 'Manufacturing 18.6% and wholesale & retail trade 18.8% are the two largest industries [16].' });
  } else if (topic.id === 'labor') {
    renderLineChart(box('c1'), [
      { label: 'Resident unemployment (%)', color: '#BE123C', values: indicatorById('resident-unemployment').series },
      { label: 'Overall unemployment (%)', color: '#0F766E', values: indicatorById('overall-unemployment').series },
    ], { title: 'Unemployment, 2010–2024', unit: '%', caption: 'Resident 2.9%, overall 1.9% in 2024 — a tight labour market by any measure [18].', annotations: [{ year: 2020, text: 'Peak 4.1% resident' }] });
    renderLineChart(box('c2'), [
      { label: 'Median monthly income (S$)', color: '#0F766E', values: indicatorById('median-income').series },
    ], { title: 'Median gross monthly income, 2010–2024', unit: 'S$', caption: 'S$5,500 in 2024 including employer CPF, up 5.8% on the year [3].', annotations: [{ year: 2020, text: 'Dip −0.6%' }, { year: 2024, text: '+5.8% to S$5,500' }] });
    renderLineChart(box('c3'), [
      { label: 'Labour force participation (%)', color: '#B45309', values: indicatorById('labour-force-participation').series },
    ], { title: 'Labour force participation, 2010–2024', unit: '%', caption: '68.2% of residents aged 15 and over were in the labour force in 2024 [3].' });
  } else if (topic.id === 'prices') {
    renderLineChart(box('c1'), [
      { label: 'Headline CPI (% YoY)', color: '#BE123C', values: indicatorById('cpi-headline').series },
      { label: 'MAS core inflation (% YoY)', color: '#0F766E', values: indicatorById('cpi-core').series },
    ], { title: 'Inflation, 2010–2024', unit: '% YoY', caption: 'Headline +2.4%, core +2.7% in 2024 [4] [5].', annotations: [{ year: 2020, text: 'Deflation −0.2%' }, { year: 2022, text: 'Peak +6.1%' }] });
    renderBarChart(box('c2'), CPI_COMPONENTS_2024.map((c) => ({ label: c.name, value: c.change })), { title: 'CPI by division, 2024 — annual change', suffix: '%', caption: 'Healthcare rose fastest at +3.6%; communication barely moved at +0.4% [4].' });
  } else if (topic.id === 'trade') {
    renderLineChart(box('c1'), [
      { label: 'Total merchandise trade (S$B)', color: '#0F766E', values: indicatorById('total-trade').series },
      { label: 'NODX (S$B)', color: '#B45309', values: indicatorById('nodx').series },
    ], { title: 'Trade in goods, 2010–2024', unit: 'S$B', caption: 'Total trade S$1,286B in 2024, up 6.3%; NODX S$166.4B [6].', annotations: [{ year: 2020, text: 'COVID dip' }, { year: 2022, text: 'Peak S$1,356B' }] });
    renderLineChart(box('c2'), [
      { label: 'Container throughput (M TEUs)', color: '#0F766E', values: indicatorById('container-throughput').series },
      { label: 'Changi passengers (M)', color: '#B45309', values: indicatorById('changi-passengers').series },
    ], { title: 'Port & airport, 2010–2024', unit: 'million', caption: 'Record 41.1M TEUs [7]; 67.7M passengers at Changi [8].', annotations: [{ year: 2020, text: 'Changi −82.7%' }, { year: 2024, text: 'Record 41.1M TEUs' }] });
  } else {
    renderLineChart(box('c1'), [
      { label: 'Home ownership (%)', color: '#0F766E', values: indicatorById('home-ownership').series },
      { label: 'Households in HDB flats (%)', color: '#B45309', values: indicatorById('hdb-share').series },
    ], { title: 'Housing, 2010–2024', unit: '%', caption: '90.8% of resident households own their home; 77.4% live in HDB flats [9].' });
    renderLineChart(box('c2'), [
      { label: 'Life expectancy (years)', color: '#0F766E', values: indicatorById('life-expectancy').series },
      { label: 'Tertiary attainment (%)', color: '#B45309', values: indicatorById('tertiary-attainment').series },
    ], { title: 'Health & schooling, 2010–2024', unit: '', caption: 'Life expectancy 83.5 years [10]; 60.9% of residents 25+ hold tertiary qualifications [12].' });
    renderLineChart(box('c3'), [
      { label: 'Public transport mode share (%)', color: '#0F766E', values: indicatorById('public-transport-share').series },
    ], { title: 'Public transport share, 2010–2024', unit: '%', caption: '64% of morning-peak trips by public transport in 2024; the 2030 target is 75% [13].' });
  }
  void cite;
}
