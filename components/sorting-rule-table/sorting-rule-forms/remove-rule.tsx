import { removeCustomRule, removePredefinedRule } from "../actions";
import { Button } from "@/components/ui/button";
import { DEFAULT_EMAIL_RULES_MAP, DefaultRuleName } from "@/lib/constants";
import { CustomRule, DefaultRule } from "@/lib/db/queries";
import { startTransition, useActionState, useEffect } from "react";

interface RemoveRuleFormProps {
  rule: CustomRule | DefaultRule | null;
  onComplete: (state: ActionState) => void;
  onCancel: () => void;
}

type ActionState = {
  success?: string;
  error?: string;
  kind?: "remove_success";
};

export function RemoveRuleForm({ rule, onComplete, onCancel }: RemoveRuleFormProps) {
  const [removePredefinedRuleState, removePredefinedRuleAction, removePredefinedRulePending] =
    useActionState<ActionState, FormData>(removePredefinedRule, {
      success: undefined,
      error: undefined,
    });

  const [removeCustomRuleState, removeCustomRuleAction, removeCustomRulePending] = useActionState<
    ActionState,
    FormData
  >(removeCustomRule, {
    success: undefined,
    error: undefined,
  });

  useEffect(() => {
    onComplete(removePredefinedRuleState);
  }, [removePredefinedRuleState]);

  useEffect(() => {
    onComplete(removeCustomRuleState);
  }, [removeCustomRuleState]);

  const ruleName = rule?.name ?? "";

  const handleFormSubmit = () => {
    if (!rule) {
      throw new Error("Rule to remove is not selected!");
    }

    if ("id" in rule) {
      const formData = new FormData();
      formData.append("ruleId", rule.id.toString());
      startTransition(() => {
        return removeCustomRuleAction(formData);
      });
      return;
    }

    if ("name" in rule) {
      const formData = new FormData();
      formData.append("categoryName", ruleName);
      startTransition(() => {
        return removePredefinedRuleAction(formData);
      });
      return;
    }

    throw new Error("Invalid rule type");
  };

  const isPredefined = rule && DEFAULT_EMAIL_RULES_MAP[ruleName as DefaultRuleName] !== undefined;

  const isPending = removePredefinedRulePending || removeCustomRulePending;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to remove the <strong>{ruleName}</strong>{" "}
        {isPredefined ? "predefined" : "custom"} rule?
        {isPredefined ? " You can readd this rule later." : " This action cannot be undone."}
      </p>
      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={isPending}
          loading={isPending}
          onClick={handleFormSubmit}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export type { ActionState as RemoveRuleActionState };
