"use server";

import { db } from "@/lib/db/database";
import { DEFAULT_EMAIL_RULES } from "@/lib/constants";
import { AutoCleanupSetting } from "@/lib/db/schema";

export async function getCurrentUserEnabledEmailRuleCount(userId: number): Promise<number> {
  let enabledDefaultCount = await db
    .selectFrom("defaultEmailRuleOverride")
    .select(db.fn.countAll().as("count"))
    .where("userId", "=", userId)
    .where("isDisabled", "=", false)
    .executeTakeFirst();

  let customEmailRuleCount = await db
    .selectFrom("customEmailRule")
    .select(db.fn.countAll().as("count"))
    .where("userId", "=", userId)
    .executeTakeFirst();

  return Number(enabledDefaultCount ?? 0) + Number(customEmailRuleCount ?? 0);
}

export async function getUserDefaultOverrides(userId: number) {
  const disabledOverrides = await db
    .selectFrom("defaultEmailRuleOverride")
    .selectAll()
    .where("userId", "=", userId)
    .where("isDisabled", "=", true)
    .execute();

  const disabledOverridesSet = new Set(disabledOverrides.map((override) => override.category));

  const defaultRules = DEFAULT_EMAIL_RULES.filter((rule) => {
    const label = rule.label.replace(" ", "_");
    return !disabledOverridesSet.has(label);
  });

  return defaultRules;
}

export async function getUserCustomRules(userId: number) {
  return db.selectFrom("customEmailRule").selectAll().where("userId", "=", userId).execute();
}

export type DefaultRule = Awaited<ReturnType<typeof getUserDefaultOverrides>>[0];
export type CustomRule = Awaited<ReturnType<typeof getUserCustomRules>>[0];
