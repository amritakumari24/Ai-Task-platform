import os
import json
import redis
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv


load_dotenv("../backend/.env")


r = redis.Redis(
    host="127.0.0.1",
    port=6379,
    decode_responses=True
)


mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["ai-task-platform"]
tasks = db["tasks"]


def process_task(task):
    operation = task["operation"]
    text = task["inputText"]

    if operation == "uppercase":
        return text.upper()

    elif operation == "lowercase":
        return text.lower()

    elif operation == "reverse":
        return text[::-1]

    elif operation == "word_count":
        return len(text.split())

    else:
        raise ValueError("Invalid operation")


print("Python Worker Started. Waiting for tasks...")

while True:
    task_id = None

    try:
       
        item = r.brpop("task-queue", timeout=0)
        task_data = json.loads(item[1])

        task_id = task_data["taskId"]
        task = tasks.find_one({"_id": ObjectId(task_id)})

        if not task:
            print("Task not found:", task_id)
            continue

        tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "running"}}
        )

        result = process_task(task)

        tasks.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "success",
                    "result": result,
                    "error": None
                }
            }
        )

        print("Task completed:", task_id, "Result:", result)

    except Exception as error:
        print("Worker Error:", error)

        if task_id:
            tasks.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "failed",
                        "error": str(error)
                    }
                }
            )