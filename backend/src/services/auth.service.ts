import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { UserRole } from "@prisma/client";
import type { AuthPayload } from "../middleware/auth";

const SALT_ROUNDS = 12;

function signAccess(payload: AuthPayload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

function signRefresh(payload: AuthPayload) {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, ...(data.phone ? [{ phone: data.phone }] : [])] },
  });
  if (existing) throw new Error("Email or phone already registered");

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: UserRole.USER,
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true },
  });

  const payload: AuthPayload = { userId: user.id, role: user.role };
  return {
    user,
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const payload: AuthPayload = { userId: user.id, role: user.role };
  const refreshToken = signRefresh(payload);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
    },
    accessToken: signAccess(payload),
    refreshToken,
  };
}

export async function sendOtp(phone: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.upsert({
    where: { phone },
    create: { phone, firstName: "User", lastName: "", otpCode: code, otpExpiresAt: expires },
    update: { otpCode: code, otpExpiresAt: expires },
  });

  if (config.nodeEnv === "development" || !config.twilio.accountSid) {
    console.log(`[DEV OTP] ${phone}: ${code}`);
  }

  return { sent: true };
}

export async function verifyOtp(phone: string, code: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user?.otpCode || user.otpCode !== code) throw new Error("Invalid OTP");
  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new Error("OTP expired");

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerified: true, otpCode: null, otpExpiresAt: null },
    select: { id: true, phone: true, firstName: true, lastName: true, role: true, avatar: true },
  });

  const payload: AuthPayload = { userId: updated.id, role: updated.role };
  return {
    user: updated,
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
  };
}

export async function refreshTokens(token: string) {
  const payload = jwt.verify(token, config.jwt.refreshSecret) as AuthPayload;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.refreshToken !== token) throw new Error("Invalid refresh token");
  return {
    accessToken: signAccess({ userId: user.id, role: user.role }),
    refreshToken: signRefresh({ userId: user.id, role: user.role }),
  };
}
