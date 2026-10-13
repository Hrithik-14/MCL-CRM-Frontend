"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "./Icon";

/* ---------- Page header (title / subtitle / action, bottom divider) ---------- */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 border-b border-stroke2 pb-[23px]">
      <div className="flex min-w-px flex-1 flex-col gap-1 text-black">
        <h1 className="text-[26px] font-semibold tracking-[-0.64px] sm:text-[32px]">{title}</h1>
        <p className="text-[16px] opacity-50">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

/* ---------- Buttons ---------- */
// Figma "Tab select/Button" (blue, plus icon)
export function PrimaryButton({ children, icon = "add", onClick }: { children: ReactNode; icon?: IconName | null; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 cursor-pointer items-center gap-2 rounded-[16px] bg-button px-[18px] py-[14px] text-[18px] leading-6 font-medium whitespace-nowrap text-white">
      {icon && <Icon name={icon} className="text-white" />}
      {children}
    </button>
  );
}

// Figma "Button" (Report / Filter): label + trailing 18px icon
export function ToolButton({ label, icon, onClick, btnRef }: { label: string; icon: IconName; onClick?: () => void; btnRef?: RefObject<HTMLButtonElement | null> }) {
  return (
    <button ref={btnRef} type="button" onClick={onClick} className="flex shrink-0 cursor-pointer items-center gap-2 rounded-[18px] border border-stroke2 bg-bg5 px-[17px] py-[13px] text-[16px] leading-5 font-medium whitespace-nowrap text-nav">
      {label}
      <Icon name={icon} size={18} />
    </button>
  );
}

export function SearchBox({ value, onChange, className = "sm:w-[314px]" }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`flex w-full items-center gap-2 rounded-[18px] border border-stroke2 bg-bg5 px-[17px] py-[13px] ${className}`}>
      <Icon name="search" size={18} className="text-nav" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="w-full min-w-0 bg-transparent text-[16px] leading-[20px] font-medium text-nav outline-none placeholder:text-nav"
      />
    </label>
  );
}

// Square icon button used in table "Actions"
export function IconButton({ icon, label, onClick, className = "" }: { icon: IconName; label: string; onClick?: () => void; className?: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={`flex h-9 w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-stroke2 bg-bg5 ${className}`}>
      <Icon name={icon} size={18} className="text-nav" />
    </button>
  );
}

/* ---------- Status pills (Figma variant sets 1:7125, 1:7138, 1:7992, 1:7797) ---------- */
const BADGE: Record<string, [bg: string, border: string, text: string]> = {
  New: ["rgb(140 182 255/.3)", "rgb(140 182 255/.5)", "#8cb6ff"],
  Contacted: ["rgb(103 111 246/.3)", "rgb(103 111 246/.5)", "#676ff6"],
  Interested: ["rgb(101 238 136/.3)", "rgb(48 175 80/.5)", "#30a74e"],
  Proposal: ["rgb(251 146 60/.3)", "rgb(251 146 60/.5)", "#fb923c"],
  Converted: ["rgb(229 0 241/.3)", "rgb(229 0 241/.5)", "#e500f1"],
  Lost: ["rgb(249 74 74/.3)", "rgb(255 15 0/.5)", "#f94a4a"],
  Low: ["rgb(101 238 136/.3)", "rgb(48 175 80/.5)", "#30a74e"],
  Medium: ["rgb(255 136 0/.2)", "rgb(255 136 0/.5)", "#f80"],
  High: ["rgb(249 74 74/.2)", "rgb(249 74 74/.5)", "#f94a4a"],
  Pending: ["rgb(255 136 0/.3)", "rgb(255 136 0/.5)", "#f80"],
  Completed: ["rgb(101 238 136/.3)", "rgb(48 175 80/.5)", "#30a74e"],
  Overdue: ["rgb(249 74 74/.3)", "rgb(249 74 74/.5)", "#f80"],
  Active: ["rgb(101 238 136/.2)", "rgb(48 167 78/.5)", "#4ade80"],
  Inactive: ["rgb(249 74 74/.2)", "rgb(249 74 74/.5)", "#f94a4a"],
};

