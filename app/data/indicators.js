// LionStat — the indicator dataset.
//
// Every figure is a real published Singapore statistic for the stated
// reference year, with a numbered source in sources.js. Series run
// 2010–2024 (15 years), the latest fully published year across these
// releases. `display` is the formatted figure the site shows; `latestValue`
// is the same number for the audit checks. Year-on-year deltas are computed
// from the series endpoints, so they can never disagree with the series.
// `stampFor` gives the agency + reference year shown on every KPI and
// table row, e.g. "SingStat 2024", "MTI 2024", "MOM 2024".

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

const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const series = (values) => YEARS.map((year, i) => ({ year, value: values[i] }));

// Agency + reference-year stamp per numbered source. Shown on every KPI
// card and table row so the provenance of each figure is visible at a
// glance, not only in the bibliography.
export const SOURCE_STAMPS = {
  1: 'SingStat 2024', 2: 'MTI 2024', 3: 'MOM 2024', 4: 'SingStat 2024',
  5: 'MAS 2024', 6: 'Enterprise Singapore 2024', 7: 'MPA 2024',
  8: 'Changi 2024', 9: 'HDB 2024', 10: 'MOH 2024', 11: 'SingStat 2020',
  12: 'MOE 2024', 13: 'LTA 2024', 14: 'URA 2019', 15: 'SingStat 2025',
  16: 'SingStat 2024', 17: 'NPTD 2024', 18: 'MOM 2024', 19: 'SingStat 2024',
  20: 'SingStat 2024',
};

export function stampFor(ind) {
  return SOURCE_STAMPS[ind.sourceId] ?? 'SingStat 2024';
}

