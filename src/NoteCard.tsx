import { type Note } from "@/codec";
import { HostIcon, useContextMenu } from "@vvd/sdk";
import { useState } from "react";
import { ReferencePicker } from "./ReferencePicker";
import { CHIP } from "./tool";
import { useT } from "./useT";

export function NoteCard({ note, canEdit, linkedName, onChange, onDelete, onOpenLink }: {
  note: Note;
  canEdit: boolean;
  linkedName: string | null;
  onChange: (next: Note) => void;
  onDelete: () => void;
  onOpenLink: () => void;
}) {
  const [linking, setLinking] = useState(false);
  const t = useT();
  const { openContextMenu } = useContextMenu();
  return (
    <div
      onContextMenu={(e) => {
        // Actions live on the platform right-click menu — no button chrome on the card.
        if (!canEdit) return;
        openContextMenu(e, [
          ...(note.linkedDocumentId
            ? [{ kind: "item" as const, id: "unlink", label: t("note.unlink"), icon: "tabler:circle-x", onSelect: () => onChange({ ...note, linkedDocumentId: null }) }]
            : []),
          { kind: "item" as const, id: "delete", label: t("note.delete"), icon: "tabler:trash", variant: "destructive" as const, onSelect: onDelete },
        ]);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14, borderRadius: 12, border: "1px solid rgba(127,127,127,0.3)", background: "rgba(127,127,127,0.07)" }}>
      <textarea value={note.text} readOnly={!canEdit} placeholder={t("note.placeholder")}
        onChange={(e) => onChange({ ...note, text: e.target.value })}
        style={{ resize: "none", minHeight: 64, border: "none", outline: "none", background: "transparent", font: "inherit", fontSize: 14, lineHeight: 1.45, color: "inherit" }} />
      {/* Dates are never hand-formatted: t.date runs Intl.DateTimeFormat in the reader's
                language, so the same timestamp reads right in every one of them. */}
      <span style={{ fontSize: 11, opacity: 0.4 }}>{t.date(note.at)}</span>
      {note.linkedDocumentId ? (
        <button type="button" onClick={onOpenLink} title={t("note.open")} style={{ ...CHIP, cursor: "pointer", alignSelf: "flex-start" }}>
          <HostIcon icon="link" size={11} /> {linkedName || t("note.linked")}
        </button>
      ) : canEdit ? (
        <span style={{ position: "relative", alignSelf: "flex-start" }}>
          <button type="button" onClick={() => setLinking(true)} style={{ ...CHIP, cursor: "pointer", opacity: 0.55, borderStyle: "dashed" }}>{t("note.link")}</button>
          {linking && (
            <span style={{ position: "absolute", zIndex: 30, top: "100%", left: 0, marginTop: 4, width: 250 }}>
              <ReferencePicker onClose={() => setLinking(false)} onPick={(h) => { onChange({ ...note, linkedDocumentId: h.id }); setLinking(false); }} />
            </span>
          )}
        </span>
      ) : null}
    </div>
  );
}
