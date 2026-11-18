
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Dashboard() {
  const { user, logout } = useAuth();

  const [inputText, setInputText] = useState("");
  const [operation, setOperation] = useState("uppercase");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data.tasks || response.data);
    } catch (err) {
      setError("Could not load tasks");
    }
  }, []);

  // Automatically fetch tasks every 2 seconds
  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchTasks]);

  const createTask = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await API.post("/tasks", { inputText, operation });
      setInputText("");
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError("Could not delete task");
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>AI Task Platform</h1>
        <div>
          <span>Welcome, {user?.name || "User"}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <section className="task-form">
          <h2>Create New Task</h2>

          <form onSubmit={createTask}>
            <textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />

            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="reverse">Reverse</option>
              <option value="word_count">Word Count</option>
            </select>

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Process Task"}
            </button>
          </form>
        </section>

        {error && <p className="error">{error}</p>}

        <section className="task-list">
          <h2>Your Tasks</h2>

          {tasks.map((task) => (
            <div className="task-card" key={task._id}>
              <p><strong>Input:</strong> {task.inputText}</p>
              <p><strong>Operation:</strong> {task.operation}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p>
                <strong>Result:</strong>{" "}
                {task.status === "success"
                  ? task.result
                  : task.status === "failed"
                  ? task.error || "Task failed"
                  : "Waiting..."}
              </p>

              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
