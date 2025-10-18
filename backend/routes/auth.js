import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";

const authRouter = Router()

authRouter.post("/register", validateRegister, register)
authRouter.post("/login", validateLogin, login)

export default authRouter