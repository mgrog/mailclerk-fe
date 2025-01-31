import { SortingRuleTable } from "@/components/sorting-rule-table";
import { getUser, getUserCustomRules, getUserDefaultOverrides } from "@/lib/db/queries";

export default async function SortingRules() {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  const [defaultRules, customRules] = await Promise.all([
    getUserDefaultOverrides(user.id),
    getUserCustomRules(user.id),
  ]);

  return (
    <div className="flex justify-center bg-white pt-4 pb-20 px-0 md:px-12">
      {/* <div className="flex justify-end items-baseline pt-4 pb-2 px-6"> */}
      {/* <div />
        <h1 className="py-12 text-2xl font-semibold">Sorting Rules</h1> */}
      {/* <span className="">{rulesNum} / 20</span> */}
      {/* </div> */}
      <SortingRuleTable rules={{ default: defaultRules, custom: customRules }} />
    </div>
  );
}
