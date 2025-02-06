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
        <p className="label-text">
          Here you can reactivate a predefined rule that you have previously disabled. If you want
          to create a new rule, use the 'custom' tab.
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
            disabled={options.length === 0}
          >
            <option disabled value="">
              {options.length ? "Pick a disabled category" : "No categories available"}
            </option>
            {options.map((rule) => (
              <option key={rule.name}>{rule.name}</option>
            ))}
          </select>
          <span className="label-text mt-4 min-h-16">
            {selected ? getRuleContext(selected as DefaultRule["name"]) : null}
          </span>
        </label>
        <div className="min-h-10">
          {selected ? (
            <div className="absolute bottom-4 inline-flex items-center gap-2">
              <Button type="submit" disabled={predefinedAddPending} loading={predefinedAddPending}>
                Submit
              </Button>
              {predefinedAddState.error && (
                <span className="text-red-500 text-sm py-1 px-1">
                  {predefinedAddState.error || "Something went wrong, please try again"}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </form>
    </>
  );
}

function getRuleContext(ruleName: DefaultRule["name"]) {
  switch (ruleName) {
    case "Ads":
      return "Enabling this category will label emails containing advertisements and promotions under 'ads'";
    case "Career Networking":
      return "Enabling this category will label emails from job boards under 'career networking'";
    case "Finances":
      return "Enabling this category will label emails containing bills, receipts, and bank statements under 'finances'";
    case "Flights":
      return "Enabling this category will label flight confirmations, updates, and check-ins under 'flights'";
    case "Newsletters":
      return "Enabling this category will label weekly digests, blog posts, and newsletters under 'newsletters'";
    case "Notices":
      return "Enabling this category will label terms of service updates and change notices under 'notices'";
    case "Political":
      return "Enabling this category will label requests for campaign donations, get out the vote mailers, and other political outreach under 'political'";
    case "Security Alerts":
      return "Enabling this category will label password reset requests, login alerts, and other security-related emails under 'security alerts'";
    case "Social Media":
      return "Enabling this category will label emails from social media platforms under 'social media'";
    case "Orders":
      return "Enabling this category will label online order confirmations under 'orders'";
    default: {
      const missedRule: never = ruleName;
      throw new Error(`Unexpected rule name: ${missedRule}`);
    }
  }
}

export type { ActionState as PredefinedRuleActionState };
