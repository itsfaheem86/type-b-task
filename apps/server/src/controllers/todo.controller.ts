import type { Request, Response } from "express";
import Todo from "../models/todo.model.js";

export async function getTodos(_req: Request, res: Response) {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.status(200).json(todos);
}
