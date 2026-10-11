"use client";
import { repo } from "@/lib/store";
export function PrivacyControls() {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-ghost" onClick={() => { const blob = new Blob([repo.exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-data.json"; a.click(); }}>Export my data (JSON)</button>
      <button className="btn-ghost text-rose" onClick={() => { if (confirm("Delete everything stored on this device? This can't be undone.")) { repo.deleteAll(); alert("Deleted."); } }}>Delete all my data</button>
    </div>
  );
}
