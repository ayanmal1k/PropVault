import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/apiResponse";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return sendError(res, msg, 422);
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return sendError(res, msg, 422);
    }
    req.query = result.data as Request["query"];
    next();
  };
}
