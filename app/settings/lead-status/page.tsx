import { SettingsList } from "@/components/settings/SettingsList";

export default function Page() {
  return <SettingsList tab={1} endpoint="/settings/lead-statuses" modalTitle="Add New Lead Status" fieldLabel="New Lead Status" editTitle="Edit Lead Status" editLabel="Lead Status" noun="Lead status" />;
}
