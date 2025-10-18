import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getAllTasks, getTask, createTask, deleteTask, updateTask, getStats } from "../controllers/taskController.js";
import { validateTaskId, validateCreateTask, validateUpdateTask } from "../middleware/validation.js";

const taskRouter = Router()

taskRouter.get("/", auth, getAllTasks) // get all tasks of a user

taskRouter.get("/stats", auth, getStats) // get task stats

taskRouter.get("/:id", auth, validateTaskId, getTask) // get single tasks

taskRouter.post("/", auth, validateCreateTask, createTask) // create new task

taskRouter.put("/:id", auth, validateUpdateTask, updateTask) // update task

taskRouter.delete("/:id", auth, validateTaskId, deleteTask) // delete task

export default taskRouter