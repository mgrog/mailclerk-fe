"use client";

import { addPredefinedRule } from "../actions";
import { Button } from "@/components/ui/button";
import { DEFAULT_EMAIL_RULES } from "@/lib/constants";
import type { DefaultRule } from "@/lib/db/queries/email-rules";
import { startTransition, useActionState, useEffect, useState } from "react";

interface PredefinedRuleFormProps {
  activePredefinedRulesSet: Set<DefaultRule["name"]>;
  onComplete: (state: ActionState) => void;
}

type ActionState = {
  success?: string;
  error?: string;
  kind?: "create_success";
};

export function PredefinedRuleCreateForm({
  activePredefinedRulesSet,
  onComplete,
}: PredefinedRuleFormProps) {
  const options = DEFAULT_EMAIL_RULES.filter((rule) => !activePredefinedRulesSet.has(rule.name));
  const [selected, setSelected] = useState("");
  const [predefinedAddState, predefinedAddAction, predefinedAddPending] = useActionState<
    ActionState,
    FormData
  >(addPredefinedRule, {
    error: undefined,
    success: undefined,
  });

  useEffect(() => {
    onComplete(predefinedAddState);
  }, [predefinedAddState]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      return predefinedAddAction(new FormData(event.currentTarget));
    });
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <p className="label-text mt-4">
          Here you can reenable a predefined rule that you have previously disabled. If you want to
          create a new rule, use the 'custom' tab.
        </p>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-medium">Select Predefined Category</span>
          </div>
          <select
            name="categoryName"
            className="select select-bordered"
            defaultValue=""
            onChange={(e) => setSelected(e.target.value)}
          >
            <option disabled value="">
              Pick a category
            </option>
            {options.map((rule) => (
              <option key={rule.name}>{rule.name}</option>
            ))}
          </select>
          {predefinedAddState.error && (
            <span className="text-red-500 text-sm">{predefinedAddState.error}</span>
          )}
        </label>
        {selected ? (
          <Button
            type="submit"
            className="absolute bottom-4"
            disabled={predefinedAddPending}
            loading={predefinedAddPending}
          >
            Submit
          </Button>
        ) : null}
      </form>
    </>
  );
}

export type { ActionState as PredefinedRuleActionState };
