import { useParams } from "@tanstack/react-router";
import Tasks from "./Tasks";
import PaginatedBacklog from "./PaginatedBacklog";
import TopBar from "./TopBar";
import AddTask from "./AddTask";
import React, { useState } from "react";

export function ProjectBoard() {
  const { id } = useParams({ strict: false });
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <>
      <TopBar onAddTask={() => setShowAddTask(true)} />
      <Tasks selectedProject={id} />
      <AddTask show={showAddTask} onClose={() => setShowAddTask(false)} />
    </>
  );
}

export function ProjectBacklog() {
  const { id } = useParams({ strict: false });
  return (
    <>
      <TopBar />
      <PaginatedBacklog projectId={id} />
    </>
  );
}
