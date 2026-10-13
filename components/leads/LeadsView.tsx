"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, use, useCallback, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Icon } from "@/components/Icon";
import { PageHeader, Popover, PrimaryButton, SearchBox, ToolButton } from "@/components/ui";
import { CreateLeadModal } from "@/components/leads/LeadModals";
import { LEAD_SOURCE_OPTIONS, LEADS, PIPELINE, PRIORITY_OPTIONS, type Lead } from "@/lib/mock/leads";

type Filter = { source: string; priority: string };
type Ctx = {
  rows: Lead[]; // Table view rows
  setRows: Dispatch<SetStateAction<Lead[]>>;
  cards: Lead[]; // Pipeline cards
  setCards: Dispatch<SetStateAction<Lead[]>>;
  search: string;
  setSearch: (v: string) => void;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
};

const LeadsCtx = createContext<Ctx | null>(null);

// Shared by Table and Pipeline views; `show` applies Search + Filter client-side.
export function useLeads() {
  const ctx = use(LeadsCtx);
  if (!ctx) throw new Error("useLeads must be used inside <LeadsView>");
  const q = ctx.search.trim().toLowerCase();
  const { source, priority } = ctx.filter;
  const show = (l: Lead) =>
    (!q || [l.title, l.source, l.stage, l.priority, l.owner, l.value, l.created].join(" ").toLowerCase().includes(q)) &&
    (!source || l.source === source) &&
    (!priority || l.priority === priority);
  return { ...ctx, show };
}

/* ---------- Filter dropdown (Figma 1:7751 collapsed / 1:7770 Sources expanded) ---------- */
// Figma rows: 40 + 0.5px divider (Chrome draws the 0.5px border as 1px, so the height is fixed instead of padded)
const row = "flex h-[40.5px] w-full cursor-pointer items-center px-4 text-left text-[16px] tracking-[-0.32px] text-nav last:h-10";

function FilterMenu({ onPicked }: { onPicked: () => void }) {
  const { filter, setFilter } = useLeads();
  const [open, setOpen] = useState<keyof Filter | null>(null);
  const groups: [keyof Filter, string, readonly string[]][] = [
    ["source", "Sources", LEAD_SOURCE_OPTIONS],
    ["priority", "Priority", PRIORITY_OPTIONS],
  ];
  return (
    <div className="flex w-[142px] flex-col divide-y-[0.5px] divide-stroke2 overflow-hidden rounded-[9px] border border-stroke2 bg-primary">
      {groups.map(([key, label, options]) => [
        <button key={key} type="button" aria-expanded={open === key} onClick={() => setOpen(open === key ? null : key)} className={row}>
          <span className="flex w-[94px] items-center justify-between">
            {label}
            <Icon name="arrow-right" size={18} className="rotate-90" />
          </span>
        </button>,
        ...(open === key
          ? options.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={filter[key] === o}
                onClick={() => {
                  setFilter((f) => ({ ...f, [key]: f[key] === o ? "" : o })); // click again to clear
                  onPicked();
                }}
                className={`${row} ${filter[key] === o ? "text-secondary" : ""}`}
              >
                {o}
              </button>
            ))
          : []),
      ])}
    </div>
  );
}

// Search / Report / Filter group: inside the table card (Table view), in the toggle row (Pipeline view).
export function LeadTools({ className = "" }: { className?: string }) {
  const { search, setSearch } = useLeads();
  const btn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <div className={`flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto ${className}`}>
      <SearchBox value={search} onChange={setSearch} />
      {/* Report: no prototype action in Figma */}
      <ToolButton label="Report" icon="download" />
      <ToolButton label="Filter" icon="filter" btnRef={btn} onClick={() => setOpen(true)} />
      {/* Figma: MANUAL overlay at (-38.2, 54) from the Filter button, 25% backdrop */}
      <Popover anchor={btn} open={open} onClose={close} dx={-38.2} dy={54}>
        <FilterMenu onPicked={close} />
      </Popover>
    </div>
  );
}

/* ---------- Table View / Pipeline View segmented control (1:6139 / 1:6998) ---------- */
// Fixed widths = Figma (text + 2×16 padding) so the active pill can slide between them.
const VIEWS = [
  { href: "/leads", label: "Table View", w: 120 },
  { href: "/leads/pipeline", label: "Pipeline View", w: 143 },
];

function ViewToggle({ pipeline }: { pipeline: boolean }) {
  return (
    <nav aria-label="Leads view" className="relative flex shrink-0 gap-[7px] rounded-[22px] border border-stroke2 bg-primary p-[10px]">
      {/* Smart Animate 300ms ease-out (Figma 1:6143 / 1:6999) */}
      <span
        aria-hidden
        className="absolute top-[10px] left-[10px] h-10 rounded-[12px] bg-button transition-[translate,width]"
        style={{ width: VIEWS[+pipeline].w, translate: pipeline ? `${VIEWS[0].w + 7}px` : "0" }}
      />
      {VIEWS.map((v, i) => {
        const active = i === +pipeline;
        return (
          <Link
            key={v.href}
            href={v.href}
            aria-current={active ? "page" : undefined}
            style={{ width: v.w }}
            className={`relative flex h-10 items-center justify-center text-[16px] font-medium whitespace-nowrap transition-colors ${active ? "text-primary" : "text-black"}`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* ---------- Shared layout for /leads (Table) and /leads/pipeline ---------- */
export function LeadsView({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pipeline = pathname.endsWith("/pipeline");
  const [rows, setRows] = useState(LEADS);
  const [cards, setCards] = useState(PIPELINE);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>({ source: "", priority: "" });
  const [creating, setCreating] = useState(false);
  const closeCreate = useCallback(() => setCreating(false), []);

  return (
    <LeadsCtx value={{ rows, setRows, cards, setCards, search, setSearch, filter, setFilter }}>
      <div className="flex flex-col gap-[18px] p-4 sm:p-6">
        <PageHeader
          title="Leads Management"
          subtitle="12 Total Leads"
          action={<PrimaryButton onClick={() => setCreating(true)}>Add Lead</PrimaryButton>}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ViewToggle pipeline={pipeline} />
          {pipeline && (
            <div className="w-full animate-dissolve sm:w-auto">
              {/* Pipeline frame (1:7005): Search / Report / Filter sit on the page, filled with primary */}
              <LeadTools className="*:bg-primary!" />
            </div>
          )}
        </div>
        <div key={pathname} className="min-w-0 animate-dissolve">
          {children}
        </div>
      </div>
      <CreateLeadModal
        open={creating}
        onClose={closeCreate}
        onCreate={(lead) => {
          setRows((r) => [lead, ...r]);
          setCards((c) => [lead, ...c]);
          closeCreate();
        }}
      />
    </LeadsCtx>
  );
}
