import React, { useEffect, useState } from "react";
import "./css/Tasks.css";
import Pagination from "./Pagination";
import StatusCard from "./StatusCard";

function Tasks({ selectedProject, setTasks, tasks }) {
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    if (safeTasks.length === 0) {
      const fetchTasks = async () => {
        try {
          const res = await fetch(`http://localhost:1337/api/tasks?populate=*`);
          const data = await res.json();

          if (data?.data) {
            setTasks(data.data);
          } else {
            setError("Unexpected data format");
          }
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
          setError("Failed to fetch tasks");
        }
      };
      if (selectedProject) {
        fetchTasks();
      }
    }
  }, [setTasks, safeTasks.length, selectedProject]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="backlog-container">
      <h2 className="backlog-header">{selectedProject ? `Task List for ${selectedProject}` : "Select a Project"}</h2>

      {selectedProject ? (
        safeTasks.length === 0 ? (
          <p className="no-tasks-message">No tasks found for this project.</p>
        ) : (
          <StatusCard selectedProject={selectedProject} tasks={safeTasks} />
        )
      ) : (
        <p className="no-tasks-message">Please select a project</p>
      )}
    </div>
  );
}

export default Tasks;
