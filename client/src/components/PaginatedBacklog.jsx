import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./css/Backlog.css";

const PaginatedBacklog = () => {
  const [tasks, setTasks] = useState([]);
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
          `http://localhost:1337/api/tasks?populate[project]=true&populate[taskStatus]=true&filters[taskStatus][name][$eq]=Backlog&pagination[page]=${page}&pagination[pageSize]=${pagination.pageSize}`
        );

        const data = await res.json();

        if (data?.data) {
          setTasks(data.data);
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
                onClick={() =>
                  (window.location.href = `/projects/${task.project.name}/tasks/${task.documentId || task.attributes?.documentId}`)
                }
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
