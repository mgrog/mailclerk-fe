"use server";

import { getSessionCookie, USER_NOT_AUTHENTICATED_MSG } from "@/lib/auth/session";

export async function checkAccountConnection() {
  const jwt = await getSessionCookie();

  if (!jwt) {
    return { error: USER_NOT_AUTHENTICATED_MSG };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check_account_connection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
    });

    type ServerResponse = {
      email: string;
    } & (
      | {
          result: {
            status: "not_found";
          };
        }
      | {
          result: {
            status: "access_denied";
          };
        }
      | {
          result: {
            status: "failed";
            passed_checks: string[];
            failed_checks: string[];
          };
        }
      | {
          result: {
            status: "passed";
            passed_checks: string[];
          };
        }
    );
    console.log(response.statusText);

    const data: ServerResponse = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return {
      error: `Error while checking account connection: ${errMsg}`,
    };
  }
}
