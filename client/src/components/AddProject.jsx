import React, { useState } from "react";
import "./css/addTask.css";

function AddProject({ show, onClose, onProjectAdded }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:1337/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name } }),
      });
      if (!response.ok) throw new Error("Failed to add project");
      const result = await response.json();
      setName("");
      if (onProjectAdded) onProjectAdded(result.data);
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to add project");
      console.error("Error adding project:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;
  return (
    <section className={`overlay${show ? "" : " hidden"}`} id="overlay-project">
      <form onSubmit={addProject}>
        <div className="task-title">
          <label htmlFor="project-name-input" className="task-title__label">
            Project Name
          </label>
          <input
            type="text"
            id="project-name-input"
            className="task-title__input"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="buttons">
          <button className="add-task-btn btn" type="submit" disabled={submitting}>
            Add
          </button>
          <button className="btn" type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Close
          </button>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </section>
  );
}

export default AddProject;
