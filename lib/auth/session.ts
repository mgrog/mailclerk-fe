import exp from "constants";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Cookie } from "set-cookie-parser";

const key = Buffer.from(process.env.AUTH_SECRET!, "hex");

type SessionData = {
  sub: string;
  email: string;
  company: string;
  expires: string;
};

export async function verifyToken(input: string) {
  try {
    let { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });

    return payload as SessionData;
  } catch {
    return null;
  }
}

export async function getSessionCookie() {
  return (await cookies()).get("session")?.value ?? null;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  return await verifyToken(session);
}

export async function setSession(sessionCookie: Cookie) {
  const options = Object.fromEntries(
    Object.entries(sessionCookie).filter(([key]) => key !== "value" && key !== "name"),
  );
  (await cookies()).set("session", sessionCookie.value, options);
}

export const USER_NOT_AUTHENTICATED_MSG = "User is not authenticated";
