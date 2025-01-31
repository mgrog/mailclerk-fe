"use server";

import { validatedActionWithUser } from "@/lib/auth/middleware";
import { db } from "@/lib/db/database";
import { logActivity } from "@/lib/logging";
import { getIpAddress } from "@/lib/server-utils";
import { z } from "zod";

const cleanupSettingSchema = z.object({
  mailLabel: z.string(),
  cleanupAction: z.union([z.literal("NOTHING"), z.literal("DELETE"), z.literal("ARCHIVE")]),
  afterDaysOld: z.number(),
});

const applyCleanupSettingsSchema = z.object({
  "changes[]": z.preprocess((text) => {
    const value = JSON.parse(String(text));
    return Array.isArray(value) ? value : [value];
  }, z.array(cleanupSettingSchema)),
});

export const applyCleanupSettings = validatedActionWithUser(
  applyCleanupSettingsSchema,
  async (data, _, user) => {
    const ipAddress = await getIpAddress();

    const rows = data["changes[]"].map((change) => ({
      ...change,
      userId: user.id,
    }));

    const [result] = await Promise.all([
      db
        .insertInto("autoCleanupSetting")
        .values(rows)
        .onConflict((oc) =>
          oc.columns(["userId", "mailLabel"]).doUpdateSet({
            cleanupAction: (eb) => eb.ref("excluded.cleanupAction"),
            afterDaysOld: (eb) => eb.ref("excluded.afterDaysOld"),
          }),
        )
        .executeTakeFirst(),
      logActivity(user.id, "Applied auto cleanup settings", ipAddress),
    ]);

    if (Number(result.numInsertedOrUpdatedRows) !== rows.length) {
      return { error: "Failed to save settings" };
    }

    return {
      kind: "apply_success" as const,
      success: "Settings saved successfully",
    };
  },
);
