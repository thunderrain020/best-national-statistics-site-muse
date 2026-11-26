// LionStat — Singapore's 5 URA planning regions and 28 key planning areas.
//
// Populations are 2024 planning-area estimates (persons), areas are the
// URA gazetted planning-area sizes in km2. Density is derived from those
// two authored figures, never typed by hand, so it can never drift from
// them. Median age, youth and senior shares, HDB share and MRT station
// counts are 2024 figures for each area. The 28 areas below are home to
// about 3.98 million people; the remaining 27 planning areas hold the
// rest of the 6.04 million total.
//
// The map is a geographic tile map: one tile per planning area, centred
// at (x, y) in the 1000×620 map viewBox at its real geographic position —
// north coast on the top edge, the downtown core at the bottom right —
// drawn over a simplified Singapore coastline silhouette (mainland plus
// Sentosa, Jurong Island and Pulau Ubin). A tile map keeps every area the
// same visual weight, so small dense areas (Outram, Downtown Core) are as
// readable as large ones (Bedok, Yishun).

export const REGIONS = [
  { id: 'central', name: 'Central Region', color: '#0F766E', blurb: 'The historic core: downtown, the old housing estates and the mature towns around them.' },
  { id: 'east', name: 'East Region', color: '#B45309', blurb: 'The eastern seaboard: Tampines and Bedok, the island’s largest housing towns.' },
  { id: 'north', name: 'North Region', color: '#1D4ED8', blurb: 'The northern coast: Woodlands and Yishun facing the Strait of Johor.' },
  { id: 'north-east', name: 'North-East Region', color: '#7C3AED', blurb: 'The youngest corner: Sengkang and Punggol, built this century.' },
  { id: 'west', name: 'West Region', color: '#BE123C', blurb: 'Industry and new towns: Jurong, Choa Chu Kang and the new town of Tengah.' },
];

