import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

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
          `http://localhost:1337/api/tasks?populate=taskStatus&pagination[page]=${page}&pagination[pageSize]=${pagination.pageSize}`
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

  const backlogTasks = tasks.filter((task) => task?.taskStatus?.name === "backlog");

  return (
    <div>
      <h2>Backlog Tasks</h2>

      {backlogTasks.length === 0 ? (
        <p>No backlog tasks found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {backlogTasks.map((task) => (
              <tr key={task.id}>
                <td className="taskTitle">{task.title}</td>
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
