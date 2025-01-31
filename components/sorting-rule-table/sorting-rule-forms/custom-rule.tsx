"use client";

import { createCustomRule, testCustomRule } from "@/components/sorting-rule-table/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startTransition, use, useActionState, useEffect, useRef, useState } from "react";

interface CustomSortingRuleCreateFormProps {
  onComplete: (state: ActionState) => void;
}

type ActionState = {
  success?: string;
  error?: string;
  kind?: "create_success" | "test_success" | "test_failure";
};

export function CustomSortingRuleCreateForm({ onComplete }: CustomSortingRuleCreateFormProps) {
  const [customCreateRuleState, customCreateRuleAction, customCreateRulePending] = useActionState<
    ActionState,
    FormData
  >(createCustomRule, { error: undefined, success: undefined });

  const [customRuleTestState, customRuleTestAction, customRuleTestPending] = useActionState<
    ActionState,
    FormData
  >(testCustomRule, { error: undefined, success: undefined });

  const submitAction = useRef<"test" | "create" | null>(null);

  const [testSuccesses, setTestSuccesses] = useState(0);

  const handleCustomFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      switch (submitAction.current) {
        case "create":
          return customCreateRuleAction(new FormData(event.currentTarget));
        case "test":
          return customRuleTestAction(new FormData(event.currentTarget));
        default:
          console.error("Form action was not set or invalid!");
          throw new Error("Invalid action");
      }
    });
  };

  useEffect(() => {
    onComplete(customCreateRuleState);
  }, [customCreateRuleState]);

  useEffect(() => {
    if (customRuleTestState.kind === "test_success") {
      setTestSuccesses((prev) => prev + 1);
    }
  }, [customRuleTestState]);

  return (
    <>
      <form className="space-y-4" onSubmit={handleCustomFormSubmit}>
        <div>
          <Label htmlFor="rule-name">Name</Label>
          <Input id="rule-name" name="name" type="text" required />
        </div>
        <div>
          <Label htmlFor="rule-mail-label">Email Label</Label>
          <Input id="rule-mail-label" name="mailLabel" type="text" required />
        </div>
        <div>
          <Label htmlFor="rule-summary">Email Summary</Label>
          <Input id="rule-summary" name="summary" type="text" required maxLength={50} />
        </div>
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Textarea
            className="text-base"
            id="rule-description"
            name="description"
            maxLength={500}
          />
        </div>
        <div>
          <Label htmlFor="rule-test-content">Test Email Content</Label>
          <Textarea id="rule-test-content" name="emailContent" required />
          {customRuleTestState.error}
        </div>
        <div className="flex items-center gap-4 h-[36px]">
          <Button
            type="submit"
            disabled={customRuleTestPending}
            loading={customRuleTestPending}
            onClick={() => (submitAction.current = "test")}
          >
            Test
          </Button>
          <TestResult actionState={customRuleTestState} />
          <div className="flex-1" />
          {testSuccesses > 0 && (
            <Button
              type="submit"
              disabled={customCreateRulePending}
              loading={customCreateRulePending}
              onClick={() => (submitAction.current = "create")}
              className="justify-self-end"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

function TestResult({ actionState }: { actionState: ActionState }) {
  if (actionState.kind === "test_success") {
    return (
      <div className="bg-green-100 text-green-600 text-sm px-4 h-full rounded-sm inline-flex items-center">
        Test passed!
      </div>
    );
  }

  if (actionState.kind === "test_failure") {
    return (
      <div className="bg-red-100 text-red-600 text-sm px-4 h-full rounded-sm inline-flex items-center">
        Test failed!
      </div>
    );
  }

  return null;
}

export type { ActionState as CustomRuleActionState };
