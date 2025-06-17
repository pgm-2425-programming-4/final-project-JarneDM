import React, { useState, useEffect } from "react";
import "./css/Tasks.css";

function StatusCard({ selectedProject }) {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const taskRes = await fetch("http://localhost:1337/api/tasks?populate=*");
        const taskData = await taskRes.json();

        const statRes = await fetch("http://localhost:1337/api/statuses");
        const statData = await statRes.json();

        if (taskData?.data && statData?.data) {
          setTasks(taskData.data);
          setStatuses(statData.data);
          setLabels(taskData.data.map((task) => task.labels?.name || []).flat());
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  if (loading) return <div>Loading task statuses...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredTasks = selectedProject
    ? tasks.filter((task) => {
        return task.project?.name && task.project.name.toLowerCase() === selectedProject.toLowerCase();
      })
    : tasks;

  console.log("Raw tasks:", tasks);
  console.log("Raw statuses:", statuses);
  console.log("Filtered tasks:", filteredTasks);
  console.log(labels);

  return (
    <div className="container">
      <div className="status-container">
        {statuses.map((status) => {
          const statusName = status.attributes?.name || status.name;

          const statusTasks = filteredTasks.filter((task) => {
            const taskStatusName = task.attributes?.taskStatus?.data?.attributes?.name || task.taskStatus?.name;
            console.log("Task title:", task.attributes?.title || task.title);
            console.log("Task status name:", taskStatusName, "vs", statusName);
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
                    <div key={task.id} className="task-card">
                      {(() => {
                        const title = task.attributes?.title || task.title;
                        return title.length > 20 ? title.slice(0, 20) + "..." : title;
                      })()}
                      {task.labels?.length > 0 ? (
                        <div className="task-labels">
                          {task.labels?.map((label) => (
                            <span key={label.id} className={`label ${label.name.toLowerCase()}`}>
                              {label.name}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
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
