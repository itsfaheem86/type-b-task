import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo,
} from "../controllers/todo.controller.js";
import { validateBody, validateId } from "../middleware/validate.js";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo.schema.js";

const router = Router();

router.get("/", getTodos);
router.post("/", validateBody(createTodoSchema), createTodo);
router.put("/:id", validateId, validateBody(updateTodoSchema), updateTodo);
router.patch("/:id/done", validateId, toggleTodoDone);
router.delete("/:id", validateId, deleteTodo);

export default router;
