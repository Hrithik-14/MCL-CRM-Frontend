"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge, IconButton, Modal, PageHeader, Pagination, Popover, PrimaryButton, SearchBox, ToolButton } from "@/components/ui";
import { HistoryItem } from "@/components/followups/HistoryItem";
import { NewFollowUpForm } from "@/components/followups/NewFollowUpForm";
import { FOLLOW_UP_HISTORY, FOLLOW_UPS, type FollowUp } from "@/lib/mock/followups";

const text = "shrink-0 text-[16px] font-medium text-black";

export default function FollowUpsPage() {
  const [rows, setRows] = useState(FOLLOW_UPS);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const anchor = useRef<HTMLElement | null>(null);
  const closeMenu = useCallback(() => setMenuFor(null), []);
  const closeModal = useCallback(() => setAdding(false), []);

  const q = query.trim().toLowerCase();
  const visible = q ? rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q)) : rows;

  const markCompleted = () => {
    const today = new Date().toLocaleDateString("en-US"); // M/D/YYYY like the mock data
    setRows((rs) => rs.map((r) => (r.id === menuFor && r.status !== "Completed" ? { ...r, status: "Completed", completed: today } : r)));
    closeMenu();
  };

  const add = (f: FollowUp) => {
    setRows((rs) => [...rs, f]);
    closeModal();
  };

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <PageHeader
        title="Follow - Up Centre"
        subtitle="00 Pending"
        action={<PrimaryButton onClick={() => setAdding(true)}>Add Follow - Up</PrimaryButton>}
      />

      <section className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5">
        <div className="flex flex-wrap items-center justify-end gap-2 pt-6 pb-5">
          <SearchBox value={query} onChange={setQuery} />
          {/* Report / Filter: no prototype action or overlay for this screen */}
          <ToolButton label="Report" icon="download" />
          <ToolButton label="Filter" icon="filter" />
        </div>

        <div className="overflow-x-auto">
          <div className="flex w-[1030px] flex-col gap-[10px]">
            <div className="flex items-start border-b border-stroke2 py-5 text-[16px] font-medium tracking-[-0.64px] text-nav *:shrink-0 *:opacity-80">
              <p className="w-[300px]">Note</p>
              <p className="w-[150px]">Type</p>
              <p className="w-[140px]">Assigned To</p>
              <p className="w-[120px]">Status</p>
              <p className="w-[120px] text-center">Due Date</p>
              <p className="w-[120px] text-center whitespace-break-spaces">{"Completed \nDate" /* Figma's trailing space shifts the centring */}</p>
              <p className="w-20 text-center">Actions</p>
            </div>

            {visible.map((f) => (
              <div key={f.id} className="flex items-center border-b border-stroke2 pt-[10px] pb-4">
                <div className="flex w-[300px] shrink-0 flex-col gap-1 font-medium">
                  <p className="text-[16px] tracking-[-0.64px] text-black">{f.note}</p>
                  <p className="text-[14px] tracking-[-0.56px] text-button">{f.contact}</p>
                </div>
                <p className={`${text} w-[150px] tracking-[-0.64px]`}>{f.type}</p>
                <p className={`${text} w-[140px] tracking-[-0.64px]`}>{f.assigned}</p>
                <div className="flex w-[120px] shrink-0">
                  <Badge label={f.status} width={96} />
                </div>
                <p className={`${text} w-[120px] text-center tracking-[-0.64px]`}>{f.due}</p>
                <p className={`${text} w-[120px] text-center`}>{f.completed}</p>
                <div className="flex w-20 shrink-0 justify-center">
                  {/* Figma: ON_CLICK → "Mark As Completed" (1:7999), MANUAL overlay at (0,0) of this button, no backdrop */}
                  <span
                    className="inline-flex"
                    onClick={(e) => {
                      anchor.current = e.currentTarget;
                      setMenuFor(f.id);
                    }}
                  >
                    <IconButton icon="more" label="Follow up actions" className="h-[38px]!" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination label="Showing 1 to 6 of 2,00 Leads" />
      </section>

      <section className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5">
        <h2 className="pt-12 pb-10 text-[28px] font-medium text-black">Previous Follow Up History</h2>
        {FOLLOW_UP_HISTORY.map((h) => (
          <HistoryItem key={h.id} name={h.name} entries={h.entries} />
        ))}
        <Pagination label="Showing 1 to 6 of 2,00 Leads" />
      </section>

      <Popover anchor={anchor} open={menuFor !== null} onClose={closeMenu} backdrop={false}>
        <button
          type="button"
          onClick={markCompleted}
          className="flex cursor-pointer items-center gap-[6px] rounded-[8px] border-b-[0.5px] border-stroke2 bg-bg5 px-4 py-[10px] text-[16px] tracking-[-0.32px] whitespace-nowrap text-nav"
        >
          <Icon name="mark" />
          Mark As Completed
        </button>
      </Popover>

      {/* Figma: "Add Follow - Up" ON_CLICK → New Follow Up (1:8040), TOP_CENTER, 50% backdrop, instant.
          This frame includes its stroke in layout (900px content in 966) → p-32 + 1px border. */}
      <Modal open={adding} onClose={closeModal} title="New Follow Up" className="w-[966px]" top>
        <NewFollowUpForm onCancel={closeModal} onSave={add} />
      </Modal>
    </div>
  );
}
