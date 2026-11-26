// LionStat — router, header search and mobile menu.
//
// A hash router: #/ (overview), #/topics and #/topics/<slug>, #/regions,
// #/explorer, #/sources. Every view is a module under views/; the router
// renders it into #view and calls its mount() to wire charts and controls.

import * as home from './views/home.js';
import * as topics from './views/topics.js';
import * as regions from './views/regions.js';
import * as explorer from './views/explorer.js';
import * as sources from './views/sources.js';
import { INDICATORS, TOPICS } from './data/indicators.js';
import { AREAS } from './data/regions.js';

const view = document.getElementById('view');
const navLinks = [...document.querySelectorAll('.nav-link')];

const ROUTES = [
  { match: (p) => p === '' || p === '/', title: 'Overview — LionStat', run: () => { view.innerHTML = home.render(); home.mount(); } },
  { match: (p) => p === 'topics' || p.startsWith('topics/'), title: 'Topics — LionStat', run: (p) => { const slug = p.split('/')[1] || 'demography'; view.innerHTML = topics.render(slug); topics.mount(slug); } },
  { match: (p) => p === 'regions', title: 'Regions — LionStat', run: () => { view.innerHTML = regions.render(); regions.mount(); } },
  { match: (p) => p === 'explorer' || p.startsWith('explorer'), title: 'Data Explorer — LionStat', run: () => { view.innerHTML = explorer.render(); explorer.mount(); } },
  { match: (p) => p === 'sources', title: 'Sources & Calendar — LionStat', run: () => { view.innerHTML = sources.render(); sources.mount(); } },
];

function route() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const path = raw.split('?')[0];
  const found = ROUTES.find((r) => r.match(path)) || ROUTES[0];
  found.run(path);
  document.title = found.title;
  const section = path.split('/')[0] || '';
  navLinks.forEach((a) => {
    const href = a.getAttribute('href').replace(/^#\/?/, '').split('/')[0];
    a.classList.toggle('active', href === section || (section === '' && href === ''));
    if (href === section) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  document.getElementById('site-nav').classList.remove('open');
}

window.addEventListener('hashchange', route);

// Quick search: indicators, topics and planning areas. Picking a result
// jumps to the page that answers it.
const searchInput = document.getElementById('quick-search');
const searchResults = document.getElementById('search-results');

function searchItems(q) {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits = [];
  for (const ind of INDICATORS) {
    if (`${ind.title} ${ind.topic}`.toLowerCase().includes(needle)) {
      hits.push({ kind: 'Indicator', label: `${ind.title} — ${ind.display} (${ind.latestYear})`, go: `#/explorer?q=${encodeURIComponent(ind.title)}` });
    }
  }
  for (const t of TOPICS) {
    if (t.name.toLowerCase().includes(needle)) {
      hits.push({ kind: 'Topic', label: `${t.name} — ${t.blurb}`, go: `#/topics/${t.id}` });
    }
  }
  for (const a of AREAS) {
    if (a.name.toLowerCase().includes(needle)) {
      hits.push({
        kind: 'Planning area',
        label: `${a.name} — ${(a.population / 1000).toFixed(0)}k people, median age ${a.medianAge.toFixed(1)}`,
        go: '#/regions',
        area: a.id,
      });
    }
  }
  return hits.slice(0, 8);
}

searchInput.addEventListener('input', () => {
  const hits = searchItems(searchInput.value);
  if (!hits.length) {
    searchResults.innerHTML = '';
    searchResults.hidden = true;
    return;
  }
  searchResults.innerHTML = hits
    .map((h, i) => `<li><button type="button" data-i="${i}"><span class="sr-kind">${h.kind}</span>${h.label}</button></li>`)
    .join('');
  searchResults.hidden = false;
  searchResults.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const hit = hits[Number(btn.dataset.i)];
      if (hit.area) window.__lionstatSelectedArea = hit.area;
      searchResults.hidden = true;
      searchInput.value = '';
      if (window.location.hash === hit.go) route();
      else window.location.hash = hit.go;
    });
  });
});

searchInput.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    searchResults.hidden = true;
    searchInput.value = '';
  }
});

document.addEventListener('click', (ev) => {
  if (!ev.target.closest('.search-box')) searchResults.hidden = true;
});

// Mobile menu.
document.getElementById('menu-btn').addEventListener('click', () => {
  const nav = document.getElementById('site-nav');
  const open = nav.classList.toggle('open');
  document.getElementById('menu-btn').setAttribute('aria-expanded', String(open));
});

// Dark / light theme. The inline script in index.html already applied the
// saved theme before first paint; here we sync the button and wire clicks.
const themeBtn = document.getElementById('theme-toggle');
const applyTheme = (t) => {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('lionstat-theme', t); } catch (e) {}
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  themeBtn.textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
};
applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
themeBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

route();
