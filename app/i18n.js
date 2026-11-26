// LionStat — offline EN / ZH strings.
//
// Every user-facing label the header, headings, KPI cards and buttons
// show goes through t(). Data values, table rows and chart captions stay
// in English: numbers are language-neutral and the bibliography is an
// English-language source list. The language is stored in localStorage
// (lionstat-lang) and re-renders the current route when it changes.

let current = 'en';
try { current = localStorage.getItem('lionstat-lang') || 'en'; } catch (e) { /* private mode */ }
if (current !== 'zh') current = 'en';

export function lang() {
  return current;
}

export function setLang(l) {
  current = l === 'zh' ? 'zh' : 'en';
  try { localStorage.setItem('lionstat-lang', current); } catch (e) { /* private mode */ }
  document.documentElement.lang = current;
}

const S = {
  'nav.overview': ['Overview', '总览'],
  'nav.topics': ['Topics', '主题'],
  'nav.regions': ['Regions', '地区'],
  'nav.explorer': ['Data Explorer', '数据浏览器'],
  'nav.sources': ['Sources & Calendar', '来源与日历'],
  'search.ph': ['Search indicators, topics, areas…', '搜索指标、主题、地区…'],
  'menu': ['Menu', '菜单'],
  'theme.dark': ['☾ Dark', '☾ 深色'],
  'theme.light': ['☀ Light', '☀ 浅色'],
  'footer.note1': ['An independent civic statistical atlas. Not affiliated with the Singapore government or any agency named here.', '独立公民统计图鉴，与新加坡政府及文中提及的任何机构无关。'],
  'footer.note2': ['100% static · 0 external requests · Works offline', '100% 静态 · 零外部请求 · 可离线使用'],
  'masthead.kicker': ['Independent civic statistical atlas · Republic of Singapore', '独立公民统计图鉴 · 新加坡共和国'],
  'masthead.title': ['Singapore in numbers.', '新加坡数字一览。'],
  'masthead.facts': ['30 indicators · 28 planning areas · 20 official citations · 2010–2024 series', '30 项指标 · 28 个规划区 · 20 条官方引用 · 2010–2024 年系列'],
  'masthead.sub': ['Every headline figure from the official releases, checked for consistency, with its source and year.', '每项主要数据均来自官方发布，经过一致性核查，并注明来源与年份。'],
  'ov.map.title': ['Singapore, area by area', '新加坡各区一览'],
  'ov.map.full': ['Full map →', '完整地图 →'],
  'ov.map.region': ['Region', '地区'],
  'ov.map.all': ['All', '全部'],
  'ov.releases.title': ['Latest official releases', '最新官方发布'],
  'ov.audit': ['audit checks PASS', '核查通过'],
  'ov.releases.cal': ['Calendar →', '日历 →'],
  'ov.featured.title': ['Featured trend', '精选趋势'],
  'ov.featured.csv': ['Download CSV', '下载 CSV'],
  'ov.featured.cite': ['Copy citation', '复制引用'],
  'ov.featured.explorer': ['Data Explorer →', '数据浏览器 →'],
  'feat.gdp': ['GDP Growth', 'GDP 增长'],
  'feat.population': ['Population', '人口'],
  'feat.inflation': ['Core vs Headline CPI', '核心与总体 CPI'],
  'feat.trade': ['Port TEUs', '港口 TEU'],
  'unit.level': ['Level', '水平'],
  'unit.yoy': ['YoY %', '同比 %'],
  'kpi.population': ['Population', '人口'],
  'kpi.gdp': ['Nominal GDP', '名义 GDP'],
  'kpi.gdpgrowth': ['Real GDP Growth', '实际 GDP 增长'],
  'kpi.unemp': ['Resident Unemployment', '居民失业率'],
  'kpi.cpi': ['Core Inflation', '核心通胀'],
  'kpi.home': ['Home Ownership', '自有住房率'],
  'kpi.income': ['Median Income', '月收入中位数'],
  'kpi.trade': ['Merchandise Trade', '商品贸易总额'],
  'topic.demography': ['Demography', '人口'],
  'topic.economy': ['Economy', '经济'],
  'topic.labor': ['Labor & Wages', '劳动与工资'],
  'topic.prices': ['Prices & CPI', '物价与 CPI'],
  'topic.trade': ['Trade & Port', '贸易与港口'],
  'topic.society': ['Society & Housing', '社会与住房'],
  'topics.browse.kicker': ['Browse by topic', '按主题浏览'],
  'topics.browse.title': ['Six topics, one atlas', '六大主题，一部图鉴'],
  'topics.browse.blurb': ['Each topic carries its own charts, a full indicator table and a source for every figure.', '每个主题都有专属图表、完整指标表和每项数据的来源。'],
  'topics.explore': ['Explore', '查看'],
  'regions.kicker': ['Regions', '地区'],
  'regions.title': ['Singapore, area by area', '新加坡各区一览'],
  'regions.intro': ['Five planning regions, 28 key planning areas — colour the map, click a tile, compare any two.', '五大规划区、28 个重点规划区——为地图上色，点击图块查看详情，比较任意两个地区。'],
  'regions.compare.title': ['Compare any two planning areas', '比较任意两个规划区'],
  'regions.table.title': ['All 28 planning areas', '全部 28 个规划区'],
  'regions.table.csv': ['Download CSV', '下载 CSV'],
  'regions.metric.population': ['Population', '人口'],
  'regions.metric.density': ['Density / km²', '密度 / 平方公里'],
  'regions.metric.medianAge': ['Median Age', '中位年龄'],
  'regions.metric.hdbShare': ['HDB Share %', '组屋占比 %'],
  'topics.page.kicker': ['Topics', '主题'],
  'topics.table.title': ['Indicators, latest year', '指标，最新年份'],
  'topics.table.csv': ['Download Topic CSV', '下载主题 CSV'],
  'table.indicator': ['Indicator', '指标'],
  'table.latest': ['Latest', '最新值'],
  'table.change': ['Change', '变化'],
  'table.unit': ['Unit', '单位'],
  'table.year': ['Year', '年份'],
  'table.source': ['Source', '来源'],
  'table.sourceStatus': ['Source & Status', '来源与状态'],
  'ex.kicker': ['Data Explorer', '数据浏览器'],
  'ex.title': ['Every number, downloadable', '每个数字，均可下载'],
  'ex.blurb': ['All 30 indicators, every year 2010–2024 — 450 observations. Filter it, sort it, take it with you as CSV or JSON.', '全部 30 项指标，2010–2024 年每年数据——450 个观测值。可筛选、可排序，并以 CSV 或 JSON 下载。'],
  'ex.search.label': ['Search', '搜索'],
  'ex.search.ph': ['Try “GDP”, “unemployment”, “TEU”…', '试试“GDP”“失业率”“TEU”…'],
  'ex.topic.label': ['Topic', '主题'],
  'ex.all.topics': ['All topics', '全部主题'],
  'ex.year.from': ['From year', '起始年份'],
  'ex.year.to': ['To year', '截止年份'],
  'ex.csv': ['Download CSV', '下载 CSV'],
  'ex.json': ['Download JSON', '下载 JSON'],
  'ex.copy': ['Copy citation', '复制引用'],
  'ex.table.topic': ['Topic', '主题'],
  'ex.table.value': ['Value', '数值'],
  'src.kicker': ['Sources & Methodology', '来源与方法'],
  'src.title': ['Where every number comes from', '每个数字的出处'],
  'src.blurb': ['LionStat republishes official figures; it does not estimate them. Each figure on the site carries a numbered citation that points here.', 'LionStat 转载官方数据，不做估算。本站每项数据均带有编号引用，指向此处。'],
  'src.bib.title': ['Numbered bibliography', '编号参考文献'],
  'src.audit.title': ['Data integrity audit — live', '数据完整性核查——实时'],
  'src.audit.note': ['This panel runs the site’s own consistency checks in your browser, against the same data files the pages render from. All checks must pass.', '本面板在您的浏览器中运行本站自有的一致性检查，检查对象与页面渲染所用的数据文件相同。所有检查必须通过。'],
  'src.method.title': ['Methodology', '方法说明'],
  'src.cal.title': ['Upcoming statistical releases', '即将发布的统计数据'],
  'src.cal.quarter': ['Quarter', '季度'],
  'src.cal.release': ['Release', '发布'],
  'src.cal.agency': ['Agency', '机构'],
  'src.cal.window': ['Window', '时间窗口'],
  'ov.regions.kicker': ['Regions', '地区'],
  'ov.regions.title': ['Five regions, 28 planning areas', '五大规划区、28 个规划区'],
  'ov.regions.blurb': ['The 28 areas below hold about 3.98 million people. The rest live in the other 27 planning areas.', '以下 28 个地区约有 398 万人口，其余人口居住在另外 27 个规划区。'],
  'ov.method.kicker': ['Method', '方法'],
  'ov.method.title': ['Every figure, sourced and checked', '每项数据，均有来源并经过核查'],
  'ov.method.blurb': ['No estimates, no placeholders, nothing behind a login.', '没有估算，没有占位符，没有登录墙。'],
  'topics.table.indicators': ['Indicators', '指标'],
  'topics.table.latestYear': ['latest year', '最新年份'],
};

export function t(key) {
  const e = S[key];
  if (!e) return key;
  return current === 'zh' ? e[1] : e[0];
}

export function topicName(id) {
  return t(`topic.${id}`);
}
