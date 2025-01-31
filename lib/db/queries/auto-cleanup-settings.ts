"use server";

import { db } from "@/lib/db/database";

export async function getUserAutoCleanupSettings(userId: number) {
  return db.selectFrom("autoCleanupSetting").selectAll().where("userId", "=", userId).execute();
}
