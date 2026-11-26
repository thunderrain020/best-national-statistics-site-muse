// LionStat — Sources & Methodology (#/sources): the full numbered
// bibliography, the release calendar, methodology notes, and the live
// data-integrity audit panel.

import { RELEASE_CALENDAR, SOURCES } from '../data/sources.js';
import { verifyDataConsistency } from '../data/indicators.js';
import { sectionHead } from './common.js';

export function render() {
  const bib = SOURCES.map(
    (s) => `<li class="bib-item" id="source-${s.id}">
      <span class="bib-num">[${s.id}]</span>
      <div><strong>${s.agency} — ${s.title}</strong>
      <p>Reference period: ${s.period}. Release cadence: ${s.cadence}.</p>
      <p class="bib-note">${s.note}</p></div>
    </li>`,
  ).join('');

  const cal = RELEASE_CALENDAR.map(
    (r) => `<tr><td>${r.quarter}</td><td>${r.release}</td><td>${r.agency}</td><td>${r.window}</td></tr>`,
  ).join('');

  return `
  <section class="sources-page">
    ${sectionHead('Sources & Methodology', 'Where every number comes from', 'LionStat republishes official figures; it does not estimate them. Each figure on the site carries a numbered citation that points here.')}
    <div class="split">
      <div class="panel">
        <h3 class="subhead">Numbered bibliography</h3>
        <ol class="bib-list">${bib}</ol>
      </div>
      <div>
        <div class="panel audit-panel">
          <h3 class="subhead">Data integrity audit — live</h3>
          <p class="panel-note">This panel runs the site’s own consistency checks in your browser,
          against the same data files the pages render from. All checks must pass.</p>
          <ul class="audit-list" id="audit-list"></ul>
          <p class="audit-verdict" id="audit-verdict"></p>
        </div>
        <div class="panel">
          <h3 class="subhead">Methodology</h3>
          <ul class="method-list">
            <li><strong>Reference years.</strong> Every figure is labelled with its year. Annual series run 2015–2024, the latest year fully published across these releases.</li>
            <li><strong>No estimates.</strong> Where a release had not yet published a 2024 figure, the series stops at 2023 and the indicator says so. Nothing is interpolated.</li>
            <li><strong>Derived figures.</strong> Density is population divided by area; GDP per capita is nominal GDP divided by total population. Both are checked live in the audit panel.</li>
            <li><strong>Planning areas.</strong> The 28 areas are the largest and most populous of the URA’s 55 planning areas, mapped on a tile grid so small dense areas stay readable.</li>
            <li><strong>Rounding.</strong> Shares are shown to one decimal place; underlying values are kept at full precision and the audit checks the unrounded sums.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="panel">
      <h3 class="subhead">Upcoming statistical releases</h3>
      <div class="table-scroll"><table class="data-table">
        <thead><tr><th>Quarter</th><th>Release</th><th>Agency</th><th>Window</th></tr></thead>
        <tbody>${cal}</tbody>
      </table></div>
    </div>
  </section>`;
}

export function mount() {
  const result = verifyDataConsistency();
  const list = document.getElementById('audit-list');
  list.innerHTML = result.checks
    .map(
      (c) => `<li class="audit-item ${c.pass ? 'pass' : 'fail'}">
        <span class="audit-mark">${c.pass ? 'PASS' : 'FAIL'}</span>
        <div><strong>${c.name}</strong><p>${c.detail}</p></div>
      </li>`,
    )
    .join('');
  document.getElementById('audit-verdict').textContent = result.passed
    ? `All ${result.checks.length} checks passed.`
    : 'One or more checks failed — see above.';
}
