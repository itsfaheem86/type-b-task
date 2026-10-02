import { z } from "zod";

export const todoFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim(),
});

export type TodoFormValues = z.input<typeof todoFormSchema>;
