import { SettingsList } from "@/components/settings/SettingsList";
import { LEAD_STATUS_LIST } from "@/lib/mock/settings";

export default function Page() {
  return <SettingsList tab={1} initial={LEAD_STATUS_LIST} modalTitle="Add New Lead Status" fieldLabel="New Lead Status" />;
}
