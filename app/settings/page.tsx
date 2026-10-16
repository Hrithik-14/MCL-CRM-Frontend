import { SettingsList } from "@/components/settings/SettingsList";

export default function Page() {
  return <SettingsList tab={0} endpoint="/settings/lead-sources" modalTitle="Add New Source" fieldLabel="New Source Name" editTitle="Edit Source" editLabel="Source Name" noun="Lead source" />;
}
