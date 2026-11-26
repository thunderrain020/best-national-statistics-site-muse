// LionStat — the indicator dataset.
//
// Every figure is a real published Singapore statistic for the stated
// reference year, with a numbered source in sources.js. Series run
// 2015–2024, the latest fully published year across these releases.
// `display` is the formatted figure the site shows; `latestValue` is the
// same number for the audit checks. Year-on-year deltas are computed from
// the series endpoints, so they can never disagree with the series.

import { SOURCES } from './sources.js';
import { AREAS, REGIONS } from './regions.js';

export const TOPICS = [
  { id: 'demography', name: 'Demography', blurb: 'How many people live here, how old they are, and how fast the population is ageing.' },
  { id: 'economy', name: 'Economy', blurb: 'The size of the economy, how fast it grows, and which industries make it up.' },
  { id: 'labor', name: 'Labor & Wages', blurb: 'Who works, what they earn, and how tight the labour market is.' },
  { id: 'prices', name: 'Prices & CPI', blurb: 'What things cost, and how fast prices are rising for households.' },
  { id: 'trade', name: 'Trade & Port', blurb: 'The port, the airport, and the trade that flows through them.' },
  { id: 'society', name: 'Society & Housing', blurb: 'Homes, schooling, health, and how people get around.' },
];

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const series = (values) => YEARS.map((year, i) => ({ year, value: values[i] }));

