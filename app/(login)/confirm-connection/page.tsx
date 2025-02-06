import { checkAccountConnection } from "@/lib/server/check-connection";
import { cn } from "@/lib/utils";

export default async function ConfirmConnectionPage() {
  const check = await checkAccountConnection();
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

  const stepProps = (num: number) => ({
    "className": cn("step", testsPassed > num ? "step-success" : "step-error", "after:text-white"),
    "data-content": testsPassed > num ? "✓" : "✕",
  });

  return (
    <div>
      <ul className="steps steps-vertical">
        <li className="step">
          <span className="step-icon">😕</span>
          Account found
        </li>
        <li className="step">Permissions Granted</li>
        <li className="step">Tests Successful</li>
      </ul>
    </div>
  );

  return (
    <div>
      <ul className="steps steps-vertical">
        <li {...stepProps(0)}>Account found</li>
        <li {...stepProps(1)}>Permissions Granted</li>
        <li {...stepProps(2)}>Tests Successful</li>
      </ul>
    </div>
  );
}
