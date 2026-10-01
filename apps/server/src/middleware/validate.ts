import type { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateId(req: Request, res: Response, next: NextFunction) {
  if (!isObjectIdOrHexString(req.params.id)) {
    res.status(400).json({ message: "Invalid todo id" });
    return;
  }

  next();
}
