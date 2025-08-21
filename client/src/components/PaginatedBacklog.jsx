import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./css/Backlog.css";

const PaginatedBacklog = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchTasks = async (page) => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:1337/api/projects?populate[tasks][populate]=taskStatus&pagination[page]=${page}&pagination[pageSize]=${pagination.pageSize}`
        );

        const data = await res.json();

        if (data?.data) {
          setProjects(data.data);
          setPagination((prev) => ({
            ...prev,
            page: data.meta.pagination.page,
            total: data.meta.pagination.total,
            pageSize: data.meta.pagination.pageSize,
          }));
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks(pagination.page);
  }, [pagination.page, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    const backlogTasks = [];

    projects.forEach((project) => {
      // Strapi: taken zitten meestal in project.attributes.tasks.data
      const projectTasks = project?.tasks || [];
      const filteredTasks = projectTasks.filter((task) => task?.taskStatus?.name === "Backlog");

      if (!projectId || project?.name?.toLowerCase() === projectId.toLowerCase()) {
        backlogTasks.push(
          ...filteredTasks.map((task) => ({
            // Strapi: id en title zitten in task.id en task.attributes.title
            id: task.id,
            title: task.title || task.attributes.title,
            documentId: task.documentId || task.attributes.documentId,
            project: {
              name: project.name || project.attributes.name,
            },
          }))
        );
      }
    });

    setTasks(backlogTasks);
  }, [projects, projectId]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="backlog-container">
      <h2 className="backlog-header">Backlog Tasks</h2>

      {tasks.length === 0 ? (
        <p className="no-tasks-message">No backlog tasks found.</p>
      ) : (
        <table className="backlog-table">
          <thead>
            <tr>
              <th className="table-header">Title</th>
              <th className="table-header">Project</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="task-row"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = `/projects/${task.project.name}/tasks/${task.documentId}`)}
              >
                <td className="task-title">{task.title}</td>
                <td className="task-project">{task.project.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={pagination.page} totalPages={Math.ceil(pagination.total / pagination.pageSize)} onPageChange={handlePageChange} />
    </div>
  );
};

export default PaginatedBacklog;
