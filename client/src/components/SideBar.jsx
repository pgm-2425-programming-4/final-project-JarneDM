import React, { useEffect, useState } from "react";
import "./css/Projects.css";
import "./css/TopBar.css";
import AddProject from "./AddProject";
import penIcon from "../assets/pen.png";
import closeImage from "../assets/close.png";
import deleteImage from "..//assets/bin.png";

function SideBar({ onAddTask, onAddLabel }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [deleteProject, setDeleteProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/projects`);
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
  }, [editingProject]);

  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const body = {
        data: {
          name: newProjectName,
        },
      };

      const res = await fetch(`http://localhost:1337/api/projects/${editingProject.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to update project");
      }

      const updated = await res.json();

      setProjects((prev) => prev.map((p) => (p.id === updated.data.id ? updated.data : p)));

      setEditingProject(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/projects/${deleteProject.documentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to delete task");
      }

      setTimeout(() => {
        location.href = `/projects`;
      }, 100);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Error: ${err.message}`);
    }
  };

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
          <table>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="icons project-td">
                    <img
                      className="edit-icon"
                      src={penIcon}
                      alt="Edit project"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditingProject(project);
                        setNewProjectName(project.name);
                      }}
                    />

                    <img className="delete-icon" onClick={() => setDeleteProject(project)} src={deleteImage} alt="Delete Project" />
                  </td>
                  <td className="project-td">
                    <a href={`/projects/${project.name}`}>{project.name}</a>
                  </td>

                  <td className="project-td">
                    <a className="project-backlog" href={`/projects/${project.name}/backlog`} style={{ marginLeft: 8, fontSize: "0.9em" }}>
                      Backlog
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingProject && (
          <div className="edit-project">
            <img
              className="close-icon"
              src={closeImage}
              alt="Close edit project"
              style={{ cursor: "pointer" }}
              onClick={() => setEditingProject(null)}
            />
            <label htmlFor="edit-project-name">Project Name</label>
            <input
              id="edit-project-name"
              name="edit-project-name"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button
              onClick={(e) => {
                handleEditProject(e);
                setEditingProject(null);
              }}
              type="submit"
            >
              Edit
            </button>
          </div>
        )}

        {deleteProject && (
          <div className="delete-project">
            <p>Are you sure you want to delete this project?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => setDeleteProject(null)}>Cancel</button>
          </div>
        )}

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
