"use server";

import { verifyToken } from "@/lib/auth/session";
import { db } from "@/lib/db/database";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.sub) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const id = sessionData.sub;

  return await getCachedUser(id);
}

const getCachedUser = unstable_cache(
  async (id) => {
    console.log("Fetching user from database");
    const user = await db
      .selectFrom("user")
      .selectAll("user")
      .where("id", "=", id)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    return user;
  },
  ["user"],
  { revalidate: 60 * 30, tags: ["user"] },
);
