// LionStat — Singapore in Numbers. Entry program for
// best-national-statistics-site-20261126-0539.
//
// The site itself is plain static files under app/ (no build step, no
// network at runtime). This program hands it in: it copies app/ and
// screenshots/ next to this file into the output directory and writes
// output/dossier.json with the kit's vendored library, so the judge's
// dossier is byte for byte what that library writes from these files.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and serve the site for a look with:
//   node serve.ts   (http://localhost:8080)

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail fast with a readable error when the site folder is missing, instead
// of copying a half-built tree and letting the dossier step report it.
if (!existsSync(join(here, 'app', 'index.html')) || !statSync(join(here, 'app', 'index.html')).isFile()) {
  throw new Error('app/index.html is missing: build the site before running main.ts');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), {
    recursive: true,
  });
}

// The scorer's own caps for this bounty: at most 4 screenshots, each at
// most 256 KiB; at most 993 files and directories in app/ and 16 MiB of
// app files in all; the dossier text itself capped at 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
