import User from "../models/user.js";
import Task from "../models/task.js";

export const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all tasks belonging to this user
    const tasks = await Task.find({ userId });

    // Return empty array if no tasks found (normal for new users)
    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        success: true,
        tasks: [],
      });
    }

    // Return tasks
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error); // Pass error to the centralized error handler
  }
};

export const getTask = async(req, res, next) => {
    try {

        const {id} = req.params

        const task = await Task.findById(id)

        if (!task) {
            // No tasks found — throw an error
            const error = new Error("No task found");
            error.statusCode = 404;
            return next(error);
          }

          res.status(200).json({
            success:true,
            task
          })
        
    } catch (error) {
        next(error)
    }
}

export const createTask = async(req, res, next) => {
    try {

        const {title, description, priority, status, dueDate} = req.body

        console.log(req.user)

        const userId = req.user.id

        const newTask = new Task({
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            userId
        })

        await newTask.save()

        res.status(201).json({
            success:true,
            newTask
          })
        
    } catch (error) {
        next(error)
    }
}

export const updateTask = async(req, res, next) => {
    try {

        const {id} = req.params

        const {title, description, priority, status, dueDate} = req.body

        const updateData = {
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined
        }

        // Remove undefined values to avoid overwriting with null
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        )

        const updatedTask = await Task.findByIdAndUpdate(id, updateData,
        { new: true, runValidators: true })

        res.status(200).json({
            success:true,
            updatedTask
          })
        
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async(req, res, next) => {
    try {

        const {id} = req.params

        const deletedTask = await Task.findByIdAndDelete(id)

        res.status(200).json({
            success: true
        })
        
    } catch (error) {
        next(error)
    }
}

export const getStats = async(req, res, next) => {
    try {

        const userId = req.user.id

        const tasks = await Task.find({userId})

        // Return zero stats if no tasks found (normal for new users)
        if (!tasks || tasks.length === 0) {
            return res.status(200).json({
                success: true,
                stats: {
                    totalTasks: 0,
                    completedTasks: 0,
                    pendingTasks: 0
                }
            });
        }

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === "completed").length;
        const pendingTasks = tasks.filter(
          (task) => task.status === "in-progress" || task.status === "todo"
        ).length;

        return res.status(200).json({
            success:true,
            stats:{
                totalTasks,
                completedTasks,
                pendingTasks
            }
        })
        
    } catch (error) {
        next(error)
    }
}