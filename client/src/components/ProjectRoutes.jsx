import { useParams } from "@tanstack/react-router";
import Tasks from "./Tasks";
import PaginatedBacklog from "./PaginatedBacklog";
// import TopBar from "./TopBar";
import AddTask from "./AddTask";
import React, { useState } from "react";
import AddLabel from "./AddLabel";

export function ProjectBoard() {
  const { id } = useParams({ strict: false });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [tasks, setTasks] = useState([]);

  console.log(tasks);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <>
      {/* <TopBar onAddTask={() => setShowAddTask(true)} onAddLabel={() => setShowAddLabel(true)} /> */}
      <Tasks selectedProject={id} tasks={tasks} setTasks={setTasks} />
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