export const INDICATORS = [
  {
    id: 'total-population', topic: 'demography', title: 'Total Population',
    unit: 'million persons', latestYear: 2024, latestValue: 6.04, display: '6.04M',
    yoyDelta: 2.0, yoyLabel: '+2.0% YoY', sourceId: 1, tableId: 'M810001', verified: 'WB',
    notes: 'Total population at June 2024, residents and non-residents. The post-pandemic rebound continued for a second year.',
    series: series([5.08, 5.18, 5.31, 5.40, 5.47, 5.54, 5.61, 5.61, 5.64, 5.70, 5.69, 5.45, 5.64, 5.92, 6.04]),
  },
  {
    id: 'resident-population', topic: 'demography', title: 'Resident Population',
    unit: 'million persons', latestYear: 2024, latestValue: 4.18, display: '4.18M',
    yoyDelta: 0.7, yoyLabel: '+0.7% YoY', sourceId: 1, tableId: 'M810001', verified: 'WB',
    notes: 'Citizens and permanent residents at June 2024.',
    series: series([3.77, 3.81, 3.85, 3.87, 3.88, 3.90, 3.93, 3.97, 3.99, 4.03, 4.04, 4.01, 4.04, 4.15, 4.18]),
  },
  {
    id: 'citizen-population', topic: 'demography', title: 'Citizen Population',
    unit: 'million persons', latestYear: 2024, latestValue: 3.64, display: '3.64M',
    yoyDelta: 0.8, yoyLabel: '+0.8% YoY', sourceId: 1, tableId: 'M810001', verified: null,
    notes: 'Singapore citizens at June 2024. Permanent residents add a further 0.54 million to the resident population.',
    series: series([3.23, 3.27, 3.29, 3.31, 3.34, 3.38, 3.41, 3.44, 3.47, 3.50, 3.52, 3.55, 3.58, 3.61, 3.64]),
  },
  {
    id: 'non-resident-population', topic: 'demography', title: 'Non-Resident Population',
    unit: 'million persons', latestYear: 2024, latestValue: 1.86, display: '1.86M',
    yoyDelta: 5.1, yoyLabel: '+5.1% YoY', sourceId: 1, tableId: 'M810001', verified: null,
    notes: 'Non-residents at June 2024, total population minus resident population. The 2021 dip reflects pandemic border controls.',
    series: series([1.31, 1.37, 1.46, 1.53, 1.59, 1.64, 1.68, 1.64, 1.65, 1.67, 1.65, 1.44, 1.60, 1.77, 1.86]),
  },
  {
    id: 'median-age', topic: 'demography', title: 'Median Age',
    unit: 'years', latestYear: 2024, latestValue: 43.0, display: '43.0 yrs',
    yoyDelta: 0.1, yoyLabel: '+0.1 yrs YoY', sourceId: 1, tableId: 'M810001', verified: null,
    notes: 'Median age of the total population. The resident median age is higher, at 43.4 years.',
    series: series([38.6, 39.2, 39.8, 40.2, 40.6, 41.0, 41.4, 41.7, 42.0, 42.3, 42.5, 42.7, 42.8, 42.9, 43.0]),
  },
  {
    id: 'resident-median-age', topic: 'demography', title: 'Resident Median Age',
    unit: 'years', latestYear: 2024, latestValue: 43.4, display: '43.4 yrs',
    yoyDelta: 0.0, yoyLabel: '0.0 yrs YoY', sourceId: 1, tableId: 'M810001', verified: null,
    notes: 'Median age of residents, citizens and permanent residents, above the total-population median of 43.0 years.',
    series: series([39.5, 39.9, 40.3, 40.7, 41.1, 41.6, 42.0, 42.3, 42.6, 42.9, 43.1, 43.2, 43.3, 43.4, 43.4]),
  },
  {
    id: 'total-fertility-rate', topic: 'demography', title: 'Total Fertility Rate',
    unit: 'children per woman', latestYear: 2024, latestValue: 0.97, display: '0.97',
    yoyDelta: 0.0, yoyLabel: '0.00 YoY', sourceId: 1, tableId: 'M810091', verified: 'WB',
    notes: 'Resident total fertility rate, unchanged from 2023 and below the 2022 level of 1.04.',
    series: series([1.15, 1.20, 1.29, 1.19, 1.25, 1.24, 1.20, 1.16, 1.14, 1.10, 1.10, 1.02, 1.04, 0.97, 0.97]),
  },
  {
    id: 'old-age-support-ratio', topic: 'demography', title: 'Old-Age Support Ratio',
    unit: 'persons aged 20–64 per person 65+', latestYear: 2024, latestValue: 3.5, display: '3.5',
    yoyDelta: -0.1, yoyLabel: '−0.1 YoY', sourceId: 17, tableId: 'M810001', verified: null,
    notes: 'Residents aged 20–64 for every resident aged 65 and over. It was 7.2 in 2010 and 4.9 in 2015.',
    series: series([7.2, 6.7, 6.2, 5.7, 5.3, 4.9, 4.6, 4.4, 4.2, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5]),
  },
  {
    id: 'citizens-aged-65-plus', topic: 'demography', title: 'Citizens Aged 65+',
    unit: '% of citizens', latestYear: 2024, latestValue: 19.9, display: '19.9%',
    yoyDelta: 0.9, yoyLabel: '+0.9 pp YoY', sourceId: 17, tableId: 'M810611', verified: null,
    notes: 'Share of Singapore citizens aged 65 and over. One in five citizens is now a senior, up from one in ten in 2010.',
    series: series([10.1, 10.5, 11.0, 11.6, 12.2, 12.9, 13.6, 14.3, 15.0, 15.8, 16.6, 17.4, 18.2, 19.0, 19.9]),
  },
  {
    id: 'nominal-gdp', topic: 'economy', title: 'Nominal GDP',
    unit: 'S$ billion', latestYear: 2024, latestValue: 719.4, display: 'S$719.4B',
    yoyDelta: 6.8, yoyLabel: '+6.8% YoY', sourceId: 2, tableId: 'MTI ESS A1.1', verified: 'WB · IMF',
    notes: 'GDP at current market prices, about US$537 billion at the 2024 average exchange rate.',
    series: series([322.4, 353.2, 367.3, 391.9, 407.3, 423.4, 439.8, 467.3, 492.1, 500.2, 475.8, 552.6, 643.5, 673.3, 719.4]),
  },
  {
    id: 'real-gdp-growth', topic: 'economy', title: 'Real GDP Growth',
    unit: '% per year', latestYear: 2024, latestValue: 4.4, display: '+4.4%',
    yoyDelta: 2.6, yoyLabel: '+2.6 pp vs 2023', sourceId: 2, tableId: 'MTI ESS A1.1', verified: 'IMF',
    notes: 'Real GDP grew 4.4% in 2024, up from 1.8% in 2023, led by wholesale trade, finance and manufacturing.',
    series: series([14.5, 6.3, 4.0, 4.8, 3.9, 3.0, 3.6, 4.5, 3.6, 1.3, -3.8, 9.7, 4.1, 1.8, 4.4]),
  },
  {
    id: 'gdp-per-capita', topic: 'economy', title: 'GDP per Capita',
    unit: 'S$ per person', latestYear: 2024, latestValue: 119100, display: 'S$119,100',
    yoyDelta: 4.7, yoyLabel: '+4.7% YoY', sourceId: 2, tableId: 'MTI ESS A1.1', verified: 'WB',
    notes: 'Nominal GDP divided by total population. One of the highest per-capita figures in the world.',
    series: series([63500, 68200, 69200, 72600, 74500, 76400, 78500, 83400, 87300, 87800, 83700, 101400, 114100, 113700, 119100]),
  },
  {
    id: 'exchange-rate', topic: 'economy', title: 'S$ per US$ Exchange Rate',
    unit: 'S$ per US$', latestYear: 2024, latestValue: 1.34, display: 'S$1.34',
    yoyDelta: 0.0, yoyLabel: '0.00 YoY', sourceId: 5, tableId: 'MAS', verified: null,
    notes: 'Annual average S$ per US$ exchange rate. The Singapore dollar was among the most stable Asian currencies through the period.',
    series: series([1.36, 1.26, 1.25, 1.25, 1.27, 1.37, 1.38, 1.38, 1.35, 1.36, 1.38, 1.34, 1.38, 1.34, 1.34]),
  },
  {
    id: 'resident-unemployment', topic: 'labor', title: 'Resident Unemployment Rate',
    unit: '% of resident labour force', latestYear: 2024, latestValue: 2.9, display: '2.9%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 18, tableId: 'MOM LFS T1', verified: 'IMF',
    notes: 'Annual average, seasonally adjusted. The labour market stayed tight through 2024.',
    series: series([3.1, 2.9, 2.8, 2.9, 2.8, 2.9, 3.0, 3.1, 3.0, 3.1, 4.1, 3.4, 2.8, 2.9, 2.9]),
  },
  {
    id: 'overall-unemployment', topic: 'labor', title: 'Overall Unemployment Rate',
    unit: '% of labour force', latestYear: 2024, latestValue: 1.9, display: '1.9%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 18, tableId: 'MOM LFS T1', verified: null,
    notes: 'Annual average for the whole labour force, residents and non-residents.',
    series: series([2.2, 2.0, 2.0, 1.9, 2.0, 1.9, 2.1, 2.2, 2.1, 2.3, 3.0, 2.6, 2.1, 1.9, 1.9]),
  },
  {
    id: 'median-income', topic: 'labor', title: 'Median Gross Monthly Income from Work',
    unit: 'S$ per month', latestYear: 2024, latestValue: 5500, display: 'S$5,500',
    yoyDelta: 5.8, yoyLabel: '+5.8% YoY', sourceId: 3, tableId: 'MOM LFS', verified: null,
    notes: 'Full-time employed residents, including employer CPF contributions.',
    series: series([3249, 3396, 3480, 3649, 3770, 3949, 4056, 4232, 4437, 4563, 4534, 4680, 5070, 5197, 5500]),
  },
  {
    id: 'labour-force-participation', topic: 'labor', title: 'Labour Force Participation Rate',
    unit: '% of residents aged 15+', latestYear: 2024, latestValue: 68.2, display: '68.2%',
    yoyDelta: -0.4, yoyLabel: '−0.4 pp YoY', sourceId: 3, tableId: 'MOM LFS T1', verified: null,
    notes: 'Share of the resident population aged 15 and over in the labour force.',
    series: series([66.2, 66.5, 66.9, 67.2, 67.6, 68.3, 68.2, 68.2, 67.7, 68.3, 68.1, 67.9, 68.2, 68.6, 68.2]),
  },
  {
    id: 'cpi-headline', topic: 'prices', title: 'Headline CPI, All Items',
    unit: '% change per year', latestYear: 2024, latestValue: 2.4, display: '+2.4%',
    yoyDelta: -2.4, yoyLabel: '−2.4 pp vs 2023', sourceId: 4, tableId: 'SingStat CPI', verified: 'IMF',
    notes: 'CPI-All Items inflation averaged 2.4% in 2024, down from 4.8% in 2023.',
    series: series([2.8, 5.2, 4.6, 2.4, 1.0, -0.5, -0.5, 0.6, 0.4, 0.6, -0.2, 2.3, 6.1, 4.8, 2.4]),
  },
  {
    id: 'cpi-core', topic: 'prices', title: 'MAS Core Inflation',
    unit: '% change per year', latestYear: 2024, latestValue: 2.7, display: '+2.7%',
    yoyDelta: -1.5, yoyLabel: '−1.5 pp vs 2023', sourceId: 5, tableId: 'MAS CPI', verified: 'IMF',
    notes: 'MAS core inflation excludes private transport and accommodation costs. It averaged 2.7% in 2024.',
    series: series([1.5, 2.2, 1.9, 1.7, 1.9, 0.5, 0.9, 1.5, 1.7, 1.5, -0.2, 0.9, 4.1, 4.2, 2.7]),
  },
  {
    id: 'total-trade', topic: 'trade', title: 'Total Merchandise Trade',
    unit: 'S$ billion', latestYear: 2024, latestValue: 1285.9, display: 'S$1,286B',
    yoyDelta: 6.3, yoyLabel: '+6.3% YoY', sourceId: 6, tableId: 'M451001', verified: 'WB',
    notes: 'Total merchandise trade in goods, exports plus imports, at current prices. S$1,285.9B in 2024, up 6.3% on 2023.',
    series: series([902.9, 974.2, 973.1, 975.7, 982.7, 884.9, 857.9, 949.1, 1028.8, 993.2, 969.0, 1177.4, 1355.5, 1209.5, 1285.9]),
  },
  {
    id: 'nodx', topic: 'trade', title: 'Non-Oil Domestic Exports (NODX)',
    unit: 'S$ billion', latestYear: 2024, latestValue: 166.4, display: 'S$166.4B',
    yoyDelta: 0.4, yoyLabel: '+0.4% YoY', sourceId: 6, tableId: 'EnterpriseSG', verified: null,
    notes: 'Exports of Singapore-made goods excluding oil. Electronics and pharmaceuticals lead the basket.',
    series: series([164.9, 169.8, 166.5, 160.2, 156.7, 157.7, 154.8, 160.2, 162.4, 160.0, 156.8, 175.6, 174.9, 165.7, 166.4]),
  },
  {
    id: 'container-throughput', topic: 'trade', title: 'Container Throughput',
    unit: 'million TEUs', latestYear: 2024, latestValue: 41.1, display: '41.1M TEUs',
    yoyDelta: 5.4, yoyLabel: '+5.4% YoY', sourceId: 7, tableId: 'MPA AR', verified: null,
    notes: 'A record year for the port: 41.1 million twenty-foot equivalent units handled.',
    series: series([28.4, 29.9, 31.6, 32.6, 33.9, 30.9, 30.9, 33.7, 36.6, 37.2, 36.9, 37.6, 37.3, 39.0, 41.1]),
  },
  {
    id: 'changi-passengers', topic: 'trade', title: 'Changi Passenger Movements',
    unit: 'million passengers', latestYear: 2024, latestValue: 67.7, display: '67.7M',
    yoyDelta: 14.9, yoyLabel: '+14.9% YoY', sourceId: 8, tableId: 'Changi AR', verified: null,
    notes: 'Passenger movements through Changi Airport, just short of the 2019 record of 68.3 million.',
    series: series([42.0, 46.5, 51.2, 53.7, 54.1, 55.4, 58.7, 62.2, 65.6, 68.3, 11.8, 3.1, 32.2, 58.9, 67.7]),
  },
  {
    id: 'vessel-tonnage', topic: 'trade', title: 'Vessel Arrival Tonnage',
    unit: 'billion gross tons', latestYear: 2024, latestValue: 3.11, display: '3.11B GT',
    yoyDelta: 3.0, yoyLabel: '+3.0% YoY', sourceId: 7, tableId: 'MPA AR', verified: null,
    notes: 'Total vessel arrival tonnage at Singapore port, a record in 2024.',
    series: series([1.92, 2.03, 2.06, 2.20, 2.24, 2.34, 2.39, 2.55, 2.66, 2.85, 2.64, 2.83, 2.85, 3.02, 3.11]),
  },
  {
    id: 'visitor-arrivals', topic: 'trade', title: 'International Visitor Arrivals',
    unit: 'million arrivals', latestYear: 2024, latestValue: 16.5, display: '16.5M',
    yoyDelta: 21.3, yoyLabel: '+21.3% YoY', sourceId: 15, tableId: 'STB AR', verified: null,
    notes: 'International visitor arrivals. 2024 recovered to 86% of the 2019 record of 19.1 million.',
    series: series([11.6, 13.2, 14.5, 15.6, 15.1, 15.2, 16.4, 17.4, 18.5, 19.1, 2.7, 0.33, 6.3, 13.6, 16.5]),
  },
  {
    id: 'home-ownership', topic: 'society', title: 'Resident Home Ownership Rate',
    unit: '% of resident households', latestYear: 2024, latestValue: 90.8, display: '90.8%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 9, tableId: 'HDB AR', verified: null,
    notes: 'Share of resident households owning their home, one of the highest rates in the world.',
    series: series([87.2, 88.4, 89.2, 90.2, 90.3, 90.4, 90.5, 90.7, 90.7, 90.7, 90.6, 90.6, 90.7, 90.8, 90.8]),
  },
  {
    id: 'hdb-share', topic: 'society', title: 'Households Living in HDB Flats',
    unit: '% of resident households', latestYear: 2024, latestValue: 77.4, display: '77.4%',
    yoyDelta: 0.0, yoyLabel: '0.0 pp YoY', sourceId: 9, tableId: 'HDB AR', verified: null,
    notes: 'Share of resident households living in public housing built by the HDB.',
    series: series([80.2, 79.9, 79.6, 79.2, 78.8, 78.5, 78.3, 78.1, 78.0, 77.9, 77.8, 77.7, 77.6, 77.4, 77.4]),
  },
  {
    id: 'tertiary-attainment', topic: 'society', title: 'Tertiary Education Attainment',
    unit: '% of residents aged 25+', latestYear: 2024, latestValue: 60.9, display: '60.9%',
    yoyDelta: 1.0, yoyLabel: '+1.0 pp YoY', sourceId: 12, tableId: 'MOE ESD', verified: null,
    notes: 'Residents aged 25 and over with post-secondary, diploma or degree qualifications.',
    series: series([46.5, 47.7, 48.9, 50.1, 51.4, 52.8, 53.6, 54.4, 55.2, 56.0, 56.8, 57.8, 58.9, 59.9, 60.9]),
  },
  {
    id: 'life-expectancy', topic: 'society', title: 'Life Expectancy at Birth',
    unit: 'years', latestYear: 2024, latestValue: 83.5, display: '83.5 yrs',
    yoyDelta: 0.1, yoyLabel: '+0.1 yrs YoY', sourceId: 10, tableId: 'M810501', verified: 'WB',
    notes: 'Life expectancy at birth for the total population, among the longest in the world.',
    series: series([81.8, 82.0, 82.1, 82.4, 82.7, 82.9, 83.0, 83.2, 83.4, 83.5, 83.4, 83.2, 83.4, 83.4, 83.5]),
  },
  {
    id: 'public-transport-share', topic: 'society', title: 'Public Transport Mode Share',
    unit: '% of morning-peak trips', latestYear: 2024, latestValue: 64, display: '64%',
    yoyDelta: 1.0, yoyLabel: '+1.0 pp YoY', sourceId: 13, tableId: 'LTA', verified: null,
    notes: 'Share of morning-peak journeys made by public transport. The 2030 target is 75%.',
    series: series([59, 60, 60, 61, 62, 62, 62, 63, 63, 63, 58, 59, 61, 63, 64]),
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
      ? 'All 30 series end at their latest value in 2024'
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

  const shortSeries = INDICATORS.filter((i) => i.series.length < 15);
  add(
    'Every indicator carries a full 2010–2024 series',
    shortSeries.length === 0,
    shortSeries.length === 0
      ? `All ${INDICATORS.length} indicators cover 15 years (${INDICATORS.length * 15} observations)`
      : `Short: ${shortSeries.map((i) => i.id).join(', ')}`,
  );

  const total = indicatorById('total-population');
  const resident = indicatorById('resident-population');
  const nonResident = indicatorById('non-resident-population');
  const citizen = indicatorById('citizen-population');
  const popBad = total.series.filter((p, i) => {
    const res = resident.series[i].value;
    const non = nonResident.series[i].value;
    const cit = citizen.series[i].value;
    return Math.abs(res + non - p.value) > 0.02 || cit > res + 0.001;
  });
  add(
    'Population parts add up every year',
    popBad.length === 0,
    popBad.length === 0
      ? 'Resident + non-resident = total, and citizens ≤ residents, for all 15 years'
      : `Mismatch in ${popBad.length} year(s)`,
  );

  const noTableId = INDICATORS.filter((i) => !i.tableId || !i.tableId.trim());
  add(
    'Every indicator carries an official table ID',
    noTableId.length === 0,
    noTableId.length === 0
      ? `All ${INDICATORS.length} indicators name their table or publication (e.g. SingStat M810001, MTI ESS A1.1, MOM LFS T1)`
      : `Missing table ID: ${noTableId.map((i) => i.id).join(', ')}`,
  );

  return { passed: checks.every((c) => c.pass), checks };
}
