import { useParams } from "@tanstack/react-router";
import Tasks from "./Tasks";
import PaginatedBacklog from "./PaginatedBacklog";
import AddTask from "./AddTask";
import React, { useState, useEffect } from "react";
import AddLabel from "./AddLabel";

export function ProjectBoard() {
  const { id } = useParams({ strict: false });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/projects/${id}?populate=*`);
        const data = await res.json();
        if (data.data) {
          // Unwrap attributes for easier access
          setSelectedProject({
            id: data.data.id,
            ...data.data,
          });
        } else {
          setSelectedProject(null);
        }
      } catch (err) {
        setSelectedProject(null);
        console.error(err);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchTasks = async () => {
      try {
        // Correct Strapi filter for project
        const res = await fetch(
          `http://localhost:1337/api/tasks?populate=*&filters[project][documentId][$eq]=${selectedProject.documentId}`
        );
        const data = await res.json();
        setTasks(data.data);
        console.log(data);
      } catch (err) {
        setTasks([]);
        console.error(err);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  console.log(selectedProject);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <>
      {/* <TopBar onAddTask={() => setShowAddTask(true)} onAddLabel={() => setShowAddLabel(true)} /> */}
      <Tasks selectedProject={selectedProject} tasks={tasks} setTasks={setTasks} />
      <AddTask show={showAddTask} onClose={() => setShowAddTask(false)} onTaskAdded={handleTaskAdded} />
      <AddLabel show={showAddLabel} onClose={() => setShowAddLabel(false)} />
    </>
  );
}

export function ProjectBacklog() {
  const { id } = useParams({ strict: false });
  return (
    <>
      {/* <TopBar /> */}
      <PaginatedBacklog projectId={id} />
    </>
  );
}
