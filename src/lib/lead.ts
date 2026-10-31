"use client";
/**
 * Visitor leads: the full result of a test opens once a visitor leaves their name and email.
 * Answers stay on the device. Only name, email, locale, source and consent are ever sent.
 */
const KEY = "horoscop:lead";
export type LeadInput = { name: string; email: string; marketing: boolean; source: string; locale: string };
export function hasLead(): boolean { try { return !!localStorage.getItem(KEY); } catch { return false; } }
export function markLead(): void { try { localStorage.setItem(KEY, new Date().toISOString()); } catch { /* private window */ } }
