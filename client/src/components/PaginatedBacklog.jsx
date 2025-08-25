import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import TopBar from "./TopBar";
import AddTask from "./AddTask";
import "./css/Backlog.css";

const PaginatedBacklog = ({ projectId }) => {
  const [projects, setProjects] = useState([]);
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState(false);

  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const fetchProjects = async (page) => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://final-project-jarnedm.onrender.com//api/projects?populate[tasks][populate]=taskStatus&pagination[page]=${page}&pagination[pageSize]=${pagination.pageSize}`
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

    fetchProjects(pagination.page);
  }, [pagination.page, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // build backlogTasks whenever projects or projectId changes
  useEffect(() => {
    if (!projects.length) return;

    const newBacklogTasks = [];

    projects.forEach((project) => {
      const projectTasks = project?.tasks || project?.attributes?.tasks?.data || [];

      projectTasks.forEach((task) => {
        if (task?.taskStatus?.name === "Backlog") {
          if (!projectId || project?.documentId === projectId || project?.attributes?.documentId === projectId) {
            newBacklogTasks.push({
              id: task.id,
              title: task.title || task.attributes?.title,
              documentId: task.documentId || task.attributes?.documentId,
              project: {
                name: project.name || project.attributes?.name,
              },
            });
          }
        }
      });
    });

    setBacklogTasks(newBacklogTasks);
  }, [projects, projectId]);

  const handleSearch = () => {
    if (!searched) {
      setSearchTerm(searchInput);
      setSearched(true);
    } else {
      setSearchInput("");
      setSearchTerm("");
      setSearched(false);
    }
  };

  const filteredTasks = backlogTasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleTaskAdded = (createdTask) => {
    setBacklogTasks((prev) => [createdTask, ...prev]);
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

      <TopBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searched={searched}
        handleSearch={handleSearch}
        onAddTask={() => setShowAddTask(true)}
      />

      {filteredTasks.length === 0 ? (
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
            {filteredTasks.map((task) => (
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

      <AddTask show={showAddTask} onClose={() => setShowAddTask(false)} onTaskAdded={handleTaskAdded} />
    </div>
  );
};

export default PaginatedBacklog;
