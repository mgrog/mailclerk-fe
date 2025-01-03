import { getUser } from "@/lib/db/queries";

// import { useUser } from "@/lib/auth";

export default async function SettingsPage() {
  // const { user } = useUser();

  const user = await getUser();

  // if (!user) {
  //   redirect("/sign-in");
  // }

  return (
    <div>
      <h1>Dashboard!</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
