const Task = require("../models/Task");
const taskQueue = require("../config/queue");
const addTaskToQueue = require("../config/queue");

const createTask = async (req, res) => {
  try {
    const { inputText, operation } = req.body;


    if (!inputText || !operation) {
      return res.status(400).json({
        message: "Please provide inputText and operation",
      });
    }


    const allowedOperations = [
      "uppercase",
      "lowercase",
      "reverse",
      "word_count",
    ];

    if (!allowedOperations.includes(operation)) {
      return res.status(400).json({
        message: "Invalid operation",
      });
    }

    const task = await Task.create({
      user: req.user._id,
      inputText,
      operation,
    });

  await addTaskToQueue({
  taskId: task._id.toString(),
});


console.log("Task added to Redis Queue!");

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      message: "Server error while creating task",
    });
  }
};



const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
};



const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });

  } catch (error) {
    console.error("Get Task Error:", error);

    return res.status(500).json({
      message: "Server error while fetching task",
    });
  }
};



const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      message: "Server error while deleting task",
    });
  }
};




module.exports = { createTask, getMyTasks, getTaskById, deleteTask };
