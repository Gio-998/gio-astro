/** Long story sections for one angel number page, written per locale. */
export interface LongSection { title: string; paras: string[] }
export type AngelLong = Record<string, LongSection[]>;
