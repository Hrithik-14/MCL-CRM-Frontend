import { SettingsList } from "@/components/settings/SettingsList";
import { LEAD_SOURCE_LIST } from "@/lib/mock/settings";

export default function Page() {
  return <SettingsList tab={0} initial={LEAD_SOURCE_LIST} modalTitle="Add New Source" fieldLabel="New Source Name" />;
}
