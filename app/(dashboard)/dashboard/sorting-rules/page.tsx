import { SortingRuleTable } from "@/components/sorting-rule-table";
import { getUser, getUserCustomRules, getUserDefaultOverrides } from "@/lib/db/queries";

export default async function SortingRules() {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const [defaultRules, customRules] = await Promise.all([
    getUserDefaultOverrides(user.id),
    getUserCustomRules(user.id),
  ]);

  const rulesNum = defaultRules.length + customRules.length;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex justify-between items-baseline px-6">
        <div />
        <h1 className="py-12 text-2xl font-semibold">Sorting Rules</h1>
        <span className="">{rulesNum} / 20</span>
      </div>
      <SortingRuleTable rules={{ default: defaultRules, custom: customRules }} />
    </div>
  );
}
