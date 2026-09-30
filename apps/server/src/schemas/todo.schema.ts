import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string({ error: "Title is required" }).trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
});
