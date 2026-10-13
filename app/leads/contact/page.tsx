"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Badge } from "@/components/ui";
import { AssignModal, EditLeadModal, money, ReminderModal } from "@/components/leads/LeadModals";
import { CONTACT, CONTACT_ACTIVITY } from "@/lib/mock/leads";

const card = "flex min-w-0 flex-col gap-8 rounded-[16px] border border-stroke2 bg-primary px-5 py-8";
const title = "text-[24px] font-medium text-black sm:text-[28px]";
const btn = "flex shrink-0 items-center gap-2 rounded-[18px] border border-stroke2 bg-primary px-[17px] py-[13px] text-[16px] font-medium whitespace-nowrap text-nav";

function Info({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 font-medium ${className}`}>
      <p className="text-[16px] tracking-[-0.64px] text-nav opacity-80">{label}</p>
      <p className="text-[20px] tracking-[-0.8px] text-black">{children}</p>
    </div>
  );
}

function ContactItem({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <Icon name={icon} className="text-nav" />
      <Info label={label} className="flex-1 xl:max-w-[300px]">
        {children}
      </Info>
    </div>
  );
}

// Leads- Contact (Figma 1:6884) — a single lead, as in the design.
export default function LeadContactPage() {
  const [c, setC] = useState(CONTACT);
  const [modal, setModal] = useState<"reminder" | "assign" | "edit" | null>(null);
  const close = () => setModal(null);

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/leads/pipeline" aria-label="Back to pipeline" className="flex size-[50px] items-center justify-center rounded-full border border-stroke2 bg-primary text-black">
          <Icon name="arrow-right" size={28} className="rotate-180" />
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={() => setModal("reminder")} className={`${btn} cursor-pointer`}>
            Reminder <Icon name="reminder" size={18} />
          </button>
          {/* Disqualify: no prototype action in Figma */}
          <div className={btn}>
            Disqualify <Icon name="warning" size={18} />
          </div>
          <button type="button" onClick={() => setModal("assign")} className={`${btn} cursor-pointer`}>
            Assign <Icon name="assign" size={18} />
          </button>
          <button type="button" onClick={() => setModal("edit")} className={`${btn} cursor-pointer`}>
            Edit <Icon name="edit" size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[18px] xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
          <section className={card}>
            <div className="flex items-center justify-between gap-3 border-b border-stroke2 pb-5">
              <h1 className={title}>{c.title}</h1>
              <Badge label={c.status} width={88} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-3 sm:gap-0">
                <Info label="Source">{c.source}</Info>
                <Info label="Owner">{c.owner}</Info>
                <Info label="Stage">{c.stage}</Info>
              </div>
              <div className="grid gap-6 sm:grid-cols-3 sm:gap-0">
                <Info label="Priority">{c.priority}</Info>
                <Info label="Value">{c.value}</Info>
                <Info label="District">{c.district}</Info>
              </div>
              <div className="grid gap-6 border-b border-stroke2 pb-5 sm:grid-cols-3 sm:gap-0">
                <Info label="Created Date">{c.created}</Info>
                <Info label="Last Update" className="sm:col-start-3">
                  {c.updated}
                </Info>
              </div>
            </div>
            <Info label="Description">{c.description}</Info>
          </section>

          <section className={card}>
            <div className="flex items-center gap-[14px] border-b border-stroke2 pb-5">
              <Icon name="activity" size={26} className="text-nav" />
              <h2 className={title}>Activity</h2>
            </div>
            <ul className="flex flex-col gap-6">
              {CONTACT_ACTIVITY.map((a) => (
                <li key={a.id} className="flex flex-col gap-1">
                  <p className="flex items-start gap-2 text-[18px] font-medium tracking-[-0.72px] text-black">
                    <span className="mt-[6px] size-[10px] shrink-0 rounded-full bg-button" />
                    {a.text}
                  </p>
                  <p className="pl-5 text-[14px] tracking-[-0.56px] text-nav opacity-70">{a.at}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={`${card} xl:w-[382px] xl:shrink-0`}>
          <h2 className={`${title} border-b border-stroke2 pb-5`}>Contact Information</h2>
          <div className="flex flex-col gap-6">
            <ContactItem icon="user-square" label="Contact Name">
              {c.customer}
            </ContactItem>
            <ContactItem icon="call" label="Phone Number">
              {c.phone}
            </ContactItem>
            <ContactItem icon="mail" label="EMail">
              {c.email}
            </ContactItem>
            <ContactItem icon="location" label="Address">
              {c.address}
            </ContactItem>
          </div>
        </section>
      </div>

      <ReminderModal open={modal === "reminder"} onClose={close} />
      <AssignModal open={modal === "assign"} onClose={close} onAssign={(owner) => setC((p) => ({ ...p, owner }))} />
      <EditLeadModal
        open={modal === "edit"}
        onClose={close}
        onSave={(f) => setC((p) => ({ ...p, ...f, value: f.value ? money(f.value) : p.value }))}
      />
    </div>
  );
}
