import { Router } from "express";
import { createTodo, getTodos, updateTodo } from "../controllers/todo.controller.js";
import { validateBody, validateId } from "../middleware/validate.js";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo.schema.js";

const router = Router();

router.get("/", getTodos);
router.post("/", validateBody(createTodoSchema), createTodo);
router.put("/:id", validateId, validateBody(updateTodoSchema), updateTodo);

export default router;
