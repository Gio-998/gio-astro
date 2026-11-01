export type CopyProblem = { file: string; line: number; msg: string; excerpt: string };
export const RULES: [RegExp, string][];
export function checkCopy(root?: string): CopyProblem[];
export function checkLeadCopy(root?: string): CopyProblem[];
