"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Field, ModalActions, SelectField, TextArea, TextInput } from "@/components/ui";
import { FOLLOW_UP_TYPE_OPTIONS, LEAD_CONTACT_OPTIONS, type FollowUp } from "@/lib/mock/followups";

// "2026-10-13" → "10/13/2026" (same M/D/YYYY format as the table)
const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${+m}/${+d}/${y}`;
};

// Figma 1:8057 look ("00/00/0000" + calendar icon); clicking opens the native date picker.
function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => ref.current?.showPicker()}
        className="flex min-h-[46px] w-full cursor-pointer items-center gap-[10px] rounded-[16px] border border-stroke2 bg-bg5 py-3 pr-[11px] pl-[23px] text-left text-[16px] font-medium text-black"
      >
        <span className={`flex-1 ${value ? "" : "opacity-50"}`}>{value ? fmt(value) : "00/00/0000"}</span>
        <Icon name="calendar" size={18} className="text-nav" />
      </button>
      <input
        ref={ref}
        type="date"
        tabIndex={-1}
        aria-hidden
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full opacity-0"
      />
    </div>
  );
}

// Figma 1:8040 "New Follow Up" form body (header + X come from <Modal>).
export function NewFollowUpForm({ onCancel, onSave }: { onCancel: () => void; onSave: (f: FollowUp) => void }) {
  const form = useRef<HTMLFormElement>(null);
  const [lead, setLead] = useState("");
  const [date, setDate] = useState("");
  const [next, setNext] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("");
  const [assigned, setAssigned] = useState("");

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: Date.now(),
          note: note.trim(),
          contact: lead,
          type: type || "WhatsApp",
          assigned: assigned.trim() || "------",
          status: "Pending",
          due: date ? fmt(date) : "------",
          completed: "------",
        });
      }}
      className="-mt-2 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* Figma selects: pl-24 pr-12 (inside stroke) */}
        <Field label="Lead / Contact">
          <SelectField value={lead} options={LEAD_CONTACT_OPTIONS} onChange={setLead} placeholder="awesrdtfg" className="pr-[11px]" />
        </Field>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
          <Field label="Follow Up Date">
            <DateField value={date} onChange={setDate} />
          </Field>
          <Field label="Next Follow Up Date">
            <DateField value={next} onChange={setNext} />
          </Field>
        </div>
        <Field label="Subject/ Note">
          <TextArea required placeholder="Follow Up On Proposal" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
          <Field label="Follow Up Type">
            <SelectField value={type} options={FOLLOW_UP_TYPE_OPTIONS} onChange={setType} placeholder="WhatsApp" className="pr-[11px]" />
          </Field>
          <Field label="Assigned To">
            <TextInput placeholder="eg, Karthik" value={assigned} onChange={(e) => setAssigned(e.target.value)} />
          </Field>
        </div>
      </div>
      <ModalActions onCancel={onCancel} onDone={() => form.current?.requestSubmit()} doneLabel="Save Follow Up" />
    </form>
  );
}
