import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

function TaskDetail() {
  const { taskId } = useParams({ from: "/projects/$id/tasks/$taskId" });
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/tasks?filters[documentId]=${taskId}&populate=*`);
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setTask(data.data[0]); // Flat structure
        } else {
          setError("Task not found");
        }
      } catch (err) {
        setError("Failed to fetch task");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!task) return <p>No task loaded</p>;

  return (
    <div className="task-detail">
      <h1>{task.title || "Untitled"}</h1>

      <p>Status: {task.taskStatus?.name || "Unknown"}</p>
      <p>Project: {task.project?.name || "Unknown"}</p>

      <p>
        Labels:{" "}
        {Array.isArray(task.labels) && task.labels.length > 0
          ? task.labels.map((label) => (
              <span key={label.id} className={`label ${label.name.toLowerCase()}`}>
                {label.name}
              </span>
            ))
          : "None"}
      </p>
      <a href="/projects">Back to Projects</a>
    </div>
  );
}

export default TaskDetail;
