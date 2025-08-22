import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import About from "./components/About";
import { ProjectBoard, ProjectBacklog } from "./components/ProjectRoutes";
import TaskDetail from "./components/TaskDetail";
import "./App.css";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import AddLabel from "./components/AddLabel";
import EditTask from "./components/EditTask";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Tasks,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const projectBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id",
  component: ProjectBoard,
});

const projectEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id/edit",
  component: () => <div>Edit Project Placeholder</div>,
});

const projectBacklogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id/backlog",
  component: ProjectBacklog,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id/tasks/$taskId",
  component: TaskDetail,
});

const editTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id/tasks/$taskId/edit",
  component: EditTask,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    aboutRoute,
    homeRoute,
    projectBoardRoute,
    projectBacklogRoute,
    taskDetailRoute,
    projectEditRoute,
    editTaskRoute,
  ]),
});

const queryClient = new QueryClient();

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SideBar onAddTask={() => setShowAddTask(true)} onAddLabel={() => setShowAddLabel(true)} />
      <div className="main-content">
        <RouterProvider router={router} />
      </div>
      <AddTask show={showAddTask} onClose={() => setShowAddTask(false)} onTaskAdded={() => {}} />
      <AddLabel show={showAddLabel} onClose={() => setShowAddLabel(false)} />
    </QueryClientProvider>
  );
}

export default App;
