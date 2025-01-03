"use server";

import { db } from "@/lib/db/database";
import { DEFAULT_EMAIL_RULES } from "@/lib/constants";

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
  const overrides = await db
    .selectFrom("defaultEmailRuleOverride")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  const defaultRules = DEFAULT_EMAIL_RULES.filter(
    (rule) =>
      !overrides.some((override) => {
        const label = rule.label.replace(" ", "_");
        return override.category === label && override.isDisabled;
      }),
  );

  return defaultRules;
}

export async function getUserCustomRules(userId: number) {
  return db.selectFrom("customEmailRule").selectAll().where("userId", "=", userId).execute();
}

export type DefaultRule = Awaited<ReturnType<typeof getUserDefaultOverrides>>[0];
export type CustomRule = Awaited<ReturnType<typeof getUserCustomRules>>[0];
