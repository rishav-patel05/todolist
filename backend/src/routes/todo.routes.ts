import { Router } from "express";
import {
  createTodoHandler,
  deleteTodoHandler,
  getStats,
  getTodos,
  reorderTodosHandler,
  updateTodoHandler
} from "../controllers/todo.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTodoSchema, listTodoQuerySchema, reorderSchema, updateTodoSchema } from "../validators/todo.validator";

const router = Router();

router.use(requireAuth);
router.get("/stats", getStats);
router.get("/", validate(listTodoQuerySchema, "query"), getTodos);
router.post("/", validate(createTodoSchema), createTodoHandler);
router.patch("/:id", validate(updateTodoSchema), updateTodoHandler);
router.delete("/:id", deleteTodoHandler);
router.patch("/reorder/all", validate(reorderSchema), reorderTodosHandler);

export default router;