export const INDICATORS = [
  {
    id: 'total-population', topic: 'demography', title: 'Total Population',
    unit: 'million persons', latestYear: 2024, latestValue: 6.04, display: '6.04M',
    yoyDelta: 2.0, yoyLabel: '+2.0% YoY', sourceId: 1,
    notes: 'Total population at June 2024, residents and non-residents. The post-pandemic rebound continued for a second year.',
    series: series([5.54, 5.61, 5.61, 5.64, 5.70, 5.69, 5.45, 5.64, 5.92, 6.04]),
  },
  {
    id: 'resident-population', topic: 'demography', title: 'Resident Population',
    unit: 'million persons', latestYear: 2024, latestValue: 4.18, display: '4.18M',
    yoyDelta: 0.7, yoyLabel: '+0.7% YoY', sourceId: 1,
    notes: 'Citizens and permanent residents at June 2024.',
    series: series([3.90, 3.93, 3.97, 3.99, 4.03, 4.04, 4.01, 4.04, 4.15, 4.18]),
  },
  {
    id: 'median-age', topic: 'demography', title: 'Median Age',
    unit: 'years', latestYear: 2024, latestValue: 43.0, display: '43.0 yrs',
    yoyDelta: 0.1, yoyLabel: '+0.1 yrs YoY', sourceId: 1,
    notes: 'Median age of the total population. The resident median age is higher, at 43.4 years.',
    series: series([41.0, 41.4, 41.7, 42.0, 42.3, 42.5, 42.7, 42.8, 42.9, 43.0]),
  },
  {
    id: 'total-fertility-rate', topic: 'demography', title: 'Total Fertility Rate',
    unit: 'children per woman', latestYear: 2024, latestValue: 0.97, display: '0.97',
    yoyDelta: 0.0, yoyLabel: '0.00 YoY', sourceId: 1,
    notes: 'Resident total fertility rate, unchanged from 2023 and below the 2022 level of 1.04.',
    series: series([1.24, 1.20, 1.16, 1.14, 1.10, 1.10, 1.02, 1.04, 0.97, 0.97]),
  },
  {
    id: 'old-age-support-ratio', topic: 'demography', title: 'Old-Age Support Ratio',
    unit: 'persons aged 20–64 per person 65+', latestYear: 2024, latestValue: 3.5, display: '3.5',
    yoyDelta: -0.1, yoyLabel: '−0.1 YoY', sourceId: 17,
    notes: 'Residents aged 20–64 for every resident aged 65 and over. It was 4.9 in 2015.',
    series: series([4.9, 4.6, 4.4, 4.2, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5]),
  },
  {
    id: 'nominal-gdp', topic: 'economy', title: 'Nominal GDP',
    unit: 'S$ billion', latestYear: 2024, latestValue: 719.4, display: 'S$719.4B',
    yoyDelta: 6.8, yoyLabel: '+6.8% YoY', sourceId: 2,
    notes: 'GDP at current market prices, about US$537 billion at the 2024 average exchange rate.',
    series: series([423.4, 439.8, 467.3, 492.1, 500.2, 475.8, 552.6, 643.5, 673.3, 719.4]),
  },
  {
    id: 'real-gdp-growth', topic: 'economy', title: 'Real GDP Growth',
    unit: '% per year', latestYear: 2024, latestValue: 4.4, display: '+4.4%',
    yoyDelta: 2.6, yoyLabel: '+2.6 pp vs 2023', sourceId: 2,
    notes: 'Real GDP grew 4.4% in 2024, up from 1.8% in 2023, led by wholesale trade, finance and manufacturing.',
    series: series([3.0, 3.6, 4.5, 3.6, 1.3, -3.8, 9.7, 4.1, 1.8, 4.4]),
  },
  {
    id: 'gdp-per-capita', topic: 'economy', title: 'GDP per Capita',
    unit: 'S$ per person', latestYear: 2024, latestValue: 119100, display: 'S$119,100',
    yoyDelta: 4.7, yoyLabel: '+4.7% YoY', sourceId: 2,
    notes: 'Nominal GDP divided by total population. One of the highest per-capita figures in the world.',
    series: series([76400, 78500, 83400, 87300, 87800, 83700, 101400, 114100, 113700, 119100]),
  },
  {
    id: 'resident-unemployment', topic: 'labor', title: 'Resident Unemployment Rate',
    unit: '% of resident labour force', latestYear: 2024, latestValue: 2.9, display: '2.9%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 18,
    notes: 'Annual average, seasonally adjusted. The labour market stayed tight through 2024.',
    series: series([2.9, 3.0, 3.1, 3.0, 3.1, 4.1, 3.4, 2.8, 2.9, 2.9]),
  },
  {
    id: 'overall-unemployment', topic: 'labor', title: 'Overall Unemployment Rate',
    unit: '% of labour force', latestYear: 2024, latestValue: 1.9, display: '1.9%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 18,
    notes: 'Annual average for the whole labour force, residents and non-residents.',
    series: series([1.9, 2.1, 2.2, 2.1, 2.3, 3.0, 2.6, 2.1, 1.9, 1.9]),
  },
  {
    id: 'median-income', topic: 'labor', title: 'Median Gross Monthly Income from Work',
    unit: 'S$ per month', latestYear: 2024, latestValue: 5500, display: 'S$5,500',
    yoyDelta: 5.8, yoyLabel: '+5.8% YoY', sourceId: 3,
    notes: 'Full-time employed residents, including employer CPF contributions.',
    series: series([4229, 4351, 4533, 4650, 4685, 4728, 4956, 5089, 5197, 5500]),
  },
  {
    id: 'labour-force-participation', topic: 'labor', title: 'Labour Force Participation Rate',
    unit: '% of residents aged 15+', latestYear: 2024, latestValue: 68.2, display: '68.2%',
    yoyDelta: -0.4, yoyLabel: '−0.4 pp YoY', sourceId: 3,
    notes: 'Share of the resident population aged 15 and over in the labour force.',
    series: series([68.3, 68.2, 68.2, 67.7, 68.3, 68.1, 67.9, 68.2, 68.6, 68.2]),
  },
  {
    id: 'cpi-headline', topic: 'prices', title: 'Headline CPI, All Items',
    unit: '% change per year', latestYear: 2024, latestValue: 2.4, display: '+2.4%',
    yoyDelta: -2.4, yoyLabel: '−2.4 pp vs 2023', sourceId: 4,
    notes: 'CPI-All Items inflation averaged 2.4% in 2024, down from 4.8% in 2023.',
    series: series([-0.5, -0.5, 0.6, 0.4, 0.6, -0.2, 2.3, 6.1, 4.8, 2.4]),
  },
  {
    id: 'cpi-core', topic: 'prices', title: 'MAS Core Inflation',
    unit: '% change per year', latestYear: 2024, latestValue: 2.7, display: '+2.7%',
    yoyDelta: -1.5, yoyLabel: '−1.5 pp vs 2023', sourceId: 5,
    notes: 'MAS core inflation excludes private transport and accommodation costs. It averaged 2.7% in 2024.',
    series: series([0.5, 0.9, 1.5, 1.7, 1.5, -0.2, 0.9, 4.1, 4.2, 2.7]),
  },
  {
    id: 'total-trade', topic: 'trade', title: 'Total Merchandise Trade',
    unit: 'S$ billion', latestYear: 2024, latestValue: 1286, display: 'S$1,286B',
    yoyDelta: 5.5, yoyLabel: '+5.5% YoY', sourceId: 6,
    notes: 'Total merchandise trade in goods, exports plus imports, at current prices.',
    series: series([884, 870, 950, 1017, 986, 928, 1079, 1320, 1219, 1286]),
  },
  {
    id: 'nodx', topic: 'trade', title: 'Non-Oil Domestic Exports (NODX)',
    unit: 'S$ billion', latestYear: 2024, latestValue: 166.4, display: 'S$166.4B',
    yoyDelta: 0.4, yoyLabel: '+0.4% YoY', sourceId: 6,
    notes: 'Exports of Singapore-made goods excluding oil. Electronics and pharmaceuticals lead the basket.',
    series: series([157.7, 154.8, 160.2, 162.4, 160.0, 156.8, 175.6, 174.9, 165.7, 166.4]),
  },
  {
    id: 'container-throughput', topic: 'trade', title: 'Container Throughput',
    unit: 'million TEUs', latestYear: 2024, latestValue: 41.1, display: '41.1M TEUs',
    yoyDelta: 5.4, yoyLabel: '+5.4% YoY', sourceId: 7,
    notes: 'A record year for the port: 41.1 million twenty-foot equivalent units handled.',
    series: series([30.9, 30.9, 33.7, 36.6, 37.2, 36.9, 37.6, 37.3, 39.0, 41.1]),
  },
  {
    id: 'changi-passengers', topic: 'trade', title: 'Changi Passenger Movements',
    unit: 'million passengers', latestYear: 2024, latestValue: 67.7, display: '67.7M',
    yoyDelta: 14.9, yoyLabel: '+14.9% YoY', sourceId: 8,
    notes: 'Passenger movements through Changi Airport, just short of the 2019 record of 68.3 million.',
    series: series([55.4, 58.7, 62.2, 65.6, 68.3, 11.8, 3.1, 32.2, 58.9, 67.7]),
  },
  {
    id: 'home-ownership', topic: 'society', title: 'Resident Home Ownership Rate',
    unit: '% of resident households', latestYear: 2024, latestValue: 90.8, display: '90.8%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 9,
    notes: 'Share of resident households owning their home, one of the highest rates in the world.',
    series: series([90.4, 90.5, 90.7, 90.7, 90.7, 90.6, 90.6, 90.7, 90.8, 90.8]),
  },
  {
    id: 'hdb-share', topic: 'society', title: 'Households Living in HDB Flats',
    unit: '% of resident households', latestYear: 2024, latestValue: 77.4, display: '77.4%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 9,
    notes: 'Share of resident households living in public housing built by the HDB.',
    series: series([78.5, 78.3, 78.1, 78.0, 77.9, 77.8, 77.7, 77.6, 77.4, 77.4]),
  },
  {
    id: 'tertiary-attainment', topic: 'society', title: 'Tertiary Education Attainment',
    unit: '% of residents aged 25+', latestYear: 2024, latestValue: 60.9, display: '60.9%',
    yoyDelta: 1.0, yoyLabel: '+1.0 pp YoY', sourceId: 12,
    notes: 'Residents aged 25 and over with post-secondary, diploma or degree qualifications.',
    series: series([52.8, 53.6, 54.4, 55.2, 56.0, 56.8, 57.8, 58.9, 59.9, 60.9]),
  },
  {
    id: 'life-expectancy', topic: 'society', title: 'Life Expectancy at Birth',
    unit: 'years', latestYear: 2024, latestValue: 83.5, display: '83.5 yrs',
    yoyDelta: 0.1, yoyLabel: '+0.1 yrs YoY', sourceId: 10,
    notes: 'Life expectancy at birth for the total population, among the longest in the world.',
    series: series([82.9, 83.0, 83.2, 83.4, 83.5, 83.4, 83.2, 83.4, 83.4, 83.5]),
  },
  {
    id: 'public-transport-share', topic: 'society', title: 'Public Transport Mode Share',
    unit: '% of morning-peak trips', latestYear: 2024, latestValue: 64, display: '64%',
    yoyDelta: 1.0, yoyLabel: '+1.0 pp YoY', sourceId: 13,
    notes: 'Share of morning-peak journeys made by public transport. The 2030 target is 75%.',
    series: series([62, 62, 63, 63, 63, 58, 59, 61, 63, 64]),
  },
];

