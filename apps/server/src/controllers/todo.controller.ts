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

export async function updateTodo(req: Request<{ id: string }>, res: Response) {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.status(200).json(todo);
}
