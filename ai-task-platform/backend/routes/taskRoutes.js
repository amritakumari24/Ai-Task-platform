const express = require("express");
const router = express.Router();

const { createTask, getMyTasks, getTaskById, deleteTask } = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createTask);
router.get("/", protect, getMyTasks);
router.get("/:id", protect, getTaskById);
router.delete("/:id", protect, deleteTask);

module.exports = router;
