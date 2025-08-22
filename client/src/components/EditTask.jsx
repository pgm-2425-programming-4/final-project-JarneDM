import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import "./css/EditTask.css";

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:1337/api/tasks?filters[documentId]=${taskId}&populate=*`);
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
          fetch("http://localhost:1337/api/statuses"),
          fetch("http://localhost:1337/api/projects"),
          fetch("http://localhost:1337/api/labels"),
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

      const res = await fetch(`http://localhost:1337/api/tasks/${task.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      const res = await fetch(`http://localhost:1337/api/tasks/${deleteTask.documentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to delete task");
      }

      setTimeout(() => {
        location.href = `/projects/${task.project?.documentId}`;
      }, 100);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading || dropdownLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!task) return <p>No task loaded</p>;

  return (
    <div className="edit-task">
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input className="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>
          Status:
          <select value={statusId} onChange={(e) => setStatusId(e.target.value)}>
            <option value="">-- Select Status --</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Project:
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">-- Select Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Labels:
          <select
            multiple
            value={selectedLabels}
            onChange={(e) => setSelectedLabels(Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value)))}
          >
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          Current labels:{" "}
          {task.labels?.length > 0
            ? task.labels.map((label) => (
                <span key={label.id} className={`label ${label.name.toLowerCase()}`}>
                  {label.name}{" "}
                </span>
              ))
            : "None"}
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => setDeleteTask(task)} style={{ marginTop: "1rem", background: "red", color: "white" }}>
          Delete Task
        </button>
      </form>
      {deleteTask && (
        <div className=" pop-up delete-task">
          <p>Are you sure you want to delete this task?</p>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
          <button className="cancel-button" onClick={() => setDeleteTask(null)}>
            Cancel
          </button>
        </div>
      )}

      <a href={`/projects/${task.project?.documentId}`}>Back to Projects</a>
    </div>
  );
}

export default EditTask;
