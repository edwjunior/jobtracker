import type { ReactNode } from "react";

// Juego único de iconos: 16px, trazo de 1.75, esquinas redondeadas.
function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

type P = { className?: string };

export const CheckIcon = (p: P) => (
  <Icon {...p}>
    <path d="m3 8.5 3.2 3L13 4.5" />
  </Icon>
);
export const CrossIcon = (p: P) => (
  <Icon {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </Icon>
);
export const PlusIcon = (p: P) => (
  <Icon {...p}>
    <path d="M8 3v10M3 8h10" />
  </Icon>
);
export const MinusIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3 8h10" />
  </Icon>
);
export const ArrowLeftIcon = (p: P) => (
  <Icon {...p}>
    <path d="M13 8H3m4-4L3 8l4 4" />
  </Icon>
);
export const ArrowRightIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Icon>
);
export const SearchIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4" />
    <path d="m10 10 3.5 3.5" />
  </Icon>
);
export const PencilIcon = (p: P) => (
  <Icon {...p}>
    <path d="m3 13 .6-2.8L11 2.8a1.4 1.4 0 0 1 2 2l-7.4 7.4L3 13Z" />
  </Icon>
);
export const TrashIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8.5h6l.5-8.5" />
  </Icon>
);
export const ExternalIcon = (p: P) => (
  <Icon {...p}>
    <path d="M9 3h4v4M13 3 7.5 8.5M11 9.5V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2.5" />
  </Icon>
);
export const CardsViewIcon = (p: P) => (
  <Icon {...p}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx=".5" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx=".5" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx=".5" />
    <rect x="9" y="9" width="4.5" height="4.5" rx=".5" />
  </Icon>
);
export const TableViewIcon = (p: P) => (
  <Icon {...p}>
    <rect x="2.5" y="3" width="11" height="10" rx=".5" />
    <path d="M2.5 6.5h11M6.5 6.5V13" />
  </Icon>
);
export const BoardViewIcon = (p: P) => (
  <Icon {...p}>
    <rect x="2.5" y="3" width="3" height="10" rx=".5" />
    <rect x="6.5" y="3" width="3" height="6.5" rx=".5" />
    <rect x="10.5" y="3" width="3" height="8" rx=".5" />
  </Icon>
);
