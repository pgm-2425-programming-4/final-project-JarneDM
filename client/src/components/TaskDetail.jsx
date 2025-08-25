import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import "./css/TaskDetail.css";

function TaskDetail() {
  const { taskId } = useParams({ from: "/projects/$id/tasks/$taskId" });

  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`https://final-project-jarnedm.onrender.com/api/tasks?filters[documentId]=${taskId}&populate=*`);
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          const t = data.data[0];
          setTask(t);
        } else {
          setError("Task not found");
        }
      } catch (err) {
        setError("Failed to fetch task");
        console.error(err);
      }
    };
    fetchTask();
  }, [taskId]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!task) return <p>No task loaded</p>;

  return (
    <div className="task-detail">
      <h2>{task.title}</h2>

      <p>
        <strong>Description:</strong> {task.description}
      </p>

      <p>
        <strong>Status:</strong>
        <span
          className={`task-status ${String(task.taskStatus?.name || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")}`}
        >
          {task.taskStatus?.name}
        </span>
      </p>

      <p>
        <strong>Project:</strong> {task.project?.name}
      </p>

      <p>
        <strong>Labels:</strong>{" "}
        {task.labels?.length > 0
          ? task.labels.map((label) => (
              <span key={label.id} className={`label ${label.name.toLowerCase()}`}>
                {label.name}{" "}
              </span>
            ))
          : "None"}
      </p>

      <div className="task-detail__actions">
        <a className="task-detail__button" href={`/projects/${task.project?.documentId}`}>
          Back to Projects
        </a>
        <a className="task-detail__button" href={`/projects/${task.project?.documentId}/tasks/${task.documentId}/edit`}>
          Edit Task
        </a>
      </div>
    </div>
  );
}

export default TaskDetail;
