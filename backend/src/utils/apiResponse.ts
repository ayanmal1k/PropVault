import { Response } from "express";
import type { ApiResponse } from "../types/shared";

export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200,
  meta?: ApiResponse<T>["meta"]
) {
  const body: ApiResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, status = 400) {
  res.status(status).json({ success: false, error: message } satisfies ApiResponse);
}
