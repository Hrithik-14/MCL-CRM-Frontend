"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui";
import type { FOLLOW_UP_HISTORY } from "@/lib/mock/followups";

type Entry = (typeof FOLLOW_UP_HISTORY)[number]["entries"][number];

// Figma component set 1:8003: Variant2 (collapsed) ⇄ Default (expanded), ON_CLICK, Smart Animate 300ms ease-out.
export function HistoryItem({ name, entries }: { name: string; entries: Entry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen((o) => !o)} className="w-full cursor-pointer rounded-[24px] border border-stroke2 bg-bg5 px-4 py-[10px]">
      <button type="button" aria-expanded={open} className="flex w-full cursor-pointer items-center justify-between gap-4 py-[10px] text-left">
        <span className="flex items-center gap-[15px] text-[16px] font-medium tracking-[-0.64px] text-black">
          <Icon name="arrow-right" size={18} className={`text-nav transition-transform ${open ? "-rotate-90" : ""}`} />
          {name}
        </span>
        {/* Completed pill colours (variant 1:7995) with a count label */}
        <span className="rounded-[19px] border border-[rgb(48_175_80/.5)] bg-[rgb(101_238_136/.3)] px-[7px] py-[3px] text-[14px] whitespace-nowrap text-[#30a74e]">
          {entries.length} Completed
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="mt-[6px] overflow-x-auto border-t border-stroke2">
            <div className="min-w-[996px]" /* Figma inner width; scrolls sideways on narrow screens */>
              <div className="flex items-center gap-4 border-b border-stroke2 py-[6px] text-[16px] font-medium tracking-[-0.64px] text-nav *:opacity-80">
                <p className="min-w-px flex-1">Note</p>
                <p className="w-[150px] shrink-0">Type</p>
                <p className="w-[140px] shrink-0">Assigned To</p>
                <p className="w-[120px] shrink-0">Status</p>
                <p className="w-[120px] shrink-0 text-center">Due Date</p>
                <p className="w-[120px] shrink-0 text-center whitespace-break-spaces">{"Completed \nDate" /* Figma's trailing space shifts the centring */}</p>
              </div>
              {entries.map((e, i) => (
                <div key={i} className="flex items-center gap-4 pt-[10px] pb-4 text-[16px] font-medium text-black">
                  <div className="flex min-w-px flex-1 flex-col gap-1">
                    <p className="tracking-[-0.64px]">{e.note}</p>
                    <p className="text-[14px] tracking-[-0.56px] text-button">{e.contact}</p>
                  </div>
                  <p className="w-[150px] shrink-0 tracking-[-0.64px]">{e.type}</p>
                  <p className="w-[140px] shrink-0 tracking-[-0.64px]">{e.assigned}</p>
                  <div className="flex w-[120px] shrink-0">
                    <Badge label={e.status} width={96} />
                  </div>
                  <p className="w-[120px] shrink-0 text-center tracking-[-0.64px]">{e.due}</p>
                  <p className="w-[120px] shrink-0 text-center">{e.completed}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
