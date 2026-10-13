"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { Icon } from "@/components/Icon";
import { Badge, IconButton } from "@/components/ui";
import { applyFields, EditLeadModal } from "@/components/leads/LeadModals";
import { useLeads } from "@/components/leads/LeadsView";
import { STAGE_OPTIONS, STAGE_TOTALS } from "@/lib/mock/leads";

const action = "flex items-center rounded-[16px] border-[0.5px] border-stroke2 bg-primary px-2 py-[6px] text-[10px] font-medium tracking-[-0.4px] text-black";
const label = "w-[39px] text-center";

// Leads- Pipeline (Figma 1:6990). Columns are 306px; the board scrolls sideways like the frame crops it.
export default function LeadsPipelinePage() {
  const { cards, setCards, show } = useLeads();
  const [editing, setEditing] = useState<number | null>(null);
  const router = useRouter();

  // Card ON_CLICK → Leads- Contact (clicks on the card's own buttons/links are theirs).
  const open = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest("button, a")) router.push("/leads/contact");
  };

  return (
    <>
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <div className="flex w-max items-start gap-3">
          {STAGE_OPTIONS.map((stage) => {
            const list = cards.filter((c) => c.stage === stage && show(c));
            return (
              <section key={stage} className="flex w-[306px] shrink-0 flex-col gap-[19px] rounded-[16px] border border-[#6e85e5] bg-primary p-4">
                <header className="flex flex-col gap-2 border-b border-stroke2 pb-3">
                  <div className="flex w-[266px] items-center justify-between">
                    <h2 className="flex items-center gap-3 text-[16px] font-medium tracking-[-0.64px] text-black">
                      <span className="size-[10px] rounded-full bg-button" />
                      {stage}
                    </h2>
                    <span className="flex size-5 items-center justify-center rounded-[10px] bg-stroke text-[10px] leading-none font-medium tracking-[-0.4px] text-black">
                      {list.length}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium tracking-[-0.48px] text-nav opacity-70">{STAGE_TOTALS[stage]}</p>
                </header>

                <div className="flex flex-col gap-3">
                  {list.map((c) => (
                    // Card set 1:7329: Variant2 (rest) → Default (hover) via Smart Animate 300ms ease-out
                    <article
                      key={c.id}
                      onClick={open}
                      className="group flex cursor-pointer flex-col rounded-[16px] border border-stroke2 bg-[#9ce8fb] p-5"
                    >
                      <div className="flex flex-col gap-[22px]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-medium tracking-[-0.64px] text-black">{c.title}</h3>
                          <IconButton icon="delete" label="Delete lead" onClick={() => setCards((cs) => cs.filter((x) => x.id !== c.id))} />
                        </div>
                        <div className="flex flex-col gap-[18px] text-[16px] text-black">
                          <Badge label={c.priority} width={76} />
                          <p className="font-medium tracking-[-0.64px]">{c.value}</p>
                          <div className="flex items-center gap-[43px]">
                            <p className="w-[100px] tracking-[-0.64px]">{c.source}</p>
                            <p className="w-20">{c.created}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                        <div className="overflow-hidden">
                          <div className="mt-[22px] flex items-center justify-between border-t border-stroke pt-3">
                            <Link href="/leads/contact" className={action}>
                              <Icon name="eye" size={18} className="text-nav" />
                              <span className={label}>View</span>
                            </Link>
                            <button type="button" onClick={() => setEditing(c.id)} className={`${action} cursor-pointer`}>
                              <Icon name="edit" size={18} className="text-nav" />
                              <span className={label}>Edit</span>
                            </button>
                            {/* Win: no prototype action in Figma */}
                            <button type="button" disabled className={action}>
                              <Icon name="arrow-right" size={18} className="text-nav" />
                              <span className={label}>Win</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <EditLeadModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(f) => setCards((cs) => cs.map((c) => (c.id === editing ? applyFields(c, f) : c)))}
      />
    </>
  );
}