export function Badge({ label, width, className = "" }: { label: string; width?: number; className?: string }) {
  const [bg, border, color] = BADGE[label] ?? BADGE.New;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[19px] border px-[7px] py-[3px] text-[14px] leading-[17px] whitespace-nowrap ${className}`}
      style={{ background: bg, borderColor: border, color, width }}
    >
      {label}
    </span>
  );
}

/* ---------- Pagination ---------- */
export function Pagination({ label, pages = 4 }: { label: string; pages?: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 py-5">
      <p className="text-[12px] text-muted">{label}</p>
      <div className="flex items-center gap-[6px]">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPage(n)}
            className={`flex h-8 cursor-pointer items-center justify-center rounded-[4px] px-3 text-[14px] ${n === page ? "bg-stroke text-white" : "text-muted"}`}
          >
            {n}
          </button>
        ))}
        <button type="button" aria-label="Next page" onClick={() => setPage((p) => Math.min(pages, p + 1))} className="cursor-pointer text-nav">
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Overlays ---------- */
function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
}

// Figma overlay: CENTER (or TOP_CENTER), black 50% backdrop, close on click outside, instant.
export function Modal({ open, onClose, title, children, className = "w-[700px]", top = false }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  top?: boolean;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex justify-center bg-black/50 p-4 ${top ? "items-start" : "items-center"}`} onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative flex max-h-[calc(100dvh-32px)] max-w-full flex-col gap-6 overflow-y-auto rounded-[24px] border border-stroke2 bg-primary p-5 sm:p-8 ${className}`}
      >
        <div className="flex w-full items-start border-b border-stroke2 pr-8 pb-8">
          <h2 className="text-[22px] font-medium text-black sm:text-[28px]">{title}</h2>
        </div>
        {/* Figma close control: 24px, centred 47px from the right / 45px from the top of every overlay */}
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-[33px] right-[35px] cursor-pointer text-black">
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ModalActions({ onCancel, onDone, doneLabel = "Done" }: { onCancel: () => void; onDone: () => void; doneLabel?: string }) {
  return (
    <div className="flex items-center justify-end gap-[6px]">
      <button type="button" onClick={onCancel} className="h-10 cursor-pointer rounded-[12px] border border-button bg-white px-4 text-[16px] font-medium text-black">
        Cancel
      </button>
      <button type="button" onClick={onDone} className="h-10 cursor-pointer rounded-[12px] bg-button px-4 text-[16px] font-medium text-primary">
        {doneLabel}
      </button>
    </div>
  );
}

// Figma overlay: MANUAL position relative to the trigger, optional 25% backdrop, close on click outside.
export function Popover({ anchor, open, onClose, dx = 0, dy = 0, backdrop = true, children }: {
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  dx?: number;
  dy?: number;
  backdrop?: boolean;
  children: ReactNode;
}) {
  useEscape(open, onClose);
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", onClose);
    return () => window.removeEventListener("resize", onClose);
  }, [open, onClose]);
  if (!open) return null;
  // Position is read from the trigger when the panel mounts (no extra render pass).
  const place = (el: HTMLDivElement | null) => {
    const r = el && anchor.current?.getBoundingClientRect();
    if (!el || !r) return;
    el.style.left = `${Math.max(8, Math.min(r.left + dx, window.innerWidth - el.offsetWidth - 8))}px`;
    el.style.top = `${r.top + dy}px`;
  };
  // Portal to <body>: keeps the overlay out of any ancestor <label> (whose activation would
  // re-click the trigger) and out of scroll/stacking contexts such as modal bodies.
  return createPortal(
    <div className={`fixed inset-0 z-50 ${backdrop ? "bg-black/25" : ""}`} onMouseDown={onClose} onWheel={onClose}>
      <div ref={place} className="fixed" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- Form fields (modal forms) ---------- */
export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`flex w-full min-w-0 flex-col gap-[6px] ${className}`}>
      <span className="text-[18px] font-medium text-black sm:text-[20px]">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "min-h-[46px] w-full rounded-[16px] border border-stroke2 bg-bg5 px-6 py-[12px] text-[16px] leading-5 font-medium text-black outline-none placeholder:text-black/50 focus:border-stroke";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} h-[86px] resize-none ${props.className ?? ""}`} />;
}

// Dropdown field: input-styled trigger + designed option list (Figma 1:7760 / 1:7751 style)
export function SelectField({ value, options, onChange, placeholder, icon = "arrow-right", iconSize = 18, iconClass = "rotate-90 text-black", className = "" }: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: IconName;
  iconSize?: number;
  iconClass?: string;
  className?: string; // extra trigger classes
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          setWidth(ref.current?.offsetWidth ?? 0);
          setOpen(true);
        }}
        className={`${inputCls} flex cursor-pointer items-center justify-between text-left ${className}`}
      >
        <span className={value ? "" : "opacity-50"}>{value || placeholder}</span>
        <Icon name={icon} size={iconSize} className={iconClass} />
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} dy={50}>
        <ul className="overflow-hidden rounded-[9px] border border-stroke2 bg-primary" style={{ width }}>
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className="w-full cursor-pointer border-b-[0.5px] border-stroke2 px-4 py-[10px] text-left text-[16px] tracking-[-0.32px] text-nav last:border-b-0"
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
}
