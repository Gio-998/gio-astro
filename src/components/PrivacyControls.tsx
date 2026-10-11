"use client";
import { repo } from "@/lib/store";
export function PrivacyControls() {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-ghost" onClick={() => { const blob = new Blob([repo.exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-data.json"; a.click(); }}>Export my data (JSON)</button>
      <label className="btn-ghost cursor-pointer">Import from a file<input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const ok = repo.importAll(await f.text()); alert(ok ? "Imported." : "That file doesn't look like a Mirrorstar export."); }} /></label>
      <button className="btn-ghost text-rose" onClick={() => { if (confirm("Delete everything stored on this device? This can't be undone.")) { repo.deleteAll(); alert("Deleted."); } }}>Delete all my data</button>
    </div>
  );
}
