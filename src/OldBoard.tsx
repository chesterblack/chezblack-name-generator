import { type Note } from "@/codec";
import { useDocDropTarget, useDocumentPresence, useHostCapability } from "@vvd/sdk";
import { useMemo, useState, useEffect } from "react";
import { NoteCard } from "./NoteCard";
import { PresenceStrip } from "./PresenceStrip";
import { newId, NAME } from "./tool";
import { useT } from "./useT";

export function OldBoard({ data, actions, handle, canEdit, worldId }: {
  data: { notes: Readonly<Record<string, Note>>; };
  actions: { map(name: "notes"): { set(key: string, value: Note): void; delete(key: string): void; }; };
  handle: Parameters<typeof useDocumentPresence>[0];
  canEdit: boolean;
  worldId: string;
}) {
  const refs = useHostCapability("refs");
  const nav = useHostCapability("nav");
  const t = useT();
  const notes = useMemo(() => Object.entries(data.notes).sort((a, b) => a[1].at - b[1].at), [data.notes]);

  // Resolve linked ids → display names through the host (batched, host-cached; never stored).
  const idsKey = useMemo(
    () => [...new Set(notes.map(([, n]) => n.linkedDocumentId).filter((x): x is string => !!x))].join(","),
    [notes]
  );
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    if (!ids.length) return;
    let live = true;
    refs.meta(ids).then((m) => {
      if (!live) return;
      const out: Record<string, string> = {};
      m.forEach((r, docId) => { out[docId] = r.name; });
      setNames(out);
    });
    return () => { live = false; };
  }, [idsKey, refs]);

  const openDoc = (docId: string) => nav.openDocument(refs.coordsFor(docId) ?? { worldId, documentId: docId });
  const addNote = () => actions.map("notes").set(newId(), { text: "", linkedDocumentId: null, at: Date.now() });

  // The platform dnd contract: drag any document from the sidebar onto the board
  // and it lands as a linked note (reference by id — never a copy).
  const drop = useDocDropTarget({
    zone: "chezblack-name-generator-board",
    accepts: (p) => canEdit && (!p.worldId || p.worldId === worldId),
    onDrop: (p) => actions.map("notes").set(newId(), { text: "", linkedDocumentId: p.documentId, at: Date.now() }),
  });

  return (
    <div ref={drop.ref} {...drop.props}
      style={{ height: "100%", overflowY: "auto", outline: drop.canDrop ? "2px dashed rgba(127,127,127,0.55)" : "none", outlineOffset: -8 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{NAME}</h1>
          {/* Counts go through t.plural — Intl.PluralRules picks the form, and a catalog
                can add an exact-count form ("0": "no notes yet") that no rule can express. */}
          <span style={{ flex: 1, fontSize: 13, opacity: 0.5 }}>{t.plural("board.count", notes.length)}</span>
          <PresenceStrip handle={handle} />
          {canEdit && (
            <button type="button" onClick={addNote}
              style={{ padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(127,127,127,0.4)", background: "transparent", color: "inherit", cursor: "pointer", font: "inherit", fontSize: 13, fontWeight: 600 }}>
              {t("board.add")}
            </button>
          )}
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {notes.map(([id, note]) => (
            <NoteCard key={id} note={note} canEdit={canEdit}
              linkedName={note.linkedDocumentId ? names[note.linkedDocumentId] || null : null}
              onChange={(next) => actions.map("notes").set(id, next)}
              onDelete={() => actions.map("notes").delete(id)}
              onOpenLink={() => note.linkedDocumentId && openDoc(note.linkedDocumentId)} />
          ))}
          {notes.length === 0 && (
            <p style={{ gridColumn: "1 / -1", opacity: 0.6, fontSize: 14 }}>
              {canEdit ? t("board.emptyEditable") : t("board.empty")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