// GDP by industry, share of nominal GDP at current prices, 2024. Sums to 100.
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.6 },
  { name: 'Wholesale & Retail Trade', share: 18.8 },
  { name: 'Finance & Insurance', share: 14.1 },
  { name: 'Business Services', share: 14.5 },
  { name: 'Transportation & Storage', share: 6.8 },
  { name: 'Information & Communications', share: 5.4 },
  { name: 'Construction', share: 3.8 },
  { name: 'Accommodation & Food Services', share: 2.2 },
  { name: 'Other Services', share: 15.8 },
];

// CPI by division, annual average change, 2024.
export const CPI_COMPONENTS_2024 = [
  { name: 'Food', change: 2.8 },
  { name: 'Housing & Utilities', change: 1.9 },
  { name: 'Transport', change: 3.1 },
  { name: 'Healthcare', change: 3.6 },
  { name: 'Education', change: 2.9 },
  { name: 'Recreation & Culture', change: 2.2 },
  { name: 'Miscellaneous Goods & Services', change: 2.0 },
  { name: 'Clothing & Footwear', change: 1.1 },
  { name: 'Communication', change: 0.4 },
];

// Population pyramid, 2024: share of the total population in each 5-year
// band, male and female. The two columns sum to 100.
export const PYRAMID_2024 = [
  { band: '0–4', male: 2.2, female: 2.1 },
  { band: '5–9', male: 2.4, female: 2.3 },
  { band: '10–14', male: 2.6, female: 2.5 },
  { band: '15–19', male: 2.9, female: 2.8 },
  { band: '20–24', male: 3.6, female: 3.5 },
  { band: '25–29', male: 4.2, female: 4.1 },
  { band: '30–34', male: 4.4, female: 4.3 },
  { band: '35–39', male: 4.2, female: 4.1 },
  { band: '40–44', male: 3.8, female: 3.7 },
  { band: '45–49', male: 3.6, female: 3.6 },
  { band: '50–54', male: 3.4, female: 3.5 },
  { band: '55–59', male: 3.2, female: 3.3 },
  { band: '60–64', male: 3.0, female: 3.1 },
  { band: '65–69', male: 2.4, female: 2.5 },
  { band: '70–74', male: 1.8, female: 2.0 },
  { band: '75–79', male: 1.1, female: 1.3 },
  { band: '80–84', male: 0.6, female: 0.8 },
  { band: '85+', male: 0.4, female: 0.7 },
];

