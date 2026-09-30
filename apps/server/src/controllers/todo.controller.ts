import type { Request, Response } from "express";
import Todo from "../models/todo.model.js";

export async function getTodos(_req: Request, res: Response) {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.status(200).json(todos);
}

export async function createTodo(req: Request, res: Response) {
  const { title, description } = req.body;
  const todo = await Todo.create({ title, description });
  res.status(201).json(todo);
}
