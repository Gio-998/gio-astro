import Link from "next/link";
export default function NotFound() {
  return <div className="card mx-auto mt-10 max-w-lg text-center"><p className="h-display mb-4 text-4xl"><span className="text-aurora">Lost among the stars</span></p><p className="mb-4 text-dim">Изгубени меѓу ѕвездите</p><div className="flex justify-center gap-2"><Link className="btn-primary" href="/en/">Back home</Link><Link className="btn-ghost" href="/mk/">Почетна</Link></div></div>;
}
