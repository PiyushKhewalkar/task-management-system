import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },
    dueDate: {
        type: Date, // Changed from String to Date for better querying
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // if every task must belong to a user
    }
}, {
    timestamps: true // created at and updated at
})

// MongoDB indexes for performance
taskSchema.index({ userId: 1 }); // Most important: find tasks by user
taskSchema.index({ userId: 1, status: 1 }); // Find tasks by user and status
taskSchema.index({ userId: 1, priority: 1 }); // Find tasks by user and priority
taskSchema.index({ userId: 1, dueDate: 1 }); // Find tasks by user and due date
taskSchema.index({ userId: 1, createdAt: -1 }); // Find tasks by user, newest first
taskSchema.index({ status: 1 }); // For global status queries (if needed)
taskSchema.index({ dueDate: 1 }); // For due date queries
taskSchema.index({ title: 'text', description: 'text' }); // Text search on title and description

const Task = mongoose.model("Task", taskSchema)

export default Task