import React, { useEffect, useState } from "react";
import "./css/Tasks.css";
import Pagination from "./Pagination";
import StatusCard from "./StatusCard";

function Tasks({ selectedProject, setTasks, tasks }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tasks.length === 0) {
      const fetchTasks = async () => {
        try {
          setLoading(true);
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
        } finally {
          setLoading(false);
        }
      };
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [setTasks, tasks.length]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="backlog-container">
      <h2 className="backlog-header">{selectedProject ? `Task List for ${selectedProject}` : "Select a Project"}</h2>

      {selectedProject ? (
        tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks found for this project.</p>
        ) : (
          <StatusCard selectedProject={selectedProject} tasks={tasks} />
        )
      ) : (
        <p className="no-tasks-message">Please select a project</p>
      )}
    </div>
  );
}

export default Tasks;
