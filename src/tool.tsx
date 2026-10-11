import { type CSSProperties, useMemo } from "react"

import { DocumentGate, type ToolRenderProps, defineTool, useDocument } from "@vvd/sdk"

import { codec } from "@/codec"
import en from "@/locales/en.json"
import { OldBoard } from "./OldBoard"
import { Board } from "./Board"

export const NAME = "chezblack-name-generator"

// chezblack-name-generator is a tiny shared notes board — small on purpose, but nothing here is
// faked: every note is real collaborative state (edits converge live for everyone),
// presence is real, and a note's link chip points at a REAL world document by id —
// rename the card and the chip follows. It already behaves like a vvd tool: it
// lives in the sidebar, embeds as a block on any page, shares like any document,
// accepts sidebar drags through the platform dnd engine, and puts its actions on
// the platform right-click menu.

export const newId = () => crypto.randomUUID()

// ── Words ────────────────────────────────────────────────────────────────────
// The HOST decides WHICH language the reader is in (and re-publishes live when they
// switch — the subtree re-renders in place, nothing remounts); these JSON files decide
// what chezblack-name-generator says in it. Adding a language is two steps: `vvd locales add fr`
// writes src/locales/fr.json with every key blank, then import it into CATALOGS below.
// `vvd locales check` tells you what's still untranslated — it warns, it never blocks,
// and a half-filled catalog falls back key-by-key to English, so you can ship at any point.
//
// Only UI text lives here. A note's own words are the AUTHOR's — never localize the
// content a person typed into your creation.
export const CATALOGS = { en }

export type Hit = { id: string; name: string; entityTypeName: string | null; entityTypeIcon: string | null }

export const CHIP: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(127,127,127,0.4)", background: "transparent", color: "inherit", font: "inherit", fontSize: 12, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }

export function NameGeneratorView({ document, context }: ToolRenderProps) {
  const coords = useMemo(
    () => ({ worldId: document.worldId, documentId: document.id }),
    [document.worldId, document.id],
  )
  const { data, status, actions, retry, handle, Skeleton } = useDocument(coords, codec);

  return (
    <DocumentGate status={status} onRetry={retry}>
      { data && actions &&
        <Board data={data} actions={actions} handle={handle} canEdit={context.canEdit} worldId={document.worldId} Skeleton={ Skeleton } />
      }
    </DocumentGate>
  )
}

export default defineTool({
  id: "chezblack-name-generator",
  name: "Name Generator",
  documentTypes: ["chezblack-name-generator"],
  needs: [],
  render: NameGeneratorView,
})
