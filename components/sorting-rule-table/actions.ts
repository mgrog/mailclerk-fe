"use server";

import {
  CustomRuleActionState,
  PredefinedRuleActionState,
  RemoveRuleActionState,
} from "./sorting-rule-forms/types";
import { validatedAction, validatedActionWithUser } from "@/lib/auth/middleware";
import { getSessionCookie, USER_NOT_AUTHENTICATED_MSG } from "@/lib/auth/session";
import { db } from "@/lib/db/database";
import {
  DEFAULT_EMAIL_RULE_NAMES,
  DEFAULT_EMAIL_RULES,
  DEFAULT_EMAIL_RULES_MAP,
  DefaultRuleName,
} from "@/lib/constants";
import { logActivity } from "@/lib/logging";
import { getIpAddress } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCustomRuleSchema = z.object({
  name: z.string(),
  mailLabel: z.string(),
  summary: z.string().max(50),
  description: z.string().max(500),
});

export const createCustomRule = validatedActionWithUser(
  createCustomRuleSchema,
  async (data, _, user): Promise<CustomRuleActionState> => {
    const ipAddress = await getIpAddress();

    const [result] = await Promise.all([
      db
        .insertInto("customEmailRule")
        .values({
          userId: user.id,
          name: data.name,
          promptContent: data.summary,
          description: data.description,
          mailLabel: data.mailLabel,
        })
        .executeTakeFirst(),
      logActivity(user.id, "Created a custom email rule", ipAddress),
    ]);

    if (!result) {
      return { error: "Failed to create rule" };
    }

    revalidatePath("/dashboard/sorting-rules");

    return {
      kind: "create_success",
      success: "Rule created successfully",
    };
  },
);

const testCustomRuleSchema = z.object({
  mailLabel: z.string(),
  summary: z.string(),
  emailContent: z.string(),
});

export const testCustomRule = validatedAction(
  testCustomRuleSchema,
  async (data, _): Promise<CustomRuleActionState> => {
    const apiRoute = `${process.env.NEXT_PUBLIC_API_URL}/custom_email_rule/test`;
    const jwt = await getSessionCookie();

    if (!jwt) {
      return { error: USER_NOT_AUTHENTICATED_MSG };
    }

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        mailLabel: data.mailLabel,
        emailSummary: data.summary,
        emailContent: data.emailContent,
      }),
    });

    if (!response.ok) {
      return { error: "Failed to test rule" };
    }

    type CustomRuleTestResponse =
      | {
          kind: "success";
          message: string;
          aiResponse: string;
        }
      | {
          kind: "failure";
          message: string;
          aiResponse: string;
        };

    const json: CustomRuleTestResponse = await response.json();

    switch (json.kind) {
      case "success":
        return {
          kind: "test_success",
          success: "Test passed!",
        };
      case "failure":
        return {
          kind: "test_failure",
          success: `Expected '${data.mailLabel}', received '${json.aiResponse}'`,
        };
    }
  },
);

const removeCustomRuleSchema = z.object({
  ruleId: z.coerce.number(),
});

export const removeCustomRule = validatedActionWithUser(
  removeCustomRuleSchema,
  async (data, _, user): Promise<RemoveRuleActionState> => {
    const ipAddress = await getIpAddress();

    const [result] = await Promise.all([
      db
        .deleteFrom("customEmailRule")
        .where("userId", "=", user.id)
        .where("id", "=", data.ruleId)
        .executeTakeFirst(),
      logActivity(user.id, "Removed a custom email rule", ipAddress),
    ]);

    if (!result) {
      return { error: "Failed to remove rule" };
    }

    revalidatePath("/dashboard/sorting-rules");

    return {
      kind: "remove_success",
      success: "Rule removed successfully",
    };
  },
);

function getDefaultRuleCategory(name: DefaultRuleName) {
  return DEFAULT_EMAIL_RULES_MAP[name].label.replaceAll(" ", "_");
}

const addPredefinedRuleSchema = z.object({
  categoryName: z.enum(DEFAULT_EMAIL_RULE_NAMES),
});

export const addPredefinedRule = validatedActionWithUser(
  addPredefinedRuleSchema,
  async (data, _, user): Promise<PredefinedRuleActionState> => {
    const ipAddress = await getIpAddress();

    const category = getDefaultRuleCategory(data.categoryName);

    const [result] = await Promise.all([
      db
        .insertInto("defaultEmailRuleOverride")
        .values({
          userId: user.id,
          category,
          isDisabled: false,
        })
        .onConflict((oc) => oc.columns(["userId", "category"]).doUpdateSet({ isDisabled: false }))
        .executeTakeFirst(),
      logActivity(user.id, `Added predefined rule ${data.categoryName}`, ipAddress),
    ]);

    if (!result) {
      return { error: "Failed to add rule" };
    }

    revalidatePath("/dashboard/sorting-rules");

    return {
      kind: "create_success",
      success: "Rule added successfully",
    };
  },
);

const removePredefinedRuleSchema = z.object({
  categoryName: z.enum(DEFAULT_EMAIL_RULE_NAMES),
});

export const removePredefinedRule = validatedActionWithUser(
  removePredefinedRuleSchema,
  async (data, _, user): Promise<RemoveRuleActionState> => {
    const ipAddress = await getIpAddress();

    const category = getDefaultRuleCategory(data.categoryName);

    const [result] = await Promise.all([
      db
        .insertInto("defaultEmailRuleOverride")
        .values({
          userId: user.id,
          category,
          isDisabled: true,
        })
        .onConflict((oc) => oc.columns(["userId", "category"]).doUpdateSet({ isDisabled: true }))
        .executeTakeFirst(),
      logActivity(user.id, `Removed predefined rule ${data.categoryName}`, ipAddress),
    ]);

    if (!result) {
      return { error: "Failed to remove rule" };
    }

    revalidatePath("/dashboard/sorting-rules");

    return {
      kind: "remove_success",
      success: "Rule removed successfully",
    };
  },
);
