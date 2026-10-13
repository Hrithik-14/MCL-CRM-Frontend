"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { Field, Modal, ModalActions, Popover, TextArea, TextInput } from "@/components/ui";
import { PRIORITY_OPTIONS, STAGE_OPTIONS, type Lead } from "@/lib/mock/leads";

// Non-empty form values, keyed by input name.
export type LeadFields = Partial<Record<string, string>>;

// "500000" → "₹5,00,000" (Indian grouping, as in the design)
export const money = (v: string) => {
  const digits = v.replace(/\D/g, "");
  return digits ? `₹${Number(digits).toLocaleString("en-IN")}` : v;
};

const pick = <T extends string>(v: string | undefined, options: readonly T[]) =>
  options.find((o) => o.toLowerCase() === v?.trim().toLowerCase());

// Apply Create/Edit form values to a table row / pipeline card (empty fields keep the old value).
export function applyFields(lead: Lead, f: LeadFields): Lead {
  return {
    ...lead,
    title: f.title ?? lead.title,
    source: f.source ?? lead.source,
    owner: f.owner ?? lead.owner,
    created: f.created ?? lead.created,
    value: f.value ? money(f.value) : lead.value,
    stage: pick(f.stage, STAGE_OPTIONS) ?? lead.stage,
    priority: pick(f.priority, PRIORITY_OPTIONS) ?? lead.priority,
  };
}

const formValues = (e: FormEvent<HTMLFormElement>): LeadFields => {
  e.preventDefault();
  return Object.fromEntries(
    [...new FormData(e.currentTarget)].flatMap(([k, v]) => (typeof v === "string" && v.trim() ? [[k, v.trim()]] : [])),
  );
};

// Figma Create/Edit Lead frames are 966×635 viewports whose content scrolls inside.
const BIG = "w-[966px] max-h-[min(635px,calc(100dvh-32px))]!";

const Row = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">{children}</div>;

const Input = ({ label, name, placeholder, type }: { label: string; name: string; placeholder?: string; type?: string }) => (
  <Field label={label}>
    <TextInput name={name} placeholder={placeholder} type={type} />
  </Field>
);

const selectCls =
  "flex min-h-[46px] w-full cursor-pointer items-center gap-[10px] rounded-[16px] border border-stroke2 bg-bg5 py-3 pr-[11px] pl-[23px] text-left text-[16px] font-medium text-black";

// Lead Tittle … Description (shared by Create 1:7358/1:7470 and Edit 1:7595)
function LeadFieldsBlock({ contactRow, children }: { contactRow: ReactNode; children?: ReactNode }) {
  return (
    <>
      <Field label="Lead Tittle">
        <TextInput name="title" placeholder="eg., Custom" required />
      </Field>
      {contactRow}
      {children}
      <Field label="Address">
        <TextArea name="address" placeholder="eg., Lorem Ipsum is simply dummy text of the printing and typesetting industry" />
      </Field>
      <Row>
        <Input label="Source" name="source" placeholder="eg, Meta Ads" />
        <Input label="Assigned User" name="owner" placeholder="eg, Karthik" />
      </Row>
      <Row>
        <Input label="Stage" name="stage" placeholder="eg., New" />
        <Input label="Priority" name="priority" placeholder="eg, Medium" />
      </Row>
      <Row>
        <Input label="Created Date" name="created" placeholder="eg., 00/00/0000" />
        <Input label="Expected Value" name="value" placeholder="eg, ₹00000000" />
      </Row>
      <Field label="Description">
        <TextArea name="description" placeholder="eg., Ipsum is simply dummy text of the printing " />
      </Field>
    </>
  );
}

