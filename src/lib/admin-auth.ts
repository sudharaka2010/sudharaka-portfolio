import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sl_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function hashPassword(password: string) {
  const salt = getRequiredEnv("ADMIN_PASSWORD_SALT");
  return scryptSync(password, salt, 64).toString("hex");
}

function signValue(value: string) {
  const secret = getRequiredEnv("ADMIN_SESSION_SECRET");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = getRequiredEnv("ADMIN_USERNAME");
  const expectedHash = getRequiredEnv("ADMIN_PASSWORD_HASH");

  if (username !== expectedUsername) {
    return false;
  }

  const incomingHash = hashPassword(password);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const incomingBuffer = Buffer.from(incomingHash, "hex");

  if (expectedBuffer.length !== incomingBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, incomingBuffer);
}

function buildSessionToken(username: string) {
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const payload = `${username}:${expiresAt}`;
  const signature = signValue(payload);
  return `${payload}:${signature}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const parts = token.split(":");

  if (parts.length !== 3) {
    return false;
  }

  const [username, expiresAt, signature] = parts;
  const payload = `${username}:${expiresAt}`;
  const expectedSignature = signValue(payload);
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const incomingBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== incomingBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(expectedBuffer, incomingBuffer)) {
    return false;
  }

  if (Date.now() > Number(expiresAt)) {
    return false;
  }

  return username === getRequiredEnv("ADMIN_USERNAME");
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = buildSessionToken(getRequiredEnv("ADMIN_USERNAME"));

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
