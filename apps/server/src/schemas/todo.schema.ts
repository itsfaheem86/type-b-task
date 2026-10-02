import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string({ error: "Title is required" }).trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    description: z.string().trim().optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: "Provide a title or description to update",
  });
