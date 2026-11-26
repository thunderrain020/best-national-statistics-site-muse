# LionStat — Singapore in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/thunderrain020/best-national-statistics-site-muse/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/thunderrain020/best-national-statistics-site-muse/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent civic statistical atlas for the Republic of Singapore —
every headline figure about the country, from the official releases,
checked for consistency, and shown with its source and year.

## What it is

**LionStat** covers Singapore in six topics — Demography, Economy, Labor &
Wages, Prices & CPI, Trade & Port, Society & Housing — with 23 indicators
(2015–2024 series), 5 planning regions and 28 key planning areas, 20
numbered official sources, and a live data-integrity audit panel.

- **Overview** — 6 headline KPI cards with sparklines and YoY badges, plus a
  featured chart switcher (GDP & growth, population & ageing, inflation,
  trade & port).
- **Topics** — one page per topic with its own SVG charts and a full
  indicator table.
- **Regions** — an interactive tile-grid map of Singapore's 28 planning
  areas (colour by population, density, median age or HDB share),
  click-to-inspect area profiles, a compare-any-two-areas widget, and a
  sortable, filterable table.
- **Data Explorer** — search, filter by topic and year range, sort all 230
  observations, and download real CSV or JSON.
- **Sources & Calendar** — the full numbered bibliography, the upcoming
  release calendar, methodology notes, and a live audit that runs
  `verifyDataConsistency()` in the browser (9 checks, all passing).

## How it is built

Static files under `app/` only — no build step, no network requests at
runtime. Every chart is a hand-written inline SVG (no chart library, no
canvas), every dataset lives locally, and the whole site works offline
from `app/index.html`.

```
app/
  index.html            shell: header, nav, search, footer
  style.css             editorial design system (jade / crimson / amber)
  main.js               hash router + quick search + mobile menu
  charts.js             pure-SVG renderers: line, bar, pyramid, sparkline, map
  data/
    indicators.js       23 indicators, 2015–2024 series + audit checks
    regions.js          5 regions, 28 planning areas (tile-grid map)
    sources.js          20 numbered citations + release calendar
  views/
    home.js topics.js regions.js explorer.js sources.js
```

## Figures

Latest verified figures: 2024. Headlines: total population 6.04M,
nominal GDP S$719.4B (+4.4% real growth), resident unemployment 2.9%,
headline CPI +2.4%, container throughput 41.1M TEUs, Changi 67.7M
passengers, home ownership 90.8%, life expectancy 83.5 years.

## Run it

```sh
node serve.ts          # http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Entry for the make.fun bounty
[“Make the best national statistics site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
(`best-national-statistics-site-20261126-0539`).

<sub>Entered on [make.fun](https://make.fun/?ref={referral_code}&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
