# DAEMON

A one-page, mobile-first site for Daemon on Ethereum mainnet. Vite, React and TypeScript; plain CSS; prerendered HTML with browser enhancements. The ready-to-publish export is in **`dist/`**, alongside the source and `package-lock.json`.

No wallet integration, forms, analytics, cookies, local storage, or trackers. All fonts and images are bundled. The browser's only automatic external request is the specified DEX Screener token endpoint.

## Install and develop

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Installed dependencies and generated caches are ignored at every nesting level; never include them in the submission.

## Rebuild and preview

```sh
npm run typecheck
npm run build
npm run preview
```

The build recreates `dist/`, then prerenders all page content into `dist/index.html`. JavaScript adds the copy button, live figures, and pause controls. Without JavaScript, all facts, addresses, images and external navigation remain available.

To check the export at a gateway-like subpath without installing dependencies:

```sh
node scripts/serve.mjs
```

Open `http://localhost:4173/preview/`; stop with Ctrl+C. This server performs no application-route rewrites. Serve files over HTTP(S), rather than opening `index.html` as a `file:` URL. Clipboard access requires a secure context (HTTPS or localhost); when denied, the page selects the address and explains how to copy it manually.

## Publish

Upload **the contents of `dist/`** to the static host or pin the `dist/` directory with your IPFS publisher. The publisher does not need Node, credentials, a backend, or a rebuild. Keep `index.html` and the complete `assets/` directory together. JS, CSS, fonts, favicon and logo use relative URLs, and Vite's `base` is `./`, supporting directory gateways and ENS hosting. No service worker or server routing is needed.

The default export has a local 1200×630 Open Graph image, description, and X large-card metadata. Social crawlers need an absolute, publicly accessible image URL for reliable previews. Once a stable public site URL is known, regenerate the export using that URL (replace the example):

```sh
SITE_URL='https://your-public-host.example/daemon/' npm run build
```

This sets absolute `og:image`, `twitter:image`, and `og:url` metadata; runtime assets remain relative. `SITE_URL` is a build-time shell variable, not an environment file. For IPFS, use a stable HTTPS domain / IPNS / ENS gateway address that will serve the site. Do not embed the site's own new CID in itself: changing the HTML changes the CID. Publish the resulting export, then check Telegram and X previews at the actual public URL. No deployment address, IPFS pin, or successful social-crawler fetch is claimed by this local assignment; the “This page” card uses the exact publishing attribution supplied in the brief.

## Live data

`src/market.ts` selects Ethereum pairs with DAEMON's exact base-token address and IMD's exact quote-token address. If multiple qualify, it selects the most liquid. The browser fetches on load, then every 60 seconds; requests time out after 10 seconds. Empty results, malformed data, request failures and unavailable individual metrics display `—`. Missing market cap is not replaced with an invented number or FDV. “Pause updates” freezes figures with a visible stale-data notice; “Resume updates” fetches immediately. No live value is baked into the export.

## Validate

```sh
npx playwright install chromium
npm run validate
```

Validation runs three data tests and eight Chromium browser tests against the **production export at `/preview/`**. Stop any manual preview on port 4173 first. Tests cover exact primary navigation destinations, real clipboard round-trip, denial recovery, IMD pair selection, 60-second refresh, error clearing and recovery, pause/resume, empty/malformed results, timeouts, reflow, 200% text enlargement, reduced motion, a WCAG-tagged axe scan, and no-JavaScript navigation. Network fixtures make failure tests repeatable; external sites are intercepted for navigation tests, with no transactions performed.

Worker results: production build and TypeScript check passed; **3/3 data tests and 8/8 browser tests passed**. The actual DEX Screener request also returned HTTP 200 in the browser. Rendered screenshots were reviewed at 320, 375, 640 and 1440 CSS pixels; automated overflow checks also covered 960 and 1280. The text-enlargement defect found during review was repaired. All six Better Interface domains are documented in [artifacts/validation.md](artifacts/validation.md), with evidence and remaining limitations. This is worker-reported validation, not independent certification.

To respect this workspace's protected paths, worker dependency installation and test caches lived under `/tmp/daemon-build`, `/tmp/daemon-npm-cache` and `/tmp/daemon-browsers`; source/config/assets were mirrored there unchanged, then the clean export was copied back. Normal local development uses the commands above.

See [DESIGN.md](DESIGN.md) for the final design system, [THIRD_PARTY.md](THIRD_PARTY.md) for provenance and licenses, and [artifacts/path-budget.md](artifacts/path-budget.md) for submission limits. The 8 MiB budget includes `dist/`; do not remove required runtime assets or the lockfile to save space.
