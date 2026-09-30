import { Router } from "express";
import { createTodo, getTodos } from "../controllers/todo.controller.js";
import { validateBody } from "../middleware/validate.js";
import { createTodoSchema } from "../schemas/todo.schema.js";

const router = Router();

router.get("/", getTodos);
router.post("/", validateBody(createTodoSchema), createTodo);

export default router;
