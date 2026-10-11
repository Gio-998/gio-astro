/**
 * Shadow & Light: seven classical "sins" read as shadow ↔ gift axes, each paired with a virtue.
 * Items are our own wording (anchored to constructs such as dispositional envy, greed, trait anger,
 * self-discipline). For reflection only — never a moral verdict.
 */
export const AXES = ["pride", "greed", "desire", "envy", "excess", "anger", "inertia"] as const;
export type Axis = (typeof AXES)[number];
export interface ShadowItem { id: string; axis: Axis; side: "shadow" | "light" }
export const SHADOW_ITEMS: ShadowItem[] = AXES.flatMap((axis) => [
  { id: `${axis}-s`, axis, side: "shadow" as const },
  { id: `${axis}-l`, axis, side: "light" as const },
]);
// Interleave so the same axis is never asked twice in a row.
export const SHADOW_ORDER: string[] = [...AXES.map((a) => `${a}-s`), ...AXES.map((a) => `${a}-l`)];

export interface AxisResult { axis: Axis; shadow: number; light: number; balance: number }
export function scoreShadow(answers: Record<string, number>): { axes: AxisResult[]; strongestLight: Axis; mainShadow: Axis } {
  const to100 = (v?: number) => (v == null ? 50 : Math.round(((v - 1) / 4) * 100));
  const axes = AXES.map((axis) => {
    const shadow = to100(answers[`${axis}-s`]);
    const light = to100(answers[`${axis}-l`]);
    return { axis, shadow, light, balance: light - shadow };
  });
  const strongestLight = [...axes].sort((a, b) => b.light - a.light || b.balance - a.balance)[0].axis;
  const mainShadow = [...axes].sort((a, b) => b.shadow - a.shadow || a.balance - b.balance)[0].axis;
  return { axes, strongestLight, mainShadow };
}
