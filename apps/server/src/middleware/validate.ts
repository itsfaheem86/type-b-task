import type { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import type { ZodType } from "zod";
import { HttpError } from "../utils/http-error.js";

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      throw new HttpError(400, "Validation failed", errors);
    }

    req.body = result.data;
    next();
  };
}

export function validateId(req: Request, _res: Response, next: NextFunction) {
  if (!isObjectIdOrHexString(req.params.id)) {
    throw new HttpError(400, "Invalid todo id");
  }

  next();
}
