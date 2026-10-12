"use client";
import { useEffect } from "react";
export function ClientRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to + window.location.search + window.location.hash); }, [to]);
  return null;
}
