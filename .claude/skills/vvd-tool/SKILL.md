---
name: vvd-tool
description: >
  How to build, change, run, and ship the chezblack-name-generator VVD tool in this project. Use for ANY work on
  this codebase — adding features, changing the data model, styling, fixing bugs, or shipping
  (run/save/share/publish) — so the result stays collaborative, world-referencing, and native to VVD.
---

# Working on chezblack-name-generator (a VVD tool)

A **tool** is a document editor: it declares document types (`vvd.json → documentTypes`),
its data shape lives in `src/codec.ts` (`defineStateCodec` — this ONE definition also derives what
agents can do and what's queryable), and `defineTool` in `src/tool.tsx` renders it. Tools embed as
blocks anywhere.

## The loop (always verify live)

1. `vvd run` — renders chezblack-name-generator live in the user's world; every edit to `src/` hot-reloads on the
   open tab. This is your verification surface — don't claim something works until you've seen it here.
2. `vvd save "message"` — a private draft version. `vvd share` — the world/team can open it.
   `vvd publish` — submit to the Workshop (reviewed).
3. Secrets for `api/` handlers: `vvd secret set NAME` (encrypted, write-only). Read them ONLY via
   `ctx.secrets.get("NAME")` in an endpoint declaring `config.secrets` — **`process.env` is
   always empty in the tool-server runtime**, and outbound hosts must be declared in
   `config.fetch`. The UI calls endpoints with `useApi()`, never a hand-built URL.
   → `docs/server-endpoints-and-secrets.md`. GitHub: `vvd github connect` makes every push a
   version.

## Non-negotiables (what makes it feel native — details in AGENTS.md)

- **Reference, don't retype**: point at world documents by id through a picker; never re-enter world
  data. If you're adding a text input for something that exists in the world, add a picker instead.
- **Collaboration is the default**: state declared in the codec is already multiplayer — structure it
  with the right `field.*` types instead of one JSON blob, and never bolt on your own sync.
- **Show presence** when two people can be in the same place (facepile at minimum).
- **Canvases keep the camera local** (pan/zoom is per-user React state, never document state).

## Where to read more

- `AGENTS.md` — the front door: principles + guide index.
- `docs/references.md` — pickers, refs, live resolution (start here for any feature).
- `docs/documents-and-data.md` — the codec/field API and merge semantics.
- `docs/collaboration-and-presence.md` · `docs/canvases.md` — collab, presence, canvas patterns.
- `docs/server-endpoints-and-secrets.md` — API keys/secrets, egress, `useApi()` (read BEFORE
  touching `api/` or wiring an environment variable).
- `vvd help <command>` — exact CLI usage; `vvd doctor` if anything seems broken.
