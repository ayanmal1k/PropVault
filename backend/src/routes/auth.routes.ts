import { Router } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { validateBody } from "../middleware/validate";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const otpSchema = z.object({ phone: z.string().min(10) });
const verifyOtpSchema = z.object({ phone: z.string().min(10), code: z.string().length(6) });

router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    sendSuccess(res, result, 201);
  } catch (e) {
    sendError(res, (e as Error).message, 400);
  }
});

router.post("/login", validateBody(loginSchema), async (req, res) => {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, (e as Error).message, 401);
  }
});

router.post("/otp/send", validateBody(otpSchema), async (req, res) => {
  try {
    const result = await authService.sendOtp(req.body.phone);
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, (e as Error).message, 400);
  }
});

router.post("/otp/verify", validateBody(verifyOtpSchema), async (req, res) => {
  try {
    const result = await authService.verifyOtp(req.body.phone, req.body.code);
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, (e as Error).message, 401);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.body.refreshToken;
    if (!token) return sendError(res, "Refresh token required");
    const result = await authService.refreshTokens(token);
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, (e as Error).message, 401);
  }
});

export default router;
