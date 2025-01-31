import { CleanupSettingsTable } from "@/components/cleanup-settings-table/cleanup-settings-table";
import {
  getUser,
  getUserAutoCleanupSettings,
  getUserCustomRules,
  getUserDefaultOverrides,
} from "@/lib/db/queries";
import { getUserGmailLabels } from "@/lib/server/gmail-labels";

type ActiveMailLabel = {
  label: string;
  color: string;
};

export default async function CleanupPage() {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const [defaultRules, customRules, autoCleanupSettings] = await Promise.all([
    getUserDefaultOverrides(user.id),
    getUserCustomRules(user.id),
    getUserAutoCleanupSettings(user.id),
  ]);

  const userGmailLabels = await getUserGmailLabels();

  if ("error" in userGmailLabels) {
    throw new Error(userGmailLabels.error);
  }

  const activeMailLabels = userGmailLabels.labels;

  console.log("gmail labels", userGmailLabels);

  return (
    <div className="flex justify-center bg-white pt-4 pb-20">
      <CleanupSettingsTable
        activeMailLabels={activeMailLabels}
        autoCleanupSettings={autoCleanupSettings}
      />
    </div>
  );
}
