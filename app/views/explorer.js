// LionStat — Data Explorer (#/explorer): search, filter and download the
// full 2010–2024 series behind every indicator as real CSV or JSON.

import { INDICATORS, TOPICS, indicatorById, stampFor } from '../data/indicators.js';
import { sourceById } from '../data/sources.js';
import { cite, sectionHead } from './common.js';

function csvCell(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function download(filename, text, type) {
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

export function render() {
  const topicOptions = TOPICS.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');
  return `
  <section class="explorer-page">
    ${sectionHead('Data Explorer', 'Every number, downloadable', 'All 30 indicators, every year 2010–2024 — 450 observations. Filter it, sort it, take it with you as CSV or JSON.')}
    <div class="explorer-controls">
      <label class="grow">Search
        <input id="ex-search" type="search" placeholder="Try “GDP”, “unemployment”, “TEU”…" autocomplete="off">
      </label>
      <label>Topic
        <select id="ex-topic"><option value="">All topics</option>${topicOptions}</select>
      </label>
      <label>From year
        <select id="ex-from">${[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((y) => `<option${y === 2010 ? ' selected' : ''}>${y}</option>`).join('')}</select>
      </label>
      <label>To year
        <select id="ex-to">${[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((y) => `<option${y === 2024 ? ' selected' : ''}>${y}</option>`).join('')}</select>
      </label>
    </div>
    <div class="explorer-actions">
      <button type="button" class="btn" id="dl-csv">Download CSV</button>
      <button type="button" class="btn" id="dl-json">Download JSON</button>
      <button type="button" class="btn btn-ghost" id="copy-cite">Copy citation</button>
      <span class="table-count" id="ex-count"></span>
      <span class="copy-note" id="copy-note" aria-live="polite"></span>
    </div>
    <div class="table-scroll"><table class="data-table" id="ex-table">
      <thead><tr>
        <th data-sort="title">Indicator</th>
        <th data-sort="topic">Topic</th>
        <th class="num" data-sort="year">Year</th>
        <th class="num" data-sort="value">Value</th>
        <th>Unit</th>
        <th>Source</th>
      </tr></thead>
      <tbody id="ex-body"></tbody>
    </table></div>
    <p class="panel-note">Downloaded files carry the same figures, units and source numbers as this page.
    Cite as: LionStat — Singapore in Numbers, indicator title, year, value and unit, with the numbered source
    from the Sources page ${cite(15)}.</p>
  </section>`;
}

export function mount() {
  const search = document.getElementById('ex-search');
  const topicSel = document.getElementById('ex-topic');
  const fromSel = document.getElementById('ex-from');
  const toSel = document.getElementById('ex-to');
  const body = document.getElementById('ex-body');
  const count = document.getElementById('ex-count');
  let sortKey = 'year';
  let sortDir = -1;

  const rows = () => {
    const q = search.value.trim().toLowerCase();
    const from = Number(fromSel.value);
    const to = Number(toSel.value);
    const out = [];
    for (const ind of INDICATORS) {
      if (topicSel.value && ind.topic !== topicSel.value) continue;
      if (q && !`${ind.title} ${ind.unit} ${ind.topic}`.toLowerCase().includes(q)) continue;
      for (const p of ind.series) {
        if (p.year < from || p.year > to) continue;
        out.push({ id: ind.id, title: ind.title, topic: ind.topic, year: p.year, value: p.value, unit: ind.unit, sourceId: ind.sourceId, stamp: stampFor(ind) });
      }
    }
    out.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return cmp * sortDir;
    });
    return out;
  };

  const topicName = (id) => TOPICS.find((t) => t.id === id)?.name ?? id;

  const draw = () => {
    const list = rows();
    body.innerHTML = list
      .map((r) => `<tr>
        <td>${r.title}</td><td>${topicName(r.topic)}</td>
        <td class="num">${r.year}</td><td class="num">${r.value.toLocaleString('en-SG')}</td>
        <td>${r.unit}</td><td>${r.stamp} ${cite(r.sourceId)}</td>
      </tr>`).join('');
    count.textContent = `${list.length} observations`;
  };

  [search, topicSel, fromSel, toSel].forEach((el) => el.addEventListener('input', draw));
  document.querySelectorAll('#ex-table th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = 1; }
      draw();
    });
  });

  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  if (params.get('q')) search.value = params.get('q');

  document.getElementById('dl-csv').addEventListener('click', () => {
    const list = rows();
    const head = ['indicator', 'topic', 'year', 'value', 'unit', 'source_id'];
    const lines = [head.join(',')];
    for (const r of list) lines.push([r.title, topicName(r.topic), r.year, r.value, r.unit, r.sourceId].map(csvCell).join(','));
    download('lionstat-singapore-indicators.csv', lines.join('\r\n'), 'text/csv');
  });
  document.getElementById('dl-json').addEventListener('click', () => {
    const list = rows();
    download(
      'lionstat-singapore-indicators.json',
      JSON.stringify({ dataset: 'LionStat — Singapore in Numbers', vintage: '2024', observations: list }, null, 2),
      'application/json',
    );
  });
  document.getElementById('copy-cite').addEventListener('click', async () => {
    const list = rows();
    const note = document.getElementById('copy-note');
    if (!list.length) { note.textContent = 'Nothing to cite — widen the filters.'; return; }
    const first = list[0];
    const ind = indicatorById(first.id);
    const src = sourceById(ind.sourceId);
    const text = `LionStat — Singapore in Numbers: ${ind.title}, ${first.year}: ${first.value} ${ind.unit}. Source [${src.id}] ${src.agency}, ${src.title} (${src.period}).`;
    try {
      await navigator.clipboard.writeText(text);
      note.textContent = 'Citation copied.';
    } catch {
      note.textContent = text;
    }
  });
  draw();
}
