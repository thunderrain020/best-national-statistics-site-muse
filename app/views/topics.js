// LionStat — Topics (#/topics and #/topics/<slug>): one page per topic
// with its own charts and a full indicator table.

import {
  AGE_BANDS_2024,
  CPI_COMPONENTS_2024,
  PYRAMID_2024,
  SECTORS_2024,
  TOPICS,
  indicatorById,
  indicatorsByTopic,
} from '../data/indicators.js';
import { renderBarChart, renderLineChart, renderPyramidChart } from '../charts.js';
import { cite, indicatorTable, sectionHead } from './common.js';

export function render(slug) {
  const topic = TOPICS.find((t) => t.id === slug) || TOPICS[0];
  const pills = TOPICS.map(
    (t) => `<a class="pill${t.id === topic.id ? ' active' : ''}" href="#/topics/${t.id}">${t.name}</a>`,
  ).join('');
  return `
  <section class="topic-page">
    ${sectionHead('Topics', topic.name, topic.blurb)}
    <nav class="pill-row" aria-label="Topics">${pills}</nav>
    <div id="topic-charts"></div>
    <h3 class="subhead">Indicators — ${topic.name}, latest year</h3>
    ${indicatorTable(indicatorsByTopic(topic.id))}
    <p class="panel-note">Every figure carries its source. Open any indicator in the
    <a href="#/explorer">Data Explorer</a> to see the full 2015–2024 series and download it.</p>
  </section>`;
}

export function mount(slug) {
  const host = document.getElementById('topic-charts');
  const topic = TOPICS.find((t) => t.id === slug) || TOPICS[0];
  const box = (id) => {
    const div = document.createElement('div');
    div.className = 'chart-panel';
    div.id = id;
    host.appendChild(div);
    return div;
  };
  if (topic.id === 'demography') {
    renderLineChart(box('c1'), [
      { label: 'Total population (M)', color: '#0F766E', values: indicatorById('total-population').series },
      { label: 'Resident population (M)', color: '#B45309', values: indicatorById('resident-population').series },
    ], { title: 'Population trend, 2015–2024', unit: 'M', caption: 'Total population 6.04M, residents 4.18M at June 2024 [1].' });
    renderPyramidChart(box('c2'), PYRAMID_2024, { title: 'Age pyramid, 2024', caption: 'Share of total population by 5-year band and sex [1].' });
    renderBarChart(box('c3'), AGE_BANDS_2024.map((b) => ({ label: `Aged ${b.band}`, value: b.share })), { title: 'Age bands, 2024', suffix: '%', caption: 'Seniors 65+ are 13.6% of the total population; children 0–14 are 14.1% [1].' });
  } else if (topic.id === 'economy') {
    renderLineChart(box('c1'), [
      { label: 'Nominal GDP (S$B)', color: '#0F766E', values: indicatorById('nominal-gdp').series },
    ], { title: 'Nominal GDP, 2015–2024', unit: 'S$B', caption: 'S$719.4B in 2024, about US$537B [2].' });
    renderLineChart(box('c2'), [
      { label: 'Real GDP growth (% YoY)', color: '#B45309', values: indicatorById('real-gdp-growth').series },
    ], { title: 'Real GDP growth, 2015–2024', unit: '% YoY', caption: '+4.4% in 2024, up from +1.8% in 2023; the 2020 contraction was −3.8% [2].' });
    renderBarChart(box('c3'), SECTORS_2024.map((s) => ({ label: s.name, value: s.share })), { title: 'GDP by industry, 2024 — share of nominal GDP', suffix: '%', caption: 'Manufacturing 18.6% and wholesale & retail trade 18.8% are the two largest industries [16].' });
  } else if (topic.id === 'labor') {
    renderLineChart(box('c1'), [
      { label: 'Resident unemployment (%)', color: '#BE123C', values: indicatorById('resident-unemployment').series },
      { label: 'Overall unemployment (%)', color: '#0F766E', values: indicatorById('overall-unemployment').series },
    ], { title: 'Unemployment, 2015–2024', unit: '%', caption: 'Resident 2.9%, overall 1.9% in 2024 — a tight labour market by any measure [18].' });
    renderLineChart(box('c2'), [
      { label: 'Median monthly income (S$)', color: '#0F766E', values: indicatorById('median-income').series },
    ], { title: 'Median gross monthly income, 2015–2024', unit: 'S$', caption: 'S$5,500 in 2024 including employer CPF, up 5.8% on the year [3].' });
    renderLineChart(box('c3'), [
      { label: 'Labour force participation (%)', color: '#B45309', values: indicatorById('labour-force-participation').series },
    ], { title: 'Labour force participation, 2015–2024', unit: '%', caption: '68.2% of residents aged 15 and over were in the labour force in 2024 [3].' });
  } else if (topic.id === 'prices') {
    renderLineChart(box('c1'), [
      { label: 'Headline CPI (% YoY)', color: '#BE123C', values: indicatorById('cpi-headline').series },
      { label: 'MAS core inflation (% YoY)', color: '#0F766E', values: indicatorById('cpi-core').series },
    ], { title: 'Inflation, 2015–2024', unit: '% YoY', caption: 'Headline +2.4%, core +2.7% in 2024 [4] [5].' });
    renderBarChart(box('c2'), CPI_COMPONENTS_2024.map((c) => ({ label: c.name, value: c.change })), { title: 'CPI by division, 2024 — annual change', suffix: '%', caption: 'Healthcare rose fastest at +3.6%; communication barely moved at +0.4% [4].' });
  } else if (topic.id === 'trade') {
    renderLineChart(box('c1'), [
      { label: 'Total merchandise trade (S$B)', color: '#0F766E', values: indicatorById('total-trade').series },
      { label: 'NODX (S$B)', color: '#B45309', values: indicatorById('nodx').series },
    ], { title: 'Trade in goods, 2015–2024', unit: 'S$B', caption: 'Total trade S$1,286B in 2024, up 5.5%; NODX S$166.4B [6].' });
    renderLineChart(box('c2'), [
      { label: 'Container throughput (M TEUs)', color: '#0F766E', values: indicatorById('container-throughput').series },
      { label: 'Changi passengers (M)', color: '#B45309', values: indicatorById('changi-passengers').series },
    ], { title: 'Port & airport, 2015–2024', unit: 'million', caption: 'Record 41.1M TEUs [7]; 67.7M passengers at Changi [8].' });
  } else {
    renderLineChart(box('c1'), [
      { label: 'Home ownership (%)', color: '#0F766E', values: indicatorById('home-ownership').series },
      { label: 'Households in HDB flats (%)', color: '#B45309', values: indicatorById('hdb-share').series },
    ], { title: 'Housing, 2015–2024', unit: '%', caption: '90.8% of resident households own their home; 77.4% live in HDB flats [9].' });
    renderLineChart(box('c2'), [
      { label: 'Life expectancy (years)', color: '#0F766E', values: indicatorById('life-expectancy').series },
      { label: 'Tertiary attainment (%)', color: '#B45309', values: indicatorById('tertiary-attainment').series },
    ], { title: 'Health & schooling, 2015–2024', unit: '', caption: 'Life expectancy 83.5 years [10]; 60.9% of residents 25+ hold tertiary qualifications [12].' });
    renderLineChart(box('c3'), [
      { label: 'Public transport mode share (%)', color: '#0F766E', values: indicatorById('public-transport-share').series },
    ], { title: 'Public transport share, 2015–2024', unit: '%', caption: '64% of morning-peak trips by public transport in 2024; the 2030 target is 75% [13].' });
  }
  void cite;
}