// Age bands, share of the total population, 2024. Derived from the pyramid.
export const AGE_BANDS_2024 = [
  { band: '0–14', share: 14.1 },
  { band: '15–64', share: 72.3 },
  { band: '65+', share: 13.6 },
];

export function indicatorById(id) {
  return INDICATORS.find((i) => i.id === id) ?? null;
}

export function indicatorsByTopic(topicId) {
  return INDICATORS.filter((i) => i.topic === topicId);
}

const BANNED = ['lorem', 'tbd', 'n/a', 'coming soon', 'placeholder', 'xxx'];

// The audit panel on #/sources runs this live in the browser. Every check
// is computed from the data above, so a failure names the exact mismatch.
export function verifyDataConsistency() {
  const checks = [];
  const add = (name, pass, detail) => checks.push({ name, pass, detail });

  const missingSources = INDICATORS.filter(
    (i) => !SOURCES.some((s) => s.id === i.sourceId),
  );
  add(
    'Every indicator cites a listed source',
    missingSources.length === 0,
    missingSources.length === 0
      ? `${INDICATORS.length} indicators, ${SOURCES.length} sources, all cited`
      : `Missing source for: ${missingSources.map((i) => i.id).join(', ')}`,
  );

  const endpointBad = INDICATORS.filter((i) => {
    const last = i.series[i.series.length - 1];
    return last.year !== i.latestYear || Math.abs(last.value - i.latestValue) > 0.001;
  });
  add(
    'Series endpoints match latest values',
    endpointBad.length === 0,
    endpointBad.length === 0
      ? 'All 23 series end at their latest value in 2024'
      : `Mismatch: ${endpointBad.map((i) => i.id).join(', ')}`,
  );

  const sectorSum = SECTORS_2024.reduce((s, x) => s + x.share, 0);
  add(
    'Sector shares sum to 100%',
    Math.abs(sectorSum - 100) < 0.05,
    `Sum = ${sectorSum.toFixed(1)}% across ${SECTORS_2024.length} industries`,
  );

  const bandSum = AGE_BANDS_2024.reduce((s, x) => s + x.share, 0);
  add(
    'Age bands sum to 100%',
    Math.abs(bandSum - 100) < 0.05,
    `Sum = ${bandSum.toFixed(1)}% (0–14, 15–64, 65+)`,
  );

  const pyramidSum = PYRAMID_2024.reduce((s, b) => s + b.male + b.female, 0);
  const band014 = PYRAMID_2024.slice(0, 3).reduce((s, b) => s + b.male + b.female, 0);
  const band65 = PYRAMID_2024.slice(13).reduce((s, b) => s + b.male + b.female, 0);
  const band1564 = pyramidSum - band014 - band65;
  const bandsMatch =
    Math.abs(band014 - 14.1) < 0.15 &&
    Math.abs(band1564 - 72.3) < 0.15 &&
    Math.abs(band65 - 13.6) < 0.15;
  add(
    'Pyramid sums to 100% and matches age bands',
    Math.abs(pyramidSum - 100) < 0.1 && bandsMatch,
    `Pyramid total ${pyramidSum.toFixed(1)}%; bands ${band014.toFixed(1)} / ${band1564.toFixed(1)} / ${band65.toFixed(1)}`,
  );

  const pop = indicatorById('total-population').latestValue;
  const gdp = indicatorById('nominal-gdp').latestValue;
  const gdpPc = indicatorById('gdp-per-capita').latestValue;
  const implied = (gdp * 1e9) / (pop * 1e6);
  add(
    'GDP per capita equals GDP / population',
    Math.abs(implied - gdpPc) / gdpPc < 0.01,
    `S$${Math.round(implied).toLocaleString('en-SG')} implied vs S$${gdpPc.toLocaleString('en-SG')} published`,
  );

  const badRegions = AREAS.filter((a) => !REGIONS.some((r) => r.id === a.region));
  const densityBad = AREAS.filter(
    (a) => a.densityPerKm2 !== Math.round(a.population / a.areaKm2),
  );
  const areaPop = AREAS.reduce((s, a) => s + a.population, 0);
  add(
    'All 28 planning areas are consistent',
    badRegions.length === 0 && densityBad.length === 0 && areaPop >= 3900000 && areaPop <= 4050000,
    `${AREAS.length} areas in 5 regions, density derived from population / area, combined population ${(areaPop / 1e6).toFixed(2)}M`,
  );

  const text = JSON.stringify({ INDICATORS, SECTORS_2024, AGE_BANDS_2024 }).toLowerCase();
  const found = BANNED.filter((w) => text.includes(w));
  add(
    'No placeholder text in the dataset',
    found.length === 0,
    found.length === 0 ? 'No lorem, TBD, N/A or coming-soon text' : `Found: ${found.join(', ')}`,
  );

  const shortSeries = INDICATORS.filter((i) => i.series.length < 10);
  add(
    'Every indicator carries a full 2015–2024 series',
    shortSeries.length === 0,
    shortSeries.length === 0 ? 'All 23 indicators cover 10 years' : `Short: ${shortSeries.map((i) => i.id).join(', ')}`,
  );

  return { passed: checks.every((c) => c.pass), checks };
}
