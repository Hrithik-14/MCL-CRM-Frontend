"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { PageHeader, Popover, SelectField, ToolButton } from "@/components/ui";
import {
  BREAKDOWN_HEAD, BREAKDOWN_ROWS, BREAKDOWN_TOTAL, COUNTRIES, DOC_TYPES, RATE_CHART_REF, RATE_HEAD, RATE_ROWS,
  RATE_TOTAL, RECENT_CALCS, RECENT_HEAD, type Calc, type DocType,
} from "@/lib/mock/calculator";

const MAX_KG = 10; // "Rate Calculator Supports Shipments Up To 10 kg"
const FSC_NOTE = "Please Verify The Latest Fuel Surcharge (FSC) With The International Department.";

/* ---------- Table: Figma rows are flex/justify-between with fixed column widths ---------- */
// w = Figma width; min = narrowest the column may shrink to (its text + breathing room) before the table scrolls inside its card.
type Col = { w: number; min: number; center?: boolean };
const HEAD = "items-start py-5 text-[18px] font-semibold tracking-[-0.72px] *:opacity-80";
const BODY = "items-center pt-[10px] pb-4 text-[16px] tracking-[-0.64px]";
const TOTAL = "items-center pt-5 pb-9 text-[16px] font-semibold tracking-[-0.64px] uppercase";

function Row({ cols, cells, className }: { cols: Col[]; cells: ReactNode[]; className: string }) {
  return (
    <div className={`flex justify-between border-b border-stroke2 text-black ${className}`}>
      {cells.map((c, i) => (
        <div key={i} className={cols[i].center ? "text-center" : ""} style={{ width: cols[i].w, minWidth: cols[i].min }}>
          {c}
        </div>
      ))}
    </div>
  );
}

