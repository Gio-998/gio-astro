"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore, findPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useHref } from "@/lib/content-context";
import { buildBook } from "@/story/book";
import { BookView } from "../story/BookView";

export function BookPage() {
  const s = useStore(); const { c } = useContent(); const h = useHref();
  const id = useSearchParams().get("id") || "me";
  const person = findPerson(s, id);
  const book = useMemo(() => (person ? buildBook(profileOf(person), c, person.name) : null), [person, c]);
  if (!s) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!person || !book) return (
    <div className="card text-center">
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{c.book.title}</span></h1>
      <p className="mb-4 text-dim">{c.book.subtitle}</p>
      <Link className="btn-primary" href={h("/start/")}>{c.site.common.start}</Link>
    </div>
  );
  return <BookView book={book} name={person.name} forId={person.id} />;
}
