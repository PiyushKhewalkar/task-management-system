import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// MongoDB indexes for performance
userSchema.index({ email: 1 }); // Already unique, but explicit for clarity
userSchema.index({ name: 1 }); // For name-based searches

const User = mongoose.model("User", userSchema)

export default User