"use client";
import { repo } from "@/lib/store";
import { useContent } from "@/lib/content-context";
export function PrivacyControls() {
  const U = useContent().c.ui.privacyControls;
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-ghost" onClick={() => { const blob = new Blob([repo.exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-data.json"; a.click(); }}>{U.export}</button>
      <label className="btn-ghost cursor-pointer">{U.import}<input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const ok = repo.importAll(await f.text()); alert(ok ? U.imported : U.badFile); }} /></label>
      <button className="btn-ghost text-rose" onClick={() => { if (confirm(U.confirm)) { repo.deleteAll(); alert(U.deleted); } }}>{U.deleteAll}</button>
    </div>
  );
}
