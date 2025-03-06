export default function ConfirmConnectionLoading() {
  const stepClass = "step !gap-8 font-semibold text-muted-foreground";
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="font-semibold text-2xl">Checking account connection</h1>
      <ul className="steps steps-vertical h-64">
        <li className={stepClass} data-content="">
          Account found
        </li>
        <li className={stepClass} data-content="">
          Permissions Granted
        </li>
        <li className={stepClass} data-content="">
          Test Successful
        </li>
      </ul>
      <progress className="progress w-36 h-1"></progress>
    </div>
  );
}
