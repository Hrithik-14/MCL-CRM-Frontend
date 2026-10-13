"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Badge, IconButton, Modal, ModalActions, Pagination, Popover, PrimaryButton, SearchBox, SelectField, TextInput, ToolButton } from "@/components/ui";
import { ROLE_OPTIONS, UNLISTED_USERS, USERS, type User } from "@/lib/mock/users";
import { UField, USER_MODAL, WIDE_ACTIONS } from "./form";
import { SectionHeader, UnderlineTabs } from "./SectionHeader";

export const USER_TABS = [
  { label: "User", href: "/users", cls: "w-[100px] px-[10px]" },
  { label: "Role", href: "/users/roles", cls: "w-[90px] px-[10px]" },
];

// Figma 1:6530 column widths (sum 1150 = card content width); columns grow proportionally on wider screens.
const col = (w: number) => ({ flex: `${w} 0 0`, minWidth: w });
const HEAD: [string, number, string?][] = [
  ["Name", 200], ["Role", 100], ["EMail", 200], ["Status", 130], ["Assigned Leads", 160], ["Converted", 100],
  ["Created Date", 140, "text-center"], ["Actions", 120, "text-center"],
];
const cell = "text-[16px] font-medium text-black";

type Draft = Pick<User, "name" | "email" | "phone" | "role">;
const EMPTY: Draft = { name: "", email: "", phone: "", role: "" };
type Filter = { role?: string; status?: User["status"] };