/* ---------- Create Lead (1:7358 Direct / 1:7470 B2B) ---------- */
function CreateLeadForm({ onClose, onCreate }: { onClose: () => void; onCreate: (lead: Lead) => void }) {
  const form = useRef<HTMLFormElement>(null);
  const typeBtn = useRef<HTMLButtonElement>(null);
  const [type, setType] = useState<"Direct" | "B2B">("Direct");
  const [typeOpen, setTypeOpen] = useState(false);
  const [files, setFiles] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    const f = formValues(e);
    const base: Lead = {
      id: Date.now(),
      title: "",
      source: "------",
      stage: "New",
      priority: "Low",
      value: "₹0",
      payment: "Pending",
      owner: "------",
      created: new Date().toLocaleDateString("en-IN"), // D/M/YYYY like the mock data
    };
    onCreate(applyFields(base, f));
  };

  return (
    <form ref={form} onSubmit={submit} className="-mt-2 flex flex-col gap-6 pb-[30px]">
      <div className="flex flex-col gap-4">
        <LeadFieldsBlock
          contactRow={
            <>
              <Row>
                <Input label="Customer Name" name="customer" placeholder="eg, Praveen" />
                <Input label="Phn Number" name="phone" type="tel" placeholder="eg, 0000000000" />
              </Row>
              <Row>
                <Input label="EMail" name="email" type="email" placeholder="eg, asdfg@gmail.com" />
                <div className="flex w-full min-w-0 flex-col gap-[6px]">
                  <span className="text-[18px] font-medium text-black sm:text-[20px]">Customer Type</span>
                  <button ref={typeBtn} type="button" aria-haspopup="listbox" onClick={() => setTypeOpen(true)} className={selectCls}>
                    <span className="flex-1">{type}</span>
                    <Icon name="arrow-right" size={18} className="rotate-90 text-black" />
                  </button>
                  {/* Figma 1:7760 / 1:7765: MANUAL overlay at (313.2, 46.2) from the field, 25% backdrop */}
                  <Popover anchor={typeBtn} open={typeOpen} onClose={() => setTypeOpen(false)} dx={313.2} dy={46.2}>
                    <ul role="listbox" aria-label="Customer Type" className="w-[133px] overflow-hidden rounded-[9px] bg-white">
                      {(type === "Direct" ? (["Direct", "B2B"] as const) : (["B2B", "Direct"] as const)).map((t) => (
                        <li key={t} className="flex h-10 border-stroke2 not-last:h-[40.5px] not-last:border-b-[0.5px]">
                          <button
                            type="button"
                            role="option"
                            aria-selected={t === type}
                            onClick={() => {
                              setType(t);
                              setTypeOpen(false);
                            }}
                            className="w-full cursor-pointer text-center text-[16px] tracking-[-0.32px] text-nav"
                          >
                            {t}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Popover>
                </div>
              </Row>
            </>
          }
        >
          {type === "B2B" && (
            <>
              <Input label="Company Name" name="company" placeholder="eg., Custom" />
              <Row>
                <Input label="Company Location" name="companyLocation" placeholder="eg, Karnataka" />
                <Input label="Company EMail" name="companyEmail" type="email" placeholder="eg, asdfg@gmail.com" />
              </Row>
            </>
          )}
        </LeadFieldsBlock>
      </div>

      <h3 className="border-b border-stroke2 pb-8 text-[22px] font-medium text-black sm:text-[28px]">Logistic - Specific Fields</h3>
      <Row>
        <Input label="Destination Country" name="destination" />
        <Input label="Commodity" name="commodity" />
      </Row>
      <Row>
        <Field label="Shipment Type">
          {/* No options or overlay in Figma for this select: shown as designed, inert. */}
          <div className={`${selectCls} cursor-default`}>
            <span className="flex-1 opacity-50">Air</span>
            <Icon name="arrow-right" size={18} className="rotate-90 text-black" />
          </div>
        </Field>
        <Input label="Weight" name="weight" />
        <Input label="Shipment Volume" name="volume" />
      </Row>
      <Row>
        <Input label="Pickup Location" name="pickup" />
        <Input label="Delivery Location" name="delivery" />
      </Row>
      <Field label="Attach Files">
        <span className="flex cursor-pointer flex-col items-center gap-[10px] rounded-[16px] border border-dashed border-nav/30 bg-bg5 px-6 py-8 text-center text-[16px] font-medium text-black">
          <span className="opacity-50">{files || "Attach Here"}</span>
          <Icon name="add-circle" className="text-nav opacity-50" />
          <input
            type="file"
            name="files"
            multiple
            className="sr-only"
            onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name).join(", "))}
          />
        </span>
      </Field>
      <ModalActions onCancel={onClose} onDone={() => form.current?.requestSubmit()} />
    </form>
  );
}

export function CreateLeadModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (lead: Lead) => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Create Lead" className={BIG}>
      <CreateLeadForm onClose={onClose} onCreate={onCreate} />
    </Modal>
  );
}

/* ---------- Edit Lead (1:7595) ---------- */
export function EditLeadModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (f: LeadFields) => void }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <Modal open={open} onClose={onClose} title="Edit Lead" className={BIG}>
      <form
        ref={form}
        onSubmit={(e) => {
          onSave(formValues(e));
          onClose();
        }}
        className="-mt-2 flex flex-col gap-6 pb-[30px]"
      >
        <div className="flex flex-col gap-4">
          <LeadFieldsBlock
            contactRow={
              <Row>
                <Input label="Customer Name" name="customer" placeholder="eg, Praveen" />
                <Input label="Phn Number" name="phone" type="tel" placeholder="eg, 0000000000" />
                <Input label="EMail" name="email" type="email" placeholder="eg, asdfg@gmail.com" />
              </Row>
            }
          />
        </div>
        <ModalActions onCancel={onClose} onDone={() => form.current?.requestSubmit()} />
      </form>
    </Modal>
  );
}

/* ---------- Schedule Follow Up Reminder (1:7664) / Assigned Lead To BDE (1:7691) ---------- */
function SmallForm({ title, open, onClose, onDone, children }: {
  title: string;
  open: boolean;
  onClose: () => void;
  onDone: (f: LeadFields) => void;
  children: ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form
        ref={form}
        onSubmit={(e) => {
          onDone(formValues(e));
          onClose();
        }}
        className="-mt-2 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">{children}</div>
        <ModalActions onCancel={onClose} onDone={() => form.current?.requestSubmit()} />
      </form>
    </Modal>
  );
}

// Done only closes: the Contact screen has no place in the design that lists reminders.
export function ReminderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <SmallForm title="Schedule Follow Up Reminder" open={open} onClose={onClose} onDone={() => {}}>
      <Input label="Tittle" name="title" placeholder="eg., Custom" />
      <Field label="Due date And Time">
        <TextInput name="due" type="datetime-local" required className="invalid:text-black/50" />
      </Field>
      <Field label="Notes">
        <TextArea name="notes" />
      </Field>
    </SmallForm>
  );
}

export function AssignModal({ open, onClose, onAssign }: { open: boolean; onClose: () => void; onAssign: (bde: string) => void }) {
  return (
    <SmallForm title="Assigned Lead To BDE" open={open} onClose={onClose} onDone={(f) => f.bde && onAssign(f.bde)}>
      <Input label="BDE" name="bde" />
    </SmallForm>
  );
}
