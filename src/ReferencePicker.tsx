import { HostIcon, useHostCapability } from "@vvd/sdk";
import { useState, useEffect } from "react";
import { Hit } from "./tool";
import { useT } from "./useT";

/** The native reference-picker pattern (the Board/Canvas/relation-tree pickers):
 *  search the world IMMEDIATELY (an empty query shows suggestions), arrow keys +
 *  Enter to pick, a create-as-card fallback — and always hand back the document
 *  ID, never the text. Entity icons render through the platform icon engine. */
export function ReferencePicker({ onPick, onClose }: { onPick: (hit: Hit) => void; onClose: () => void; }) {
  const search = useHostCapability("search");
  const t = useT();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      search.query(q, { types: ["card"], limit: 12 }).then((r) => {
        if (!live) return;
        setHits(r);
        setLoaded(true);
        setActive(0);
      });
    }, q ? 150 : 0);
    return () => { live = false; clearTimeout(timer); };
  }, [q, search]);
  const canCreate = !!search.create && q.trim() !== "" && !hits.some((h) => h.name.toLowerCase() === q.trim().toLowerCase());
  const total = hits.length + (canCreate ? 1 : 0);
  const choose = (i: number) => {
    if (i < hits.length) onPick(hits[i]);
    else if (canCreate) void search.create?.(q.trim(), null).then((made) => { if (made) onPick(made); });
  };
  return (
    <span style={{ display: "grid", gap: 2, minWidth: 220, padding: 4, borderRadius: 10, background: "rgba(20,22,29,0.97)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 14px 32px rgba(0,0,0,0.45)" }}>
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("picker.search")}
        onKeyDown={(e) => {
          if (e.key === "Escape") { e.preventDefault(); onClose(); }
          else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(0, total - 1))); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); if (total > 0) choose(active); }
        }}
        onBlur={() => setTimeout(onClose, 120)}
        style={{ padding: "7px 10px", borderRadius: 7, border: "none", outline: "none", background: "rgba(255,255,255,0.08)", color: "#fff", font: "inherit", fontSize: 13 }} />
      <span style={{ display: "grid", maxHeight: 240, overflowY: "auto" }}>
        {hits.map((h, i) => (
          <button key={h.id} type="button" onMouseDown={(e) => { e.preventDefault(); choose(i); }} onMouseEnter={() => setActive(i)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px", borderRadius: 7, border: "none", textAlign: "left", cursor: "pointer", font: "inherit", fontSize: 13, color: "#fff", background: i === active ? "rgba(255,255,255,0.12)" : "transparent" }}>
            <HostIcon icon={h.entityTypeIcon || "file-text"} size={13} />
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{h.name || t("common.untitled")}</span>
            {h.entityTypeName ? <span style={{ fontSize: 10.5, opacity: 0.5 }}>{h.entityTypeName}</span> : null}
          </button>
        ))}
        {canCreate && (
          <button type="button" onMouseDown={(e) => { e.preventDefault(); choose(hits.length); }} onMouseEnter={() => setActive(hits.length)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px", borderRadius: 7, border: "none", textAlign: "left", cursor: "pointer", font: "inherit", fontSize: 13, color: "#fff", background: active === hits.length ? "rgba(255,255,255,0.12)" : "transparent" }}>
            <HostIcon icon="plus" size={13} />
            {/* One phrase, one key — never "Create " + q + "": word order is not universal. */}
            <span style={{ flex: 1 }}>{t("picker.create", { query: q.trim() })}</span>
          </button>
        )}
        {loaded && hits.length === 0 && !canCreate && <span style={{ padding: "10px 12px", fontSize: 12, opacity: 0.5 }}>{t("picker.empty")}</span>}
      </span>
    </span>
  );
}
