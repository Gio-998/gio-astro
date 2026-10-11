import Link from "next/link";
export default function NotFound() {
  return <div className="card mx-auto mt-10 max-w-lg text-center"><p className="h-display mb-4 text-4xl"><span className="text-aurora">Lost among the stars</span></p><Link className="btn-primary" href="/en/">Back home</Link></div>;
}
