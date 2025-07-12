import React, { useEffect, useState } from "react";
import "./css/Projects.css";
import "./css/TopBar.css";
import AddProject from "./AddProject";

function SideBar({ onAddTask, onAddLabel }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        if (data?.data) {
          setProjects(data.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="projects-container">
      <div className="projects-sidebar">
        <a href="/about">ABOUT</a>
        <h3 className="projects-title">
          PROJECTS
          <span className="add-project" style={{ cursor: "pointer" }} onClick={() => setShowAddProject(true)}>
            +
          </span>
        </h3>
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id}>
              <a href={`/projects/${project.name}`}>{project.name}</a>
              <a href={`/projects/${project.name}/backlog`} style={{ marginLeft: 8, fontSize: "0.9em" }}>
                Backlog
              </a>
            </div>
          ))}
        </div>
        <div className="sidebar-actions">
          <button id="add-tsk" className="topbar-btn" onClick={onAddTask}>
            Add Task
          </button>
          <button id="add-label" className="topbar-btn" onClick={onAddLabel}>
            Add Label
          </button>
        </div>
        <AddProject
          show={showAddProject}
          onClose={() => setShowAddProject(false)}
          onProjectAdded={(newProject) => setProjects((prev) => [...prev, newProject])}
        />
      </div>
    </div>
  );
}

export default SideBar;
