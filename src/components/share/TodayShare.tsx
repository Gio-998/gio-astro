"use client";
import type { StoredPerson } from "@/lib/store";
import { useContent } from "@/lib/content-context";
import { inviteUrl } from "@/lib/invites";
import { SkyCardShare } from "./SkyCardShare";
import { InvitePanel, useMyInvite } from "./InvitePanel";

/** Today: personal sky card (its QR points to my invite link when signed in) + my invite link. */
export function TodayShare({ me, people, now }: { me: StoredPerson; people: StoredPerson[]; now: Date }) {
  const { locale } = useContent(); const { code, accepts } = useMyInvite(me, people);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <SkyCardShare me={me} now={now} url={code ? inviteUrl(code, locale) : undefined} />
      <InvitePanel me={me} code={code} accepts={accepts} />
    </div>
  );
}
