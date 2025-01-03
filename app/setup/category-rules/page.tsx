import { Switch } from "@/components/ui/switch";
import { getUserOrRedirect } from "@/lib/auth/middleware";
import { getUserCustomRules, getUserDefaultOverrides } from "@/lib/db/queries";

interface RowProps {
  name: string;
  description: string;
  enabled: boolean;
}

function Row({ name, description, enabled }: RowProps) {
  return (
    <tr>
      <th></th>
      <td>{name}</td>
      <td>{description}</td>
      <td>
        <Switch id={`rule-${name.toLowerCase()}`} variant="red-green" defaultChecked={enabled} />
      </td>
    </tr>
  );
}

export default async function CategoryRules() {
  const user = await getUserOrRedirect();
  const [defaultOverrides, customRules] = await Promise.all([
    getUserDefaultOverrides(user.id),
    getUserCustomRules(user.id),
  ]);

  return (
    <div className="flex flex-col items-center mt-12 gap-12">
      <div>{JSON.stringify({ defaultOverrides, customRules }, null, 2)}</div>
      <h1 className="text-3xl font-semibold">Category Rules</h1>
      <form className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead className="text-gray-600">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Enabled?</th>
            </tr>
          </thead>
          <tbody>
            <Row
              name="Ads"
              description="Advertisements, promotions, that kind of thing"
              enabled={true}
            />
            <Row
              name="Political"
              description="Advertisements, promotions, that kind of thing"
              enabled={true}
            />
            {/* row 3 */}
            <tr>
              <th></th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