export function UsersPage() {
  const [users, setUsers] = useState(USERS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [roleMenu, setRoleMenu] = useState(false);
  const filterRef = useRef<HTMLButtonElement>(null);
  // editing: null = closed, 0 = Create New User (1:7919), id = Edit User (1:7950)
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState(EMPTY);

  const q = query.trim().toLowerCase();
  const visible = users.filter(
    (u) =>
      (!q || [u.name, u.role, u.email].join(" ").toLowerCase().includes(q)) &&
      (!filter.role || u.role === filter.role) &&
      (!filter.status || u.status === filter.status),
  );
  const total = users.length + UNLISTED_USERS;

  const open = (u?: User) => {
    setDraft(u ? { name: u.name, email: u.email, phone: u.phone, role: u.role } : EMPTY);
    setEditing(u ? u.id : 0);
  };
  const close = () => setEditing(null);
  const save = () => {
    if (editing) setUsers((us) => us.map((u) => (u.id === editing ? { ...u, ...draft } : u)));
    else if (draft.name.trim())
      setUsers((us) => [...us, { ...draft, id: Math.max(0, ...us.map((u) => u.id)) + 1, role: draft.role || "Admin", status: "Active", assigned: 0, converted: 0, created: new Date().toLocaleDateString("en-US") }]);
    close();
  };
  const pick = (f: Filter) => {
    // Picking the active option again clears it.
    setFilter((cur) => (f.role ? { ...cur, role: cur.role === f.role ? undefined : f.role } : { ...cur, status: cur.status === f.status ? undefined : f.status }));
    setFilterOpen(false);
  };
  const set = (k: keyof Draft) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const option = "flex w-full cursor-pointer items-center justify-between border-b-[0.5px] border-stroke2 px-4 py-[10px] text-left text-[16px] tracking-[-0.32px] text-nav";

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      {/* Add User (1:6509) → OVERLAY Create New User 1:7919, instant */}
      <SectionHeader title="User Management" subtitle={`${total} Users`} action={<PrimaryButton onClick={() => open()}>Add User</PrimaryButton>} />
      <UnderlineTabs tabs={USER_TABS} active={0} />

      {/* Figma lays children out at x=21 (stroke included in layout) → px-20 + 1px border */}
      <section className="flex min-w-0 flex-col rounded-[22px] border border-stroke2 bg-primary px-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-[30px]">
          <h2 className="text-[28px] font-medium text-black">Users</h2>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <SearchBox value={query} onChange={setQuery} />
            <ToolButton label="Filter" icon="filter" btnRef={filterRef} onClick={() => setFilterOpen(true)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-[1150px] flex-col gap-[10px]">
            <div className="flex items-center border-b border-stroke2 py-5 text-[16px] font-medium tracking-[-0.64px] text-nav">
              {HEAD.map(([label, w, align]) => (
                <p key={label} className={`opacity-80 ${align ?? ""}`} style={col(w)}>
                  {label}
                </p>
              ))}
            </div>
            {visible.map((u) => (
              <div key={u.id} className="flex items-center border-b border-stroke2 pt-[10px] pb-4">
                <p className={`${cell} tracking-[-0.64px]`} style={col(200)}>{u.name}</p>
                <p className={`${cell} tracking-[-0.64px]`} style={col(100)}>{u.role}</p>
                <p className={`${cell} tracking-[-0.64px]`} style={col(200)}>{u.email}</p>
                <div style={col(130)}>
                  <Badge label={u.status} width={80} />
                </div>
                <p className={`${cell} text-center tracking-[-0.64px]`} style={col(160)}>{u.assigned}</p>
                <p className={`${cell} text-center tracking-[-0.64px]`} style={col(100)}>{u.converted}</p>
                <p className={`${cell} text-center`} style={col(140)}>{u.created}</p>
                <div className="flex items-center justify-center gap-1" style={col(120)}>
                  {/* Edit (1:6551) → OVERLAY Edit User 1:7950, instant. Figma: edit 46×38, delete 46×36 */}
                  <IconButton icon="edit" label={`Edit ${u.name}`} className="h-[38px]!" onClick={() => open(u)} />
                  {/* Delete: no prototype action → removes the row locally */}
                  <IconButton icon="delete" label={`Delete ${u.name}`} onClick={() => setUsers((us) => us.filter((x) => x.id !== u.id))} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-[10px]">
          <Pagination label={`Showing 1 to ${visible.length} of ${total} Users`} />
        </div>
      </section>

      {/* Filter → dropdown 1:7981 (MANUAL, 25% backdrop, close on outside click) */}
      <Popover anchor={filterRef} open={filterOpen} onClose={() => setFilterOpen(false)} dx={-38} dy={54}>
        <div className="w-[142px] overflow-hidden rounded-[9px] border border-stroke2 bg-primary">
          <button type="button" aria-expanded={roleMenu} onClick={() => setRoleMenu((o) => !o)} className={option}>
            Role
            <Icon name="arrow-right" size={18} className={`text-nav transition-transform ${roleMenu ? "-rotate-90" : "rotate-90"}`} />
          </button>
          {roleMenu &&
            ROLE_OPTIONS.map((r) => (
              <button key={r} type="button" onClick={() => pick({ role: r })} className={`${option} pl-7 ${filter.role === r ? "bg-bg5" : ""}`}>
                {r}
              </button>
            ))}
          {(["Active", "Inactive"] as const).map((s) => (
            <button key={s} type="button" onClick={() => pick({ status: s })} className={`${option} last:border-b-0 ${filter.status === s ? "bg-bg5" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </Popover>

      <Modal open={editing !== null} onClose={close} title={editing ? "Edit User" : "Create New User"} className={`w-[762px] ${USER_MODAL} [&>button]:text-white`}>
        <UField label="User Name">
          <TextInput value={draft.name} onChange={(e) => set("name")(e.target.value)} placeholder="eg., Praveen" />
        </UField>
        <UField label="Email ID">
          <TextInput type="email" value={draft.email} onChange={(e) => set("email")(e.target.value)} placeholder="eg., afasfg@gmail.com" />
        </UField>
        <UField label="Phone">
          <TextInput type="tel" value={draft.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="9+87463419684614" />
        </UField>
        <UField label="Roles">
          <SelectField value={draft.role} options={ROLE_OPTIONS} onChange={set("role")} placeholder="Admin" />
        </UField>
        <div className={WIDE_ACTIONS}>
          <ModalActions onCancel={close} onDone={save} />
        </div>
      </Modal>
    </div>
  );
}
