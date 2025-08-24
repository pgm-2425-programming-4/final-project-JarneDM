import React, { useEffect } from "react";
import "./css/addTask.css";

function AddTask({ show, onClose, onTaskAdded, fetchTasks }) {
  const [newTask, setNewTask] = React.useState({
    title: "",
    taskStatus: "",
    project: "",
    labels: [],
  });
  const [statuses, setStatuses] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [error, setError] = React.useState(null);

  const [dropdownLoading, setDropdownLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [statusesRes, projectsRes, labelsRes] = await Promise.all([
          fetch("http://localhost:1337/api/statuses"),
          fetch("http://localhost:1337/api/projects"),
          fetch("http://localhost:1337/api/labels"),
        ]);
        const [statusesData, projectsData, labelsData] = await Promise.all([statusesRes.json(), projectsRes.json(), labelsRes.json()]);
        setStatuses(statusesData?.data || []);
        setProjects(projectsData?.data || []);
        setLabels(labelsData?.data || []);
      } catch (err) {
        setError("Failed to fetch dropdown data", err);
      } finally {
        setDropdownLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name || !value) {
      console.alert("Please fill in all fields");
      return;
    }
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: newTask.title,
        taskStatus: newTask.taskStatus ? { connect: [Number(newTask.taskStatus)] } : null,
        project: newTask.project ? { connect: [Number(newTask.project)] } : null,
        labels: newTask.labels.map((id) => ({ id: Number(id) })),
      };

      const response = await fetch("http://localhost:1337/api/tasks?populate=*", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const result = await response.json();
      const createdTask = result.data;

      onTaskAdded(createdTask);
      setNewTask({ title: "", taskStatus: "", project: "", labels: [] });
      fetchTasks();
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to add task");
      console.error("Error adding task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (dropdownLoading) {
    return <div>Loading tasks...</div>;
  }
  if (submitting) {
    return <div>Submitting tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!show) return null;
  return (
    <section className={`overlay ${show ? "" : "hidden"}`}>
      <form className="overlay-form" onSubmit={addTask}>
        <div className="form-group">
          <label htmlFor="task-title-input">Title</label>
          <input
            id="task-title-input"
            className="input-field"
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-status-select">Status</label>
          <select id="task-status-select" className="select-field" name="taskStatus" value={newTask.taskStatus} onChange={handleChange}>
            <option value="">Select status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name || status.id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="project-select">Project</label>
          <select id="project-select" className="select-field" name="project" value={newTask.project} onChange={handleChange}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name || project.id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="labels-select">Labels</label>
          <select
            id="labels-select"
            className="edit-task-select"
            value=""
            onChange={(e) => {
              const labelId = parseInt(e.target.value);
              if (labelId && !newTask.labels.includes(labelId)) {
                setNewTask((prev) => ({
                  ...prev,
                  labels: [...prev.labels, labelId],
                }));
              }
              e.target.value = "";
            }}
          >
            <option value="">-- Select Label --</option>
            {labels
              .filter((l) => !newTask.labels.includes(l.id))
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>

          <div className="selected-labels">
            {newTask.labels.length > 0
              ? newTask.labels.map((id) => {
                  const label = labels.find((l) => l.id === id);
                  if (!label) return null;
                  return (
                    <span key={id} className="label-pill">
                      {label.name}
                      <button
                        type="button"
                        className="remove-label-btn"
                        onClick={() =>
                          setNewTask((prev) => ({
                            ...prev,
                            labels: prev.labels.filter((lId) => lId !== id),
                          }))
                        }
                      >
                        ×
                      </button>
                    </span>
                  );
                })
              : "No labels"}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="buttons">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            Add Task
          </button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddTask;
