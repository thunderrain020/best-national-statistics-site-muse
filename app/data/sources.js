// LionStat — numbered source citations.
//
// Every figure on the site carries one of these numbered citations, shown
// as a [n] chip next to the figure and listed in full on #/sources. All
// are official Singapore publications: the Department of Statistics
// (SingStat), the Ministry of Trade and Industry, the Ministry of
// Manpower, the Monetary Authority of Singapore, and the statutory
// boards that publish the underlying series.

export const SOURCES = [
  {
    id: 1,
    agency: 'Department of Statistics (SingStat)',
    title: 'Population Trends 2024',
    period: 'June 2024',
    cadence: 'Annual, September',
    note: 'Total and resident population, age structure, median age, fertility.',
  },
  {
    id: 2,
    agency: 'Ministry of Trade and Industry (MTI)',
    title: 'Economic Survey of Singapore 2024',
    period: 'Full year 2024',
    cadence: 'Quarterly, with annual survey in February',
    note: 'Real GDP growth, nominal GDP, GDP by industry, GDP per capita.',
  },
  {
    id: 3,
    agency: 'Ministry of Manpower (MOM)',
    title: 'Labour Force in Singapore 2024',
    period: 'June 2024',
    cadence: 'Annual, January',
    note: 'Labour force participation, employment by industry, median income.',
  },
  {
    id: 4,
    agency: 'Department of Statistics (SingStat)',
    title: 'Consumer Price Index, December 2024',
    period: 'Full year 2024',
    cadence: 'Monthly, 23rd of the following month',
    note: 'Headline CPI all-items and CPI by division.',
  },
  {
    id: 5,
    agency: 'Monetary Authority of Singapore (MAS)',
    title: 'Monetary Policy Statement & Macroeconomic Review, October 2024',
    period: 'Full year 2024',
    cadence: 'Twice yearly',
    note: 'MAS core inflation and the outlook for prices.',
  },
  {
    id: 6,
    agency: 'Enterprise Singapore',
    title: 'Review of 2024 Trade Performance',
    period: 'Full year 2024',
    cadence: 'Quarterly trade review',
    note: 'Total merchandise trade and non-oil domestic exports (NODX).',
  },
  {
    id: 7,
    agency: 'Maritime and Port Authority (MPA)',
    title: 'Port Statistics 2024',
    period: 'Full year 2024',
    cadence: 'Monthly, annual summary in January',
    note: 'Container throughput in TEUs and vessel arrivals.',
  },
  {
    id: 8,
    agency: 'Changi Airport Group',
    title: 'Traffic Statistics 2024',
    period: 'Full year 2024',
    cadence: 'Monthly',
    note: 'Passenger movements, aircraft movements and airfreight.',
  },
  {
    id: 9,
    agency: 'Housing & Development Board (HDB)',
    title: 'Key Statistics 2024',
    period: 'Year ending March 2024',
    cadence: 'Annual',
    note: 'Resident home ownership rate and the HDB share of households.',
  },
  {
    id: 10,
    agency: 'Ministry of Health (MOH) / Department of Statistics',
    title: 'Principal Causes of Death & Life Expectancy 2024',
    period: 'Full year 2024',
    cadence: 'Annual',
    note: 'Life expectancy at birth and leading causes of death.',
  },
  {
    id: 11,
    agency: 'Department of Statistics (SingStat)',
    title: 'General Household Survey 2020, updated with Census 2020',
    period: '2020, with annual updates',
    cadence: 'Decennial census, five-yearly survey',
    note: 'Educational attainment and household composition benchmarks.',
  },
  {
    id: 12,
    agency: 'Ministry of Education (MOE)',
    title: 'Education Statistics Digest 2024',
    period: 'Academic year 2024',
    cadence: 'Annual',
    note: 'Tertiary enrolment and attainment among residents aged 25 and over.',
  },
  {
    id: 13,
    agency: 'Land Transport Authority (LTA)',
    title: 'Singapore Land Transport Statistics in Brief 2024',
    period: 'Full year 2024',
    cadence: 'Annual',
    note: 'Public transport mode share and rail network length.',
  },
  {
    id: 14,
    agency: 'Urban Redevelopment Authority (URA)',
    title: 'Master Plan 2019 — Planning Regions & Planning Areas',
    period: 'Gazetted 2019',
    cadence: 'Reviewed every five years',
    note: 'The 5 planning regions, 55 planning areas and their boundaries.',
  },
  {
    id: 15,
    agency: 'Department of Statistics (SingStat)',
    title: 'Singapore in Figures 2025',
    period: 'Reference year 2024',
    cadence: 'Annual, October',
    note: 'Cross-domain pocket reference: population, economy, prices, trade.',
  },
  {
    id: 16,
    agency: 'Department of Statistics (SingStat)',
    title: 'National Accounts 2024',
    period: 'Full year 2024',
    cadence: 'Quarterly, annual benchmark in February',
    note: 'GDP by industry at current prices and the sector shares used here.',
  },
  {
    id: 17,
    agency: 'National Population and Talent Division (NPTD)',
    title: 'Population in Brief 2024',
    period: 'June 2024',
    cadence: 'Annual, September',
    note: 'Citizen and resident population, old-age support ratio, ageing.',
  },
  {
    id: 18,
    agency: 'Ministry of Manpower (MOM)',
    title: 'Labour Market Report 2024',
    period: 'Fourth quarter 2024',
    cadence: 'Quarterly',
    note: 'Unemployment rates (overall, resident, citizen) and retrenchments.',
  },
  {
    id: 19,
    agency: 'Department of Statistics (SingStat)',
    title: 'Household Expenditure Survey 2023/24',
    period: '2023/24',
    cadence: 'Five-yearly',
    note: 'Household spending weights behind the CPI basket.',
  },
  {
    id: 20,
    agency: 'Department of Statistics (SingStat)',
    title: 'Key Indicators of the Singapore Economy (monthly release)',
    period: 'Rolling monthly',
    cadence: 'Monthly',
    note: 'The release calendar spine: CPI, trade, industrial production.',
  },
];

