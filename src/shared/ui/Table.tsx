import { ReactNode } from "react";

export function TableRow({
  children,
  index,
  highlight,
  highlightColor,
}: {
  children: ReactNode;
  index: number;
  highlight?: boolean;
  highlightColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 text-sm"
      style={{
        backgroundColor: highlight ? `${highlightColor}18` : index % 2 ? "rgba(255,255,255,0.02)" : "transparent",
        borderLeft: highlight ? `2px solid ${highlightColor}` : "2px solid transparent",
      }}
    >
      {children}
    </div>
  );
}
