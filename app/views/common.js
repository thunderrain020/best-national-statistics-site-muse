// LionStat — shared view helpers: citation chips, KPI cards, tables.

import { renderSparkline } from '../charts.js';

export function cite(sourceId) {
  return `<a class="cite" href="#/sources" title="Source ${sourceId} — see Sources &amp; Calendar">[${sourceId}]</a>`;
}

export function deltaBadge(ind) {
  const good = ind.yoyDelta >= 0;
  const flat = ind.yoyDelta === 0;
  const cls = flat ? 'flat' : good ? 'up' : 'down';
  return `<span class="delta ${cls}">${ind.yoyLabel}</span>`;
}

export function kpiCard(ind) {
  const values = ind.series.map((p) => p.value);
  const trendColor = ind.yoyDelta >= 0 ? '#0F766E' : '#BE123C';
  return `<article class="kpi-card">
    <div class="kpi-top"><h3>${ind.title}</h3>${cite(ind.sourceId)}</div>
    <div class="kpi-value">${ind.display}</div>
    <div class="kpi-meta"><span class="kpi-unit">${ind.unit} · ${ind.latestYear}</span>${deltaBadge(ind)}</div>
    <div class="kpi-spark">${renderSparkline(values, trendColor)}</div>
  </article>`;
}

export function indicatorTable(indicators) {
  const rows = indicators
    .map(
      (i) => `<tr>
        <td><a href="#/explorer?q=${encodeURIComponent(i.title)}">${i.title}</a></td>
        <td class="num">${i.display}</td>
        <td class="num">${i.yoyLabel}</td>
        <td>${i.unit}</td>
        <td class="num">${i.latestYear}</td>
        <td>${cite(i.sourceId)}</td>
      </tr>`,
    )
    .join('');
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>Indicator</th><th class="num">Latest</th><th class="num">Change</th><th>Unit</th><th class="num">Year</th><th>Source</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

export function sectionHead(kicker, title, blurb) {
  return `<header class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${blurb ? `<p class="section-blurb">${blurb}</p>` : ''}</header>`;
}
