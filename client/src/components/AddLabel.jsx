import React, { useState } from "react";
import "./css/addTask.css";

function AddLabel({ show, onClose }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addLabel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("https://final-project-jarnedm.onrender.com//api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name } }),
      });
      if (!response.ok) throw new Error("Failed to add label");
      setName("");
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to add label");
      console.error("Error adding label:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;
  return (
    <section className={`overlay ${show ? "" : "hidden"}`}>
      <form className="overlay-form" onSubmit={addLabel}>
        <div className="form-group">
          <label htmlFor="label-name-input">Label Name</label>
          <input
            id="label-name-input"
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
            Add Label
          </button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddLabel;
