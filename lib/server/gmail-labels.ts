"use server";

import { getSessionCookie, USER_NOT_AUTHENTICATED_MSG } from "@/lib/auth/session";

export interface GmailLabel {
  color?: {
    backgroundColor: string;
    textColor: string;
  };
  id?: string;
  labelListVisibility?: string;
  messageListVisibility?: string;
  messages_total?: number;
  messagesUnread?: number;
  name?: string;
  threadsTotal?: number;
  threadsUnread?: number;
  type?: string;
}

export async function getUserGmailLabels() {
  const apiRoute = `${process.env.NEXT_PUBLIC_API_URL}/gmail/labels`;
  const jwt = await getSessionCookie();

  if (!jwt) {
    return { error: USER_NOT_AUTHENTICATED_MSG };
  }

  try {
    const response = await fetch(apiRoute, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      return { error: `Error while fetching gmail labels: ${response.statusText}` };
    }

    interface ServerResponse {
      labels: GmailLabel[];
    }

    const data: ServerResponse = await response.json();

    return data;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return { error: `Error while fetching gmail labels: ${errMsg}` };
  }
}
