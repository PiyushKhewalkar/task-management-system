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
// ✅ Configure allowed origins
const allowedOrigins = [
    "http://localhost:5173",   // local frontend
    "https://task-management-system-pearl-nine.vercel.app/", // production frontend,
    "https://tms.billiondollardevs.com"
  ];
  
  // ✅ Middleware with CORS options
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you need cookies or auth headers
  }));
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