function Table({ cols, head, rows, total }: { cols: Col[]; head: string[]; rows: ReactNode[][]; total?: string[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-5" style={{ minWidth: cols.reduce((s, c) => s + c.min, 0) }}>
        <div className="flex flex-col gap-[10px]">
          <Row cols={cols} cells={head} className={HEAD} />
          {rows.map((r, i) => (
            <Row key={i} cols={cols} cells={r} className={BODY} />
          ))}
        </div>
        {total && <Row cols={cols} cells={total} className={TOTAL} />}
      </div>
    </div>
  );
}

function Card({ title, action, note, noteCls = "py-5 text-[12px]", className = "", children }: {
  title: string;
  action?: ReactNode;
  note: string;
  noteCls?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`flex min-w-0 flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 pb-5">
        <h2 className="text-[28px] font-medium text-black">{title}</h2>
        {action}
      </div>
      {children}
      <p className={`text-muted ${noteCls}`}>{note}</p>
    </section>
  );
}

const RATE_COLS: Col[] = [{ w: 300, min: 180 }, { w: 160, min: 100, center: true }, { w: 160, min: 100, center: true }, { w: 160, min: 130, center: true }];
const BREAKDOWN_COLS: Col[] = [{ w: 300, min: 125 }, { w: 160, min: 120, center: true }, { w: 160, min: 90, center: true }];
const RECENT_COLS: Col[] = [
  { w: 300, min: 174 },
  { w: 160, min: 156 },
  { w: 160, min: 140 },
  { w: 160, min: 134, center: true },
  { w: 160, min: 160 },
  { w: 160, min: 74, center: true },
  { w: 160, min: 72, center: true },
];

// Edit overlay 1:8122 is styled differently from the shared Modal (Inter, #1e2834 border, 45px inputs).
const editInput =
  "h-[45px] w-full rounded-[16px] border border-stroke2 bg-bg5 px-6 text-[16px] text-nav outline-none placeholder:text-nav/70 focus:border-stroke";
function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-[6px]">
      <span className="text-[20px] text-nav">{label}</span>
      {children}
    </label>
  );
}

const label = "text-[16px] font-medium text-black opacity-70";
const column = "flex min-w-[257px] flex-1 flex-col justify-center gap-3";

export default function CalculatorPage() {
  // Figma toggle 1:8171: "Default" variant (1:8172) = NDOX selected.
  const [doc, setDoc] = useState<DocType>("NDOX");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [weight, setWeight] = useState("1.500");
  const kg = Math.min(MAX_KG, Math.max(0, Number(weight) || 0));

  const [recent, setRecent] = useState(RECENT_CALCS);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Calc | null>(null);
  const set = (k: keyof Calc) => (v: string) => setDraft((d) => d && { ...d, [k]: v });
  const editing = draft !== null;
  useEffect(() => {
    if (!editing) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDraft(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [editing]);

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <PageHeader title="International Rate Calculator" subtitle="Enter Shipment Details And International Courier Tariffs" />

      {/* Shipment input (Figma 1:6266) */}
      <section className="flex flex-col gap-4 rounded-[22px] border border-stroke2 bg-primary p-5">
        <div className="flex flex-wrap items-end gap-[18px]">
          <div className={column}>
            <p className={label}>DOX / NDOX</p>
            {/* Variant change on click: Smart Animate 300ms ease-out = sliding pill */}
            <div className="relative flex w-fit gap-[7px] rounded-[16px] border border-stroke2 bg-bg5 p-1">
              <span
                aria-hidden
                className={`absolute top-1 bottom-1 left-1 w-[120px] rounded-[12px] bg-button transition-transform ${doc === "NDOX" ? "translate-x-[127px]" : ""}`}
              />
              {DOC_TYPES.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={doc === d}
                  onClick={() => setDoc(d)}
                  className={`relative w-[120px] cursor-pointer px-4 py-[10px] text-[16px] font-medium transition-colors ${doc === d ? "text-primary" : "text-black"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className={column}>
            <p className={label}>Destination Country</p>
            <SelectField
              value={country}
              options={COUNTRIES}
              onChange={setCountry}
              icon="caret-down"
              iconSize={24}
              iconClass="text-nav"
              className="max-w-[460px] pr-3 pl-6 text-nav"
            />
          </div>
          <div className={column}>
            <p className={label}>Weight (in kgs)</p>
            <label className="flex h-[50px] w-[200px] items-center gap-2 rounded-[16px] border border-stroke2 bg-bg5 pr-3 pl-6 text-[16px] font-medium text-nav">
              <input
                inputMode="decimal"
                aria-label="Weight (in kgs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={() => setWeight(kg.toFixed(3))}
                className="w-full min-w-0 bg-transparent outline-none"
              />
              <span className="opacity-80">Kg</span>
            </label>
          </div>
          {/* No prototype action, and the mock tariffs can't be derived from the inputs. */}
          <button type="button" className="h-[49px] shrink-0 cursor-pointer rounded-[16px] bg-button px-[18px] text-[16px] font-medium whitespace-nowrap text-white">
            Calculate Rates
          </button>
        </div>
        <p className="text-[12px] text-black opacity-50">Rate Calculator Supports Shipments Up To {MAX_KG} kg</p>
      </section>

      <Card title="Courier Rate Comparison" note={FSC_NOTE} action={<ToolButton label="Download" icon="download" />}>
        <Table cols={RATE_COLS} head={RATE_HEAD} rows={RATE_ROWS} total={RATE_TOTAL} />
      </Card>

      <div className="flex flex-col gap-[18px] min-[1400px]:flex-row">
        <Card title="Calculation Breakdown" note={FSC_NOTE} className="flex-1">
          <Table cols={BREAKDOWN_COLS} head={BREAKDOWN_HEAD} rows={BREAKDOWN_ROWS} total={BREAKDOWN_TOTAL} />
        </Card>
        <Card
          title="Reference Information"
          className="flex-1"
          noteCls="py-[21px] text-[14px]"
          note="Rates are illustrative andbased on the latest available rate chart entry. please update FDC using the international departments current rate"
        >
          <div className="flex flex-col gap-[10px] rounded-[22px] bg-[rgb(71_215_251/0.16)] px-4 text-black">
            {[
              ["Rate Details", "DHL"],
              ["Document Type", doc],
              ["Destination Country", country],
              ["Weight (kg)", `${kg} kg`],
              ["Rate Chart Reference", RATE_CHART_REF],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`flex flex-col gap-1 border-stroke2 py-5 *:opacity-80 not-last:border-b sm:flex-row sm:items-center sm:gap-16 ${
                  i === 0 ? "text-[18px] font-semibold tracking-[-0.72px]" : "text-[16px] font-medium tracking-[-0.64px]"
                }`}
              >
                <p className="sm:shrink sm:basis-[300px]">{k}</p>
                <p className="min-w-0 whitespace-pre-wrap sm:flex-[1_1_455px]">{v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Calculations" note={FSC_NOTE} action={<div className="h-12" />}>
        <Table
          cols={RECENT_COLS}
          head={RECENT_HEAD}
          rows={recent.map((r) => [
            r.date, r.doc, r.country, r.weight, r.rates, r.tariff,
            <button
              key="more"
              type="button"
              aria-label="More actions"
              onClick={(e) => {
                moreRef.current = e.currentTarget;
                setMenuId(r.id);
              }}
              className="mx-auto flex cursor-pointer text-nav"
            >
              <Icon name="more" />
            </button>,
          ])}
        />
      </Card>

      {/* ⋮ → Edit/Delete menu 1:8158: MANUAL overlay at (-131.39, 24.6) from the icon, 25% backdrop */}
      <Popover anchor={moreRef} open={menuId !== null} onClose={() => setMenuId(null)} dx={-131.39} dy={24.6}>
        <div className="flex w-[156px] flex-col overflow-hidden rounded-[16px] border border-stroke2 bg-bg5 text-[16px] tracking-[-0.64px] text-nav">
          <button
            type="button"
            onClick={() => {
              setDraft(recent.find((r) => r.id === menuId) ?? null);
              setMenuId(null);
            }}
            className="flex cursor-pointer items-center gap-[25px] border-b border-stroke2 px-4 py-3"
          >
            <Icon name="edit" size={22} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setRecent((rs) => rs.filter((r) => r.id !== menuId));
              setMenuId(null);
            }}
            className="flex cursor-pointer items-center gap-[25px] px-4 py-3"
          >
            <Icon name="delete" size={22} />
            Delete
          </button>
        </div>
      </Popover>

      {/* Edit overlay 1:8122: CENTER, 50% backdrop, closes on click outside / Esc, opens instantly */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={() => setDraft(null)}>
          <div
            role="dialog"
            aria-modal
            aria-label="Edit"
            onMouseDown={(e) => e.stopPropagation()}
            className="flex max-h-[calc(100dvh-32px)] w-[966px] max-w-full flex-col items-end gap-6 overflow-y-auto rounded-[24px] border border-[#1e2834] bg-primary p-5 font-inter font-medium sm:p-8"
          >
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-start justify-between border-b border-stroke2 pb-8">
                <h2 className="text-[30px] leading-9 text-black">Edit</h2>
                {/* Figma's close glyph is white (1:8128) */}
                <button type="button" aria-label="Close" onClick={() => setDraft(null)} className="cursor-pointer text-white">
                  <Icon name="close" />
                </button>
              </div>
              <div className="grid gap-x-2 gap-y-4 sm:grid-cols-2">
                <EditField label="Date & Time">
                  <input value={draft.date} onChange={(e) => set("date")(e.target.value)} placeholder="eg,26 jul 2026, 10:34 pm" className={editInput} />
                </EditField>
                <EditField label="Country">
                  <input value={draft.country} onChange={(e) => set("country")(e.target.value)} className={editInput} />
                </EditField>
              </div>
              <div className="grid items-center gap-x-2 gap-y-4 sm:grid-cols-3">
                <EditField label="Document Type">
                  <SelectField
                    value={draft.doc}
                    options={DOC_TYPES}
                    onChange={set("doc")}
                    iconClass="m-[3px] rotate-90 text-nav"
                    className="pr-6 pl-6 text-nav"
                  />
                </EditField>
                <EditField label="Weight">
                  <input value={draft.weight} onChange={(e) => set("weight")(e.target.value)} placeholder="000 kg" inputMode="decimal" className={editInput} />
                </EditField>
                <EditField label="Rate">
                  <input value={draft.rates} onChange={(e) => set("rates")(e.target.value)} placeholder="eg,26 jul 2026, 10:34 pm" className={editInput} />
                </EditField>
              </div>
              <EditField label="Tariff">
                <input value={draft.tariff} onChange={(e) => set("tariff")(e.target.value)} placeholder="eg., ORD-20260..." className={editInput} />
              </EditField>
            </div>
            <div className="flex gap-[6px] text-[18px]">
              <button type="button" onClick={() => setDraft(null)} className="h-[41px] cursor-pointer rounded-[16px] border border-[#00bdd7] bg-white px-[17px] text-[#0f141a]">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecent((rs) => rs.map((r) => (r.id === draft.id ? draft : r)));
                  setDraft(null);
                }}
                className="h-[41px] cursor-pointer rounded-[16px] bg-button px-[18px] text-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
