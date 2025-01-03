"use server";

import { headers } from "next/headers";

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getIpAddress() {
  const reqHeaders = await headers();
  return (
    reqHeaders.get("x-real-ip") ||
    reqHeaders.get("true-client-ip") ||
    reqHeaders.get("x-forwarded-for")
  );
}
