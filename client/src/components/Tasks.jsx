import React, { useEffect, useState, useCallback } from "react";
import "./css/Tasks.css";
import Pagination from "./Pagination";
import StatusCard from "./StatusCard";
import AddTask from "./AddTask";
import TopBar from "./TopBar";

function Tasks({ selectedProject, setTasks, tasks }) {
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [searched, setSearched] = useState(false);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const buildTasksUrl = useCallback(() => {
    if (!selectedProject) return "";
    return `https://final-project-jarnedm.onrender.com//api/tasks?populate=*&filters[project][documentId][$eq]=${selectedProject.documentId}`;
  }, [selectedProject]);

  const fetchTasks = useCallback(async () => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      const res = await fetch(buildTasksUrl());
      const data = await res.json();

      if (Array.isArray(data?.data)) {
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
  }, [buildTasksUrl, setTasks, selectedProject]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = safeTasks.filter((task) => {
    if (!task?.title) return false;
    return task.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = () => {
    if (!searched) {
      setSearchTerm(searchInput);
      setSearched(true);
    } else {
      setSearchInput("");
      setSearchTerm("");
      setSearched(false);
    }
  };

  const handleTaskAdded = (createdTask) => {
    setTasks((prev) => [createdTask, ...prev]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="task-container">
      <header>
        <h2 className="task-header">{selectedProject ? `Task List for ${selectedProject.name || selectedProject}` : "Select a Project"}</h2>
      </header>

      <TopBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searched={searched}
        handleSearch={handleSearch}
        onAddTask={() => setShowAddTask(true)}
      />

      {loading ? (
        <p>Loading tasks...</p>
      ) : selectedProject ? (
        filteredTasks.length === 0 ? (
          <p className="no-tasks-message">No tasks found for this project.</p>
        ) : (
          <StatusCard selectedProject={selectedProject} tasks={filteredTasks} />
        )
      ) : (
        <p className="no-tasks-message">Please select a project</p>
      )}

      <AddTask show={showAddTask} onClose={() => setShowAddTask(false)} onTaskAdded={handleTaskAdded} fetchTasks={fetchTasks} />
    </div>
  );
}

export default Tasks;
