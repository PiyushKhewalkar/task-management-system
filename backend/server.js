import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectToDatabase from "./config/db.js"
import taskRouter from "./routes/tasks.js"
import authRouter from "./routes/auth.js"
import { errorHandler } from "./middleware/errorHandler.js"

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/tasks", taskRouter)
app.use("/api/auth", authRouter)

app.get("/", (req, res) =>{
    res.send("Task management app")
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen((PORT), async() => {
    console.log(`your app is listening at http://localhost:${PORT}`)
    await connectToDatabase()
})