import { SortingRuleTable } from "@/components/sorting-rule-table";
import { getUser, getUserCustomRules, getUserDefaultOverrides } from "@/lib/db/queries";

export default async function SortingRules() {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const [defaultRules, customRules] = await Promise.all([
    getUserDefaultOverrides(user.id),
    getUserCustomRules(user.id),
  ]);

  console.log(defaultRules, customRules);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="flex justify-center py-12 text-2xl font-semibold">Sorting Rules</h1>
      <SortingRuleTable rules={{ default: defaultRules, custom: customRules }} />
    </div>
  );
}
