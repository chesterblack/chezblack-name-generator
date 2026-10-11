import { useDocumentPresence } from "@vvd/sdk";

/** The baseline presence display — who else is in this document right now. */
export function PresenceStrip({ handle }: { handle: Parameters<typeof useDocumentPresence>[0]; }) {
  const others = useDocumentPresence(handle).filter((p) => !p.isSelf);
  if (others.length === 0) return null;
  return (
    <span style={{ display: "flex", alignItems: "center" }} title={others.map((p) => p.name).join(", ")}>
      {others.slice(0, 5).map((p) => (
        <span key={p.userId} style={{ width: 24, height: 24, borderRadius: "50%", marginLeft: -8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: p.color, color: "#fff", fontSize: 11, fontWeight: 700, border: "2px solid rgba(255,255,255,0.35)" }}>
          {p.name ? p.name.slice(0, 1).toUpperCase() : ""}
        </span>
      ))}
      {others.length > 5 && <span style={{ marginLeft: 6, fontSize: 12, opacity: 0.7 }}>+{others.length - 5}</span>}
    </span>
  );
}
