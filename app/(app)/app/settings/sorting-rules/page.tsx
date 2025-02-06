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
    <div className="flex flex-col justify-center bg-white pt-4 pb-20 px-0 md:px-12">
      <div className="flex flex-col pt-4 pb-8 px-8 md:px-0 gap-6">
        <div className="flex items-center gap-4 justify-between">
          <h1 className="text-2xl font-semibold">Edit Sorting Rules</h1>
          <span className="pr-6 font-semibold">{rulesNum} / 20</span>
        </div>
        <p className="text-sm text-muted-foreground">
          You can change how Mailclerk sorts different kinds of emails. Predefined rules are a good
          starting point, but you can tailor them to your specific needs. Remove unwanted defaults
          and create custom rules up to a combined maximum of 20.
        </p>
      </div>
      <SortingRuleTable rules={{ default: defaultRules, custom: customRules }} />
    </div>
  );
}
