import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";
import { sendError } from "../utils/apiResponse";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(required = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.accessToken;

    if (!token) {
      if (required) return sendError(res, "Authentication required", 401);
      return next();
    }

    try {
      const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) return sendError(res, "User not found", 401);
      req.user = { userId: user.id, role: user.role };
      next();
    } catch {
      return sendError(res, "Invalid or expired token", 401);
    }
  };
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, "Authentication required", 401);
    if (!roles.includes(req.user.role)) return sendError(res, "Forbidden", 403);
    next();
  };
}
