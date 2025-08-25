import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import "./css/EditTask.css";
import "./css/overlay.css";

function EditTask() {
  const { taskId } = useParams({ from: "/projects/$id/tasks/$taskId" });

  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [statuses, setStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labels, setLabels] = useState([]);
  const [description, setDescription] = useState("");

  const [title, setTitle] = useState("");
  const [statusId, setStatusId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [deleteTask, setDeleteTask] = useState(null);

  const [newLabelName, setNewLabelName] = useState("");
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://final-project-jarnedm.onrender.com/api/tasks?filters[documentId]=${taskId}&populate=*`);
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          const t = data.data[0];
          setTask(t);
          setTitle(t.title || "");
          setDescription(t.description || "");
          setStatusId(t.taskStatus?.id || "");
          setProjectId(t.project?.id || "");
          setSelectedLabels(t.labels?.map((label) => label.id) || []);
        } else {
          setError("Task not found");
        }
      } catch (err) {
        setError("Failed to fetch task");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setDropdownLoading(true);
        const [statusesRes, projectsRes, labelsRes] = await Promise.all([
          fetch("https://final-project-jarnedm.onrender.com/api/statuses"),
          fetch("https://final-project-jarnedm.onrender.com/api/projects"),
          fetch("https://final-project-jarnedm.onrender.com/api/labels"),
        ]);
        const [statusesData, projectsData, labelsData] = await Promise.all([statusesRes.json(), projectsRes.json(), labelsRes.json()]);
        setStatuses(statusesData.data || []);
        setProjects(projectsData.data || []);
        setLabels(labelsData.data || []);
      } catch (err) {
        setError("Failed to fetch dropdown data");
        console.error(err);
      } finally {
        setDropdownLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        data: {
          title,
          description,
          taskStatus: statusId,
          project: projectId,
          labels: selectedLabels,
        },
      };

      const res = await fetch(`https://final-project-jarnedm.onrender.com/api/tasks/${task.documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to update task");
      }

      const updated = await res.json();
      setTask(updated.data);
      setTimeout(() => {
        location.href = `/projects/${task.project?.documentId}`;
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`https://final-project-jarnedm.onrender.com/api/tasks/${deleteTask.documentId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to delete task");
      }
      setTimeout(() => {
        location.href = `/projects/${task.project?.documentId}`;
      }, 100);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const res = await fetch(`https://final-project-jarnedm.onrender.com/api/labels/${labelId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to delete label");
      }
      // Remove from labels state & deselect from task if selected
      setLabels((prev) => prev.filter((label) => label.id !== labelId));
      setSelectedLabels((prev) => prev.filter((id) => id !== labelId));
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;
    try {
      const res = await fetch("https://final-project-jarnedm.onrender.com/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name: newLabelName } }),
      });
      if (!res.ok) throw new Error("Failed to add label");
      const newLabel = (await res.json()).data;
      setLabels((prev) => [...prev, newLabel]);
      setSelectedLabels((prev) => [...prev, newLabel.id]);
      setNewLabelName("");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading || dropdownLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!task) return <p>No task loaded</p>;

  return (
    <div className="edit-task">
      <form className="edit-task-form" onSubmit={handleSubmit}>
        <label className="edit-task-label">
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="edit-task-input" />
        </label>

        <label className="edit-task-label">
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="edit-task-textarea" />
        </label>

        <label className="edit-task-label">
          Status:
          <select value={statusId} onChange={(e) => setStatusId(e.target.value)} className="edit-task-select">
            <option value="">-- Select Status --</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="edit-task-label">
          Project:
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="edit-task-select">
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="edit-task-label">
          Add Labels:
          <select
            value=""
            onChange={(e) => {
              const labelId = parseInt(e.target.value);
              if (labelId && !selectedLabels.includes(labelId)) {
                setSelectedLabels((prev) => [...prev, labelId]);
              }
              e.target.value = "";
            }}
            className="edit-task-select"
          >
            <option value="">-- Select Label --</option>
            {labels
              .filter((l) => !selectedLabels.includes(l.id))
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </label>

        <div className="edit-task-selected-labels">
          Current labels:{" "}
          {selectedLabels.length > 0
            ? selectedLabels.map((id) => {
                const label = labels.find((l) => l.id === id);
                if (!label) return null;
                return (
                  <span key={id} className="edit-task-selected-label">
                    {label.name}{" "}
                    <button type="button" onClick={() => setSelectedLabels((prev) => prev.filter((lId) => lId !== id))}>
                      ×
                    </button>
                  </span>
                );
              })
            : "None"}
        </div>

        <div className="edit-task-add-label">
          <input
            type="text"
            placeholder="New label name"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            className="edit-task-add-label-input"
          />
          <button type="button" onClick={handleAddLabel} className="edit-task-add-label-button">
            Add Label
          </button>
        </div>

        <button type="button" className="edit-task-overlay-toggle" onClick={() => setShowLabels(!showLabels)}>
          Manage Labels &rarr;
        </button>

        {showLabels && (
          <div className="edit-task-label-overlay">
            <h3>All Labels</h3>
            {labels.length > 0 ? (
              labels.map((label) => (
                <span key={label.id} className="edit-task-selected-label">
                  {label.name}{" "}
                  <button className="delete-label" type="button" onClick={() => handleDeleteLabel(label.id)}>
                    Delete
                  </button>
                </span>
              ))
            ) : (
              <p>No labels available</p>
            )}
            <button className="close-overlay" type="button" onClick={() => setShowLabels(false)}>
              Close
            </button>
          </div>
        )}

        <button type="submit" className="edit-task-submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>

        <button type="button" className="edit-task-delete" onClick={() => setDeleteTask(task)}>
          Delete Task
        </button>
      </form>

      {deleteTask && (
        <div className="overlay-pop-up edit-task-delete-pop-up">
          <p>Are you sure you want to delete this task?</p>
          <div className="pop-up-buttons">
            <button className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn-cancel" onClick={() => setDeleteTask(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <a href={`/projects/${task.project?.documentId}`} className="edit-task-back-link">
        Back to Projects
      </a>
    </div>
  );
}

export default EditTask;
