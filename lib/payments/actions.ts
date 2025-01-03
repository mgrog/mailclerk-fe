"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./stripe";
import { withUser } from "@/lib/auth/middleware";

export const checkoutAction = withUser(async (formData, user) => {
  const priceId = formData.get("priceId") as string;
  await createCheckoutSession({ user, priceId });
});

export const customerPortalAction = withUser(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
