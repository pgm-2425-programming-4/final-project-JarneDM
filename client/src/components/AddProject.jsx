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
      const response = await fetch("https://final-project-jarnedm.onrender.com/api/projects", {
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
    <section className={`overlay ${show ? "" : "hidden"}`}>
      <form className="overlay-form" onSubmit={addProject}>
        <div className="form-group">
          <label htmlFor="project-name-input">Project Name</label>
          <input
            id="project-name-input"
            className="input-field"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="buttons">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            Add Project
          </button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddProject;
