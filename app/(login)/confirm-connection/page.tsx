import { checkAccountConnection } from "@/lib/server/check-connection";
import { cn, wait } from "@/lib/utils";
import ms from "ms";

export default async function ConfirmConnectionPage() {
  const check = await checkAccountConnection();
  // await wait(ms("5s"));
  let testsPassed = 0;
  let failedChecks = 0;
  if ("result" in check) {
    switch (check.result.status) {
      case "not_found":
        break;
      case "access_denied":
        testsPassed = 1;
        break;
      case "failed":
        testsPassed = 2;
        failedChecks = check.result.failed_checks.length;
        break;
      case "passed":
        testsPassed = 3;
        break;
    }
  }
  testsPassed = 1;

  const stepProps = (index: number) => ({
    "className": cn(
      "step !gap-8 font-semibold",
      testsPassed > index
        ? "after:!bg-black after:!text-white"
        : "after:!bg-red-400 after:!text-black",
      index >= testsPassed && "text-muted-foreground",
      "after:text-white",
    ),
    "data-content": testsPassed > index ? "✓" : "✕",
  });

  // const headerText = testsPassed === 0 ?
  //   "Account "

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="font-semibold text-2xl">{}</h1>
      <ul className="steps steps-vertical h-64">
        <li {...stepProps(0)}>Account Connected</li>
        <li {...stepProps(1)}>Permissions Granted</li>
        <li {...stepProps(2)}>Test Successful</li>
      </ul>
    </div>
  );
}
