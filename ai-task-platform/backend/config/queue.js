const redis = require("./redis");

const addTaskToQueue = async (taskData) => {
  await redis.lpush("task-queue", JSON.stringify(taskData));
};

module.exports = addTaskToQueue;

