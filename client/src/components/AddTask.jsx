import React, { useEffect } from "react";
import "./css/addTask.css";

function AddTask({ show, onClose, onTaskAdded }) {
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

  const handleLabelsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setNewTask((prev) => ({
      ...prev,
      labels: selectedOptions,
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
    <>
      <section className={`overlay ${show ? "" : " hidden"}`} id="overlay">
        <form onSubmit={addTask}>
          <div className="task-title">
            <label htmlFor="task-title__input" className="task-title__label">
              Title
            </label>
            <input
              type="text"
              id="task-title__input"
              className="task-title__input"
              name="title"
              value={newTask.title}
              onChange={handleChange}
            />
          </div>

          <div className="status">
            <label htmlFor="status__drop" className="status__label">
              Status
            </label>
            <select className="status__drop" name="taskStatus" id="status__drop" value={newTask.taskStatus} onChange={handleChange}>
              <option value="">Select status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name || status.id}
                </option>
              ))}
            </select>
          </div>

          <div className="project">
            <label htmlFor="project__drop" className="project__label">
              Project
            </label>
            <select className="project__drop" name="project" id="project__drop" value={newTask.project} onChange={handleChange}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || project.id}
                </option>
              ))}
            </select>
          </div>

          <div className="labels">
            <label htmlFor="labels__drop" className="labels__label">
              Label
            </label>
            <select className="labels__drop" name="labels" id="labels__drop" multiple value={newTask.labels} onChange={handleLabelsChange}>
              <option value="">Hold CTRL to select multiple</option>
              {labels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name || label.id}
                </option>
              ))}
            </select>
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
    </>
  );
}

export default AddTask;