const RAW_AREAS = [
  // Central Region — 12 areas
  { id: 'bukit-merah', name: 'Bukit Merah', region: 'central', population: 155000, areaKm2: 14.3, medianAge: 44.6, youthPct: 11.0, seniorPct: 19.1, hdbSharePct: 77, mrtStations: 3, x: 505, y: 482, topFeatures: ['Alexandra retail corridor', 'Southern waterfront'] },
  { id: 'toa-payoh', name: 'Toa Payoh', region: 'central', population: 126000, areaKm2: 8.2, medianAge: 46.0, youthPct: 10.2, seniorPct: 21.5, hdbSharePct: 81, mrtStations: 2, x: 500, y: 425, topFeatures: ['Singapore’s first satellite town', 'HDB Hub'] },
  { id: 'queenstown', name: 'Queenstown', region: 'central', population: 100000, areaKm2: 6.9, medianAge: 44.8, youthPct: 10.8, seniorPct: 19.6, hdbSharePct: 78, mrtStations: 2, x: 350, y: 425, topFeatures: ['Singapore’s first HDB town', 'Stirling Road heritage flats'] },
  { id: 'bishan', name: 'Bishan', region: 'central', population: 88000, areaKm2: 7.8, medianAge: 44.2, youthPct: 11.2, seniorPct: 18.4, hdbSharePct: 76, mrtStations: 2, x: 430, y: 360, topFeatures: ['Bishan–Ang Mo Kio Park', 'Junction 8 interchange'] },
  { id: 'geylang', name: 'Geylang', region: 'central', population: 111000, areaKm2: 7.8, medianAge: 43.9, youthPct: 10.9, seniorPct: 17.8, hdbSharePct: 68, mrtStations: 3, x: 720, y: 355, topFeatures: ['Geylang Serai market', 'Old Airport Road food centre'] },
  { id: 'kallang', name: 'Kallang', region: 'central', population: 96000, areaKm2: 9.3, medianAge: 43.2, youthPct: 11.3, seniorPct: 17.2, hdbSharePct: 72, mrtStations: 2, x: 635, y: 360, topFeatures: ['National Stadium', 'Kallang Riverside'] },
  { id: 'novena', name: 'Novena', region: 'central', population: 49000, areaKm2: 8.0, medianAge: 42.5, youthPct: 11.6, seniorPct: 16.8, hdbSharePct: 38, mrtStations: 1, x: 515, y: 365, topFeatures: ['Tan Tock Seng Hospital', 'Novena medical hub'] },
  { id: 'tanglin', name: 'Tanglin', region: 'central', population: 19000, areaKm2: 7.6, medianAge: 42.0, youthPct: 12.0, seniorPct: 15.5, hdbSharePct: 12, mrtStations: 1, x: 410, y: 482, topFeatures: ['Botanic Gardens', 'Embassy quarter'] },
  { id: 'outram', name: 'Outram', region: 'central', population: 17000, areaKm2: 1.4, medianAge: 44.0, youthPct: 10.8, seniorPct: 18.9, hdbSharePct: 55, mrtStations: 1, x: 595, y: 482, topFeatures: ['Singapore General Hospital', 'Chinatown edge'] },
  { id: 'downtown-core', name: 'Downtown Core', region: 'central', population: 4000, areaKm2: 4.3, medianAge: 41.5, youthPct: 9.5, seniorPct: 16.2, hdbSharePct: 8, mrtStations: 6, x: 680, y: 475, topFeatures: ['Marina Bay financial district', 'Raffles Place'] },
  { id: 'ang-mo-kio', name: 'Ang Mo Kio', region: 'central', population: 157000, areaKm2: 13.7, medianAge: 45.2, youthPct: 10.5, seniorPct: 20.3, hdbSharePct: 80, mrtStations: 2, x: 470, y: 300, topFeatures: ['AMK Hub', 'Mayflower neighbourhoods'] },
  { id: 'marine-parade', name: 'Marine Parade', region: 'central', population: 46000, areaKm2: 6.2, medianAge: 46.5, youthPct: 10.4, seniorPct: 22.1, hdbSharePct: 62, mrtStations: 1, x: 815, y: 375, topFeatures: ['East Coast Park', 'Oldest seafront estate'] },
  // East Region — 3 areas
  { id: 'tampines', name: 'Tampines', region: 'east', population: 274000, areaKm2: 20.9, medianAge: 42.3, youthPct: 12.9, seniorPct: 15.2, hdbSharePct: 89, mrtStations: 4, x: 810, y: 255, topFeatures: ['Tampines Regional Centre', 'Our Tampines Hub'] },
  { id: 'bedok', name: 'Bedok', region: 'east', population: 276000, areaKm2: 21.7, medianAge: 44.1, youthPct: 11.8, seniorPct: 18.2, hdbSharePct: 84, mrtStations: 3, x: 820, y: 315, topFeatures: ['Bedok Reservoir', 'East Coast Lagoon'] },
  { id: 'pasir-ris', name: 'Pasir Ris', region: 'east', population: 144000, areaKm2: 15.0, medianAge: 42.1, youthPct: 13.1, seniorPct: 14.6, hdbSharePct: 85, mrtStations: 2, x: 750, y: 185, topFeatures: ['Pasir Ris Park', 'Downtown East'] },
  // North Region — 3 areas
  { id: 'woodlands', name: 'Woodlands', region: 'north', population: 254000, areaKm2: 13.7, medianAge: 40.5, youthPct: 13.5, seniorPct: 14.2, hdbSharePct: 91, mrtStations: 3, x: 330, y: 175, topFeatures: ['Woodlands Regional Centre', 'Causeway crossing'] },
  { id: 'yishun', name: 'Yishun', region: 'north', population: 233000, areaKm2: 21.2, medianAge: 41.0, youthPct: 13.0, seniorPct: 15.1, hdbSharePct: 89, mrtStations: 2, x: 520, y: 168, topFeatures: ['Northpoint City', 'Yishun Pond'] },
  { id: 'sembawang', name: 'Sembawang', region: 'north', population: 108000, areaKm2: 12.9, medianAge: 41.5, youthPct: 13.4, seniorPct: 14.0, hdbSharePct: 86, mrtStations: 2, x: 430, y: 170, topFeatures: ['Sembawang Park', 'Naval Base heritage'] },
  // North-East Region — 4 areas
  { id: 'sengkang', name: 'Sengkang', region: 'north-east', population: 270000, areaKm2: 10.6, medianAge: 36.9, youthPct: 16.9, seniorPct: 8.0, hdbSharePct: 90, mrtStations: 3, x: 590, y: 245, topFeatures: ['Sengkang Riverside Park', 'Compass One'] },
  { id: 'punggol', name: 'Punggol', region: 'north-east', population: 220000, areaKm2: 9.4, medianAge: 35.8, youthPct: 17.8, seniorPct: 7.2, hdbSharePct: 88, mrtStations: 3, x: 640, y: 178, topFeatures: ['Punggol Digital District', 'Waterway Point'] },
  { id: 'hougang', name: 'Hougang', region: 'north-east', population: 229000, areaKm2: 13.0, medianAge: 42.6, youthPct: 12.1, seniorPct: 16.5, hdbSharePct: 90, mrtStations: 2, x: 680, y: 250, topFeatures: ['Hougang Mall', 'Defu Industrial Park'] },
  { id: 'serangoon', name: 'Serangoon', region: 'north-east', population: 119000, areaKm2: 10.1, medianAge: 42.8, youthPct: 12.4, seniorPct: 15.9, hdbSharePct: 82, mrtStations: 2, x: 580, y: 305, topFeatures: ['NEX interchange', 'Serangoon Garden estate'] },
  // West Region — 6 areas
  { id: 'jurong-west', name: 'Jurong West', region: 'west', population: 266000, areaKm2: 14.2, medianAge: 40.2, youthPct: 13.2, seniorPct: 14.8, hdbSharePct: 88, mrtStations: 4, x: 140, y: 370, topFeatures: ['Jurong Lake District', 'NTU edge'] },
  { id: 'choa-chu-kang', name: 'Choa Chu Kang', region: 'west', population: 177000, areaKm2: 6.1, medianAge: 41.8, youthPct: 12.8, seniorPct: 14.9, hdbSharePct: 93, mrtStations: 2, x: 200, y: 245, topFeatures: ['Lot One Shoppers’ Mall', 'CCK Park'] },
  { id: 'bukit-batok', name: 'Bukit Batok', region: 'west', population: 166000, areaKm2: 11.1, medianAge: 42.0, youthPct: 12.5, seniorPct: 15.8, hdbSharePct: 87, mrtStations: 2, x: 210, y: 310, topFeatures: ['Bukit Batok Nature Park', 'West Mall'] },
  { id: 'bukit-panjang', name: 'Bukit Panjang', region: 'west', population: 139000, areaKm2: 8.9, medianAge: 41.2, youthPct: 13.6, seniorPct: 13.8, hdbSharePct: 90, mrtStations: 3, x: 300, y: 305, topFeatures: ['Bukit Panjang Plaza', 'LRT loop town'] },
  { id: 'clementi', name: 'Clementi', region: 'west', population: 93000, areaKm2: 9.2, medianAge: 43.5, youthPct: 11.5, seniorPct: 17.4, hdbSharePct: 79, mrtStations: 1, x: 250, y: 430, topFeatures: ['Clementi Mall', 'NUS edge'] },
  { id: 'tengah', name: 'Tengah', region: 'west', population: 40000, areaKm2: 7.0, medianAge: 34.5, youthPct: 18.5, seniorPct: 7.5, hdbSharePct: 92, mrtStations: 0, x: 245, y: 370, topFeatures: ['Singapore’s first forest town', 'Car-free town centre, opening 2027'] },
];

// Density is derived, so it can never disagree with population and area.
export const AREAS = RAW_AREAS.map((a) => ({
  ...a,
  densityPerKm2: Math.round(a.population / a.areaKm2),
}));

export function areaById(id) {
  return AREAS.find((a) => a.id === id) ?? null;
}

export function regionById(id) {
  return REGIONS.find((r) => r.id === id) ?? null;
}

export function areasInRegion(regionId) {
  return AREAS.filter((a) => a.region === regionId);
}

export function regionPopulation(regionId) {
  return areasInRegion(regionId).reduce((sum, a) => sum + a.population, 0);
}
