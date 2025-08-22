import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import "./css/Tasks.css";

function StatusCard({ selectedProject, tasks }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const statRes = await fetch("http://localhost:1337/api/statuses");
        const statData = await statRes.json();
        if (statData?.data) {
          setStatuses(statData.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        setError("Failed to fetch statuses: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, []);

  if (loading) return <div>Loading task statuses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="status-container">
        {statuses
          .filter((status) => {
            const statusName = status.attributes?.name || status.name;
            return statusName !== "Backlog";
          })
          .map((status) => {
            const statusName = status.attributes?.name || status.name;
            const statusTasks = tasks.filter((task) => {
              const taskStatusName = task.taskStatus?.name || task.taskStatus?.data?.attributes?.name || task.taskStatus;
              return taskStatusName === statusName;
            });

            return (
              <div key={status.id} className="status-column">
                <h3>{statusName}</h3>
                <div className="task-cards">
                  {statusTasks.length === 0 ? (
                    <div className="no-tasks">No tasks</div>
                  ) : (
                    statusTasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/projects/${selectedProject.documentId}/tasks/${task.documentId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="task-card">
                          {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
                          {task.labels?.length > 0 ? (
                            <div className="task-labels">
                              {task.labels.map((label) => (
                                <span key={label.id} className={`label ${label.name.toLowerCase()}`}>
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StatusCard;
