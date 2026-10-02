// Vocabulario único de controles. La acción es la tinta: sin color de acento.
const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] px-4 py-2 text-sm font-semibold transition-colors duration-150 disabled:opacity-50";

export const buttonPrimary = `${base} bg-ink text-folder hover:bg-ink-soft`;
export const buttonSecondary = `${base} border border-ink text-ink hover:bg-drawer`;

export const fieldClass =
  "w-full rounded-[2px] border border-rule-strong bg-white px-3 py-2 text-sm placeholder:text-ink-faint";
