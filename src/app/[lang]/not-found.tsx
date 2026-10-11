import Link from "next/link";
export default function NotFound() {
  return <div className="card text-center"><p className="h-display mb-2 text-3xl text-gold">Lost among the stars</p><Link className="btn-primary" href="/en/">Back home</Link></div>;
}
