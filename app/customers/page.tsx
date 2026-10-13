"use client";

import { useState } from "react";
import { Badge, IconButton, PageHeader, Pagination, SearchBox, ToolButton } from "@/components/ui";
import { CUSTOMERS } from "@/lib/mock/customers";

// Figma 1:6831 header row: [label, width]. Total 1786 = table min-width.
const COLS = [
  ["Customer Name", 220], ["Company", 160], ["Phn Number", 140], ["EMail", 160], ["Address", 220],
  ["Customer\nType", 120], ["Source", 120], ["Assigned User", 120], ["Status", 100], ["Created\nDate", 100], ["Note", 180],
] as const;

const cell = "shrink-0 text-[16px] font-medium text-black";

export default function CustomersPage() {
  const [rows, setRows] = useState(CUSTOMERS);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q)) : rows;

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <PageHeader title="Customers Management" subtitle="00 Active Customer Accounts" />

      {/* Figma lays children out at x=21 (stroke included in layout) → px-20 + 1px border */}
      <section className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-5">
          <h2 className="text-[28px] font-medium text-black">Customers</h2>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <SearchBox value={query} onChange={setQuery} />
            {/* Report / Filter: no prototype action or overlay for this screen */}
            <ToolButton label="Report" icon="download" />
            <ToolButton label="Filter" icon="filter" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-[1786px] flex-col gap-[10px]">
            <div className="flex items-start border-b border-stroke2 py-5 text-[16px] font-medium tracking-[-0.64px] text-nav">
              {COLS.map(([label, w]) => (
                <p key={label} className="shrink-0 whitespace-pre-line opacity-80" style={{ width: w }}>
                  {label}
                </p>
              ))}
              <p className="w-[146px] shrink-0 text-center opacity-80">Actions</p>
            </div>

            {visible.map((c) => (
              <div key={c.id} className="flex items-start border-b border-stroke2 pt-[10px] pb-4">
                <p className={`${cell} w-[220px] tracking-[-0.64px]`}>{c.name}</p>
                <p className={`${cell} w-[160px] tracking-[-0.64px]`}>{c.company}</p>
                <p className={`${cell} w-[140px] tracking-[-0.64px]`}>{c.phone}</p>
                <p className={`${cell} w-[160px] tracking-[-0.64px]`}>{c.email}</p>
                <p className={`${cell} w-[220px] tracking-[-0.64px]`}>{c.address}</p>
                <p className={`${cell} w-[120px]`}>{c.type}</p>
                <p className={`${cell} w-[120px] tracking-[-0.64px]`}>{c.source}</p>
                <p className={`${cell} w-[120px] tracking-[-0.64px]`}>{c.assigned}</p>
                <div className="w-[100px] shrink-0">
                  <Badge label={c.status} width={80} />
                </div>
                <p className={`${cell} w-[100px]`}>{c.created}</p>
                <p className={`${cell} w-[180px] tracking-[-0.64px]`}>{c.note}</p>
                <div className="flex w-[146px] shrink-0 items-center justify-center gap-1">
                  {/* Edit / download have no designed target in Figma. Figma: these two are 46×38, delete 46×36 */}
                  <IconButton icon="edit" label="Edit customer" className="h-[38px]!" />
                  <IconButton icon="download" label="Download customer" className="h-[38px]!" />
                  <IconButton icon="delete" label="Delete customer" onClick={() => setRows((rs) => rs.filter((r) => r.id !== c.id))} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination label="Showing 1 to 6 of 2,00 Customers" />
      </section>
    </div>
  );
}
