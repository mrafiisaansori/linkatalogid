import { prisma } from "@/lib/db";
import { hashSensitiveValue } from "@/lib/server/request-meta";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

export async function getAdminLoginRateLimitState(identifier: string) {
  const key = hashSensitiveValue(identifier);
  const current = await prisma.adminLoginRateLimit.findUnique({
    where: { identifier: key }
  });

  const now = new Date();
  if (!current) {
    await prisma.adminLoginRateLimit.create({
      data: {
        identifier: key,
        attempts: 0,
        windowStart: now
      }
    });

    return { key, blockedUntil: null, attempts: 0, windowStart: now };
  }

  if (current.blockedUntil && current.blockedUntil > now) {
    return {
      key,
      blockedUntil: current.blockedUntil,
      attempts: current.attempts,
      windowStart: current.windowStart
    };
  }

  if (now.getTime() - current.windowStart.getTime() > WINDOW_MS) {
    const reset = await prisma.adminLoginRateLimit.update({
      where: { identifier: key },
      data: {
        attempts: 0,
        windowStart: now,
        blockedUntil: null
      }
    });

    return { key, blockedUntil: reset.blockedUntil, attempts: reset.attempts, windowStart: reset.windowStart };
  }

  return { key, blockedUntil: current.blockedUntil, attempts: current.attempts, windowStart: current.windowStart };
}

export async function registerAdminLoginFailure(identifier: string) {
  const state = await getAdminLoginRateLimitState(identifier);
  const nextAttempts = state.attempts + 1;
  const now = new Date();
  const blockedUntil = nextAttempts >= MAX_ATTEMPTS ? new Date(now.getTime() + BLOCK_MS) : null;

  await prisma.adminLoginRateLimit.update({
    where: { identifier: state.key },
    data: {
      attempts: nextAttempts,
      blockedUntil,
      windowStart: state.windowStart
    }
  });

  return { nextAttempts, blockedUntil };
}

export async function clearAdminLoginRateLimit(identifier: string) {
  const key = hashSensitiveValue(identifier);
  await prisma.adminLoginRateLimit.upsert({
    where: { identifier: key },
    update: {
      attempts: 0,
      blockedUntil: null,
      windowStart: new Date()
    },
    create: {
      identifier: key,
      attempts: 0,
      windowStart: new Date(),
      blockedUntil: null
    }
  });
}
