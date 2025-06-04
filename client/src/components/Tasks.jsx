import React, { useEffect, useState } from "react";

import Pagination from "./Pagination";

function Tasks({ selectedProject }) {
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
          `http://localhost:1337/api/tasks?populate[project]=true&populate[taskStatus]=true&pagination[page]=${page}&pagination[pageSize]=${pagination.pageSize}`
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

  const projectTasks = tasks.filter((task) => task.project?.name === selectedProject && task.taskStatus.name !== "Backlog");

  return (
    <>
      <div className="backlog-container">
        <h2 className="backlog-header">{selectedProject ? `Task List for ${selectedProject}` : "Select a Project"}</h2>

        {selectedProject ? (
          projectTasks.length === 0 ? (
            <p className="no-tasks-message">No tasks found for this project.</p>
          ) : (
            <table className="backlog-table">
              <thead>
                <tr>
                  <th className="table-header">Title</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((task) => (
                  <tr key={task.id} className="task-row">
                    <td className="task-title">{task.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <p className="no-tasks-message">Please select a project</p>
        )}

        <Pagination page={pagination.page} totalPages={Math.ceil(pagination.total / pagination.pageSize)} onPageChange={handlePageChange} />
      </div>
    </>
  );
}

export default Tasks;
