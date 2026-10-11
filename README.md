# chezblack-name-generator

A VVD tool built with the `vvd` CLI.

- `vvd run`     — render it live in your world; edits to `src/` hot-reload instantly.
- `vvd save`    — save a new version (a private draft — only you).
- `vvd publish` — put your latest save in the Workshop (Workshop → Developer).

Your code lives in `src/`. The app, host, and world are the real VVD — so your project stays tiny.

## Building the VVD way

Start with **[`AGENTS.md`](AGENTS.md)** — the front door (for you or a coding agent). It states the
core principles and links the deep dives in [`docs/`](docs/):

- [`docs/references.md`](docs/references.md) — **reference world data, don't retype it** (start here).
- [`docs/documents-and-data.md`](docs/documents-and-data.md) — the document system + how to structure state.
- [`docs/collaboration-and-presence.md`](docs/collaboration-and-presence.md) — native collab + presence displays.
- [`docs/canvases.md`](docs/canvases.md) — build a map/graph/board the VVD way.
- [`docs/server-endpoints-and-secrets.md`](docs/server-endpoints-and-secrets.md) — API keys, third-party calls, webhooks (**read before touching `api/` or an env var**).
- [`docs/i18n.md`](docs/i18n.md) — the `src/locales/` catalogs + `vvd locales add`. Optional, and about ten minutes.
- [`ANALYTICS.md`](ANALYTICS.md) — measure usage with one `track()` call.

## Editor types for `@vvd/sdk`

The `@vvd/sdk` type sources weren't found on this machine when this project was scaffolded, so
`tsconfig.json` skips the `@vvd/*` path aliases (`vvd run` / `vvd save` are unaffected — the host
injects the real SDK at run time). To restore editor types + typechecking against the SDK, run
`vvd doctor --fix-types`, or point `paths` in `tsconfig.json` at a vvd checkout's `packages/`.
