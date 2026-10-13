"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Modal, ModalActions, PrimaryButton, TextInput } from "@/components/ui";
import { ROLES, UNLISTED_USERS, USERS, type Role } from "@/lib/mock/users";
import { CaretInput, Chip, FieldLabel, PermissionPills, UField, USER_MODAL, WIDE_ACTIONS, toggle } from "./form";
import { inter, SectionHeader, UnderlineTabs } from "./SectionHeader";
import { USER_TABS } from "./UsersPage";

const noScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function RoleCard({ role, onEdit, onDelete }: { role: Role; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-[16px] border border-stroke2 bg-primary px-[30px] py-8">
      <h2 className="border-b border-stroke2 pb-4 text-[25px] font-medium text-black">{role.name}</h2>
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-center justify-between">
          {[["Permissions", role.permissions.length], ["Users", role.users]].map(([label, n]) => (
            <div key={label} className="flex w-[105px] flex-col gap-[6px]">
              <p className="text-[18px] font-medium whitespace-nowrap text-nav">{label}</p>
              <p className={`${inter.className} text-[40px] leading-[round(1.21em,1px)] font-semibold text-secondary opacity-80`}>{n}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[14px]">
          <p className="text-[18px] font-medium text-nav">Permissions</p>
          {/* Figma: fixed-width row with overflow scroll, so the chips are clipped at the card edge */}
          <div className={`flex gap-2 overflow-x-auto ${noScrollbar}`}>
            {role.permissions.map((p) => (
              <Chip key={p} label={p} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[14px]">
          <p className="text-[18px] font-medium text-[#99a4b0]">Assigned Users</p>
          <div className="flex min-h-[30px] items-center gap-[10px]">
            <div className="flex items-center gap-2">
              {role.members.map((m) => (
                <span key={m.initials} className="flex size-[30px] items-center justify-center rounded-full" style={{ background: m.color }}>
                  <span className="text-[14px] font-medium text-white opacity-60">{m.initials}</span>
                </span>
              ))}
            </div>
            {role.extra > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#787878]">
                <span className="text-[8px] font-semibold text-white opacity-80">+{role.extra}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          {/* Edit / Delete: no prototype action. Edit → Edit Role overlay (1:7806); Delete removes the card locally */}
          <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-button bg-primary px-4 py-[10px] text-[16px] font-medium text-button">
            <Icon name="edit" size={18} />
            Edit
          </button>
          <button type="button" onClick={onDelete} className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-button px-4 py-[10px] text-[16px] font-medium text-primary">
            <Icon name="delete" size={18} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

type Draft = { name: string; permissions: string[] };

export function RolesPage() {
  const [roles, setRoles] = useState(ROLES);
  // Create New Role (1:7850)
  const [creating, setCreating] = useState(false);
  // Edit Role (1:7806) ⇄ Permissions (1:7891)
  const [editing, setEditing] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [draft, setDraft] = useState<Draft>({ name: "", permissions: [] });
  const [beforePick, setBeforePick] = useState<string[]>([]);

  const startCreate = () => {
    setDraft({ name: "", permissions: [] });
    setCreating(true);
  };
  const create = () => {
    if (draft.name.trim())
      setRoles((rs) => [...rs, { id: Math.max(0, ...rs.map((r) => r.id)) + 1, name: draft.name.trim(), users: 0, permissions: draft.permissions, members: [], extra: 0 }]);
    setCreating(false);
  };
  const startEdit = (r: Role) => {
    setDraft({ name: r.name, permissions: r.permissions });
    setPicking(false);
    setEditing(r.id);
  };
  const saveEdit = () => {
    setRoles((rs) => rs.map((r) => (r.id === editing ? { ...r, name: draft.name.trim() || r.name, permissions: draft.permissions } : r)));
    setEditing(null);
  };
  const openPicker = () => {
    setBeforePick(draft.permissions);
    setPicking(true);
  };
  const togglePerm = (p: string) => setDraft((d) => ({ ...d, permissions: toggle(d.permissions, p) }));

  return (
    <div className="flex flex-col gap-[18px] p-4 sm:p-6">
      {/* Add Role (1:6729): prototype points at Create New User (1:7919), a wiring slip — the dedicated Create New Role overlay 1:7850 is used */}
      <SectionHeader title="User Management" subtitle={`${USERS.length + UNLISTED_USERS} Users`} action={<PrimaryButton onClick={startCreate}>Add Role</PrimaryButton>} />
      {/* Figma 1:6730 sets these tabs in Inter Medium (1:6510 on the User tab uses Montserrat) */}
      <UnderlineTabs tabs={USER_TABS} active={1} className={inter.className} />

      <div className="grid gap-4 lg:grid-cols-2">
        {roles.map((r) => (
          <RoleCard key={r.id} role={r} onEdit={() => startEdit(r)} onDelete={() => setRoles((rs) => rs.filter((x) => x.id !== r.id))} />
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Create New Role" className={`w-[762px] gap-7! ${USER_MODAL}`}>
        <UField label="Role Name">
          <CaretInput caret="right-[25px] text-white">
            <TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="eg., Admin" className="h-[50px] pr-[58px]! pl-6!" />
          </CaretInput>
        </UField>
        <div className="flex flex-col gap-4">
          <FieldLabel>Permissions</FieldLabel>
          <PermissionPills value={draft.permissions} onToggle={togglePerm} />
        </div>
        <div className={`-mt-1 ${WIDE_ACTIONS}`}>
          <ModalActions onCancel={() => setCreating(false)} onDone={create} />
        </div>
      </Modal>

      {/* Edit Role and its Permissions picker share one overlay; "+" swaps to the picker, its Cancel/Done return. */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={picking ? "Permissions" : "Edit Role"}
        className={picking ? "w-[760px] gap-4! border-transparent! [&>button]:hidden [&>div:first-child]:hidden" : `w-[611px] gap-4! ${USER_MODAL}`}
      >
        {picking ? (
          <>
            <FieldLabel>Permissions</FieldLabel>
            <PermissionPills value={draft.permissions} onToggle={togglePerm} />
            <div className={WIDE_ACTIONS}>
              <ModalActions
                onCancel={() => {
                  setDraft((d) => ({ ...d, permissions: beforePick }));
                  setPicking(false);
                }}
                onDone={() => setPicking(false)}
              />
            </div>
          </>
        ) : (
          <>
            <UField label="Role Name" gap="gap-[6px]">
              <CaretInput caret="right-[13px] text-nav">
                <TextInput value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="h-[50px] pr-[46px]! pl-6! text-nav!" />
              </CaretInput>
            </UField>
            <div className="flex flex-col gap-[6px]">
              <FieldLabel>Proof of Delivery</FieldLabel>
              <div className="flex items-center">
                <div className={`flex w-[450px] min-w-0 gap-2 overflow-x-auto py-[10px] ${noScrollbar}`}>
                  {draft.permissions.map((p) => (
                    <Chip key={p} label={p}>
                      <button type="button" aria-label={`Remove ${p}`} onClick={() => togglePerm(p)} className="absolute -top-[10px] -right-[2px] cursor-pointer rounded-full bg-[#104b58] p-[2px] text-white">
                        <Icon name="close" size={16} />
                      </button>
                    </Chip>
                  ))}
                </div>
                <button type="button" aria-label="Add permissions" onClick={openPicker} className="ml-[63px] flex size-[33px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#104b58] bg-[#142e38] text-white">
                  <Icon name="close" size={16} className="rotate-45" />
                </button>
              </div>
            </div>
            <div className={WIDE_ACTIONS}>
              <ModalActions onCancel={() => setEditing(null)} onDone={saveEdit} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
