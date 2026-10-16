import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "ifrw_session";

function secret() {
  return process.env.SESSION_SECRET || "dev-session-secret-change-me-please-32chars";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function setAdminSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 7 * 864e5 })).toString(
    "base64url",
  );
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function getAdminEmail() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const i = raw.lastIndexOf(".");
  if (i < 0) return null;
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  if (sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email: string;
      exp: number;
    };
    if (data.exp < Date.now()) return null;
    return data.email;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const email = await getAdminEmail();
  if (!email) {
    const err = new Error("UNAUTHORIZED");
    throw err;
  }
  return email;
}
