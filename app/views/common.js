// LionStat — shared view helpers: citation chips, KPI cards, tables.

import { stampFor } from '../data/indicators.js';
import { renderSparkline } from '../charts.js';
import { t } from '../i18n.js';

export function cite(sourceId) {
  return `<a class="cite" href="#/sources" title="Source ${sourceId} — see Sources &amp; Calendar">[${sourceId}]</a>`;
}

export function deltaBadge(ind) {
  const good = ind.yoyDelta >= 0;
  const flat = ind.yoyDelta === 0;
  const cls = flat ? 'flat' : good ? 'up' : 'down';
  return `<span class="delta ${cls}">${ind.yoyLabel}</span>`;
}

function verifyBadge(ind) {
  if (!ind.verified) return '';
  const full = ind.verified.includes('WB') && ind.verified.includes('IMF')
    ? 'Also published by the World Bank (WDI) and the IMF (WEO)'
    : ind.verified.includes('WB')
      ? 'Also published by the World Bank (WDI)'
      : 'Also published by the IMF (WEO)';
  return `<span class="verify-badge" title="${full}">${ind.verified} ✓</span>`;
}

export function kpiCard(ind, compact = false, titleOverride = null) {
  const values = ind.series.map((p) => p.value);
  const trendColor = ind.yoyDelta >= 0 ? '#0F766E' : '#BE123C';
  return `<article class="kpi-card${compact ? ' compact' : ''}">
    <div class="kpi-top"><h3>${titleOverride ?? ind.title}</h3>${cite(ind.sourceId)}</div>
    <div class="kpi-value">${ind.display}</div>
    <div class="kpi-meta"><span class="kpi-unit">${ind.unit} · ${ind.latestYear}</span>${deltaBadge(ind)}</div>
    <div class="kpi-foot"><span class="kpi-stamp" title="${stampFor(ind)}">${ind.tableId} · ${ind.latestYear}</span>${verifyBadge(ind)}<span class="kpi-spark">${renderSparkline(values, trendColor)}</span></div>
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
        <td>${i.tableId} ${cite(i.sourceId)}</td>
      </tr>`,
    )
    .join('');
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>${t('table.indicator')}</th><th class="num">${t('table.latest')}</th><th class="num">${t('table.change')}</th><th>${t('table.unit')}</th><th class="num">${t('table.year')}</th><th>${t('table.source')}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

export function sectionHead(kicker, title, blurb) {
  return `<header class="section-head"><p class="kicker">${kicker}</p><h2>${title}</h2>${blurb ? `<p class="section-blurb">${blurb}</p>` : ''}</header>`;
}
