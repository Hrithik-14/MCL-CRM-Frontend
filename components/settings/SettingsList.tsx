"use client";

import { useState } from "react";
import { Field, IconButton, Modal, ModalActions, PrimaryButton, TextInput } from "@/components/ui";
import { SectionHeader, UnderlineTabs } from "@/components/users/SectionHeader";

const TABS = [
  { label: "Lead Sources", href: "/settings", cls: "px-[30px]" },
  { label: "Lead Status", href: "/settings/lead-status", cls: "px-[30px]" },
];

// Figma 1:6650 (Lead Sources) / 1:6678 (Lead Status). "+ Add" → Add New Source 1:7711 / Add New Lead Status 1:7731.
export function SettingsList({ tab, initial, modalTitle, fieldLabel }: { tab: number; initial: string[]; modalTitle: string; fieldLabel: string }) {
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const close = () => setAdding(false);
  const done = () => {
    if (name.trim()) setItems((xs) => [...xs, name.trim()]);
    close();
  };

  return (
    <div className="flex flex-col items-end gap-[18px] p-4 sm:p-6">
      <div className="flex w-full flex-col gap-[18px]">
        <SectionHeader title="Settings" subtitle="Configure Your CRM Workspace" />
        <UnderlineTabs tabs={TABS} active={tab} />
      </div>

      {/* Figma lays rows out at x=21 (stroke included in layout) → px-20 + 1px border */}
      <ul className="flex w-full flex-col gap-[10px] rounded-[22px] border border-stroke2 bg-primary px-5">
        {items.map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-center justify-between gap-4 border-b border-stroke2 py-5 last:border-b-0">
            <span className="size-[10px] shrink-0 rounded-full bg-nav/50" />
            <p className="min-w-0 max-w-[860px] flex-1 text-[20px] font-medium tracking-[-0.8px] text-nav">{item}</p>
            {/* Trash: no prototype action → removes the item locally */}
            <IconButton icon="delete" label={`Delete ${item}`} onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ul>

      <PrimaryButton
        onClick={() => {
          setName("");
          setAdding(true);
        }}
      >
        Add
      </PrimaryButton>

      <Modal open={adding} onClose={close} title={modalTitle} className="w-[700px] gap-4!">
        <Field label={fieldLabel}>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && done()} autoFocus />
        </Field>
        <div className="pt-2">
          <ModalActions onCancel={close} onDone={done} />
        </div>
      </Modal>
    </div>
  );
}
