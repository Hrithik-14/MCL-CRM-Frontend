"use client";

import { useState } from "react";
import { Badge, IconButton, Pagination } from "@/components/ui";
import { applyFields, EditLeadModal } from "@/components/leads/LeadModals";
import { LeadTools, useLeads } from "@/components/leads/LeadsView";

// Leads- Table (Figma 1:6132): column widths 400/100/100/90/120/120/100/80/120 = 1230
const cell = "shrink-0 text-[16px] font-medium tracking-[-0.64px] text-black";

export default function LeadsTablePage() {
  const { rows, setRows, show } = useLeads();
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <section className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 pt-6 pb-5">
        <h2 className="text-[28px] font-medium text-black sm:w-[355px]">Leads</h2>
        <LeadTools />
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[1230px] flex-col gap-[10px]">
          <div className="flex items-center border-b border-stroke2 py-5 text-[16px] font-medium tracking-[-0.64px] text-nav *:shrink-0 *:opacity-80">
            <p className="min-w-[400px] flex-1">Tittle</p>
            <p className="w-[100px]">Source</p>
            <p className="w-[100px]">Stage</p>
            <p className="w-[90px]">Priority</p>
            <p className="w-[120px]">Value</p>
            <p className="w-[120px]">Payment</p>
            <p className="w-[100px]">Owner</p>
            <p className="w-20">Created Date</p>
            <p className="w-[120px] text-center">Actions</p>
          </div>

          {rows.filter(show).map((r) => (
            <div key={r.id} className="flex items-center border-b border-stroke2 pt-[10px] pb-4">
              <p className={`${cell} min-w-[400px] flex-1`}>{r.title}</p>
              <p className={`${cell} w-[100px]`}>{r.source}</p>
              <div className="w-[100px] shrink-0">
                <Badge label={r.stage} width={88} />
              </div>
              <div className="w-[90px] shrink-0">
                <Badge label={r.priority} width={76} />
              </div>
              <p className={`${cell} w-[120px]`}>{r.value}</p>
              <div className="w-[120px] shrink-0">
                <Badge label={r.payment} width={96} />
              </div>
              <p className={`${cell} w-[100px]`}>{r.owner}</p>
              <p className="w-20 shrink-0 text-[16px] font-medium text-black">{r.created}</p>
              <div className="flex w-[120px] shrink-0 items-center justify-center gap-1">
                {/* Edit: inferred → Edit Lead overlay (1:7595); Delete: removes the row locally */}
                <IconButton icon="edit" label="Edit lead" onClick={() => setEditing(r.id)} className="h-[38px]!" />
                <IconButton icon="delete" label="Delete lead" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination label="Showing 1 to 6 of 2,00 Leads" />

      <EditLeadModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(f) => setRows((rs) => rs.map((r) => (r.id === editing ? applyFields(r, f) : r)))}
      />
    </section>
  );
}