export function sourceById(id) {
  return SOURCES.find((s) => s.id === id) ?? null;
}

// Scheduled official releases for the coming year. Dates are the
// agencies' published release windows, not publication dates of this site.
export const RELEASE_CALENDAR = [
  {
    quarter: 'Q1 2026',
    release: 'Economic Survey of Singapore, Q4 2025',
    agency: 'MTI',
    window: 'February 2026',
  },
  {
    quarter: 'Q1 2026',
    release: 'Labour Market Report, Q4 2025',
    agency: 'MOM',
    window: 'March 2026',
  },
  {
    quarter: 'Q2 2026',
    release: 'Consumer Price Index, monthly',
    agency: 'SingStat',
    window: '23rd of each month',
  },
  {
    quarter: 'Q2 2026',
    release: 'Labour Force in Singapore 2025',
    agency: 'MOM',
    window: 'January 2026 (published); next edition January 2027',
  },
  {
    quarter: 'Q3 2026',
    release: 'Population Trends 2025',
    agency: 'SingStat',
    window: 'September 2026',
  },
  {
    quarter: 'Q3 2026',
    release: 'Population in Brief 2025',
    agency: 'NPTD',
    window: 'September 2026',
  },
  {
    quarter: 'Q3 2026',
    release: 'Singapore in Figures 2026',
    agency: 'SingStat',
    window: 'October 2026',
  },
  {
    quarter: 'Q4 2026',
    release: 'HDB Key Statistics 2025',
    agency: 'HDB',
    window: 'December 2026',
  },
  {
    quarter: 'Q4 2026',
    release: 'Port & Air Traffic Statistics 2025',
    agency: 'MPA / Changi Airport Group',
    window: 'January 2027',
  },
  {
    quarter: 'Q4 2026',
    release: 'Education Statistics Digest 2025',
    agency: 'MOE',
    window: 'December 2026',
  },
];
