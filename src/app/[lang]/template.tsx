"use client";
import { useEffect, useState } from "react";

let navigated = false;
/** Page-change fade, in CSS (.page-enter in globals.css). The first page of a visit skips it: fading in from opacity 0 would keep the text invisible until hydration. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [enter] = useState(navigated);
  useEffect(() => { navigated = true; }, []);
  return <div className={enter ? "page-enter" : undefined}>{children}</div>;
}
