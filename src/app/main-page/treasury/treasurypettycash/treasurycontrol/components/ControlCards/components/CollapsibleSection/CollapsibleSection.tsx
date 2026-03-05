"use client"
import * as React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string; // guarda estado en localStorage si lo pasas
  className?: string;
  titleWidth?: string | number; // ← nueva prop opcional
};

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  storageKey,
  className = "",
  titleWidth = "200px",
}: Props) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  // carga estado guardado
  React.useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setOpen(saved === "1");
  }, [storageKey]);

  // guarda estado
  React.useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, open ? "1" : "0");
  }, [open, storageKey]);

  return (
    <section className={`${className}`}>
      <button
        type="button"
        className="flex w-full items-center px-0 pb-4 text-blue-60"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="14"
            viewBox="0 0 14 8"
            fill="none"
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="#2075A6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        <span className="text-b4 text-blue-60 font-medium" style={{ width: titleWidth }}> {title} </span>
        <span className="w-full h-[1px] bg-blue-60"></span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
