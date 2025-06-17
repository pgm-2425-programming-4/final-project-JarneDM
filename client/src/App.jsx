import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import SideBar from "./components/SideBar";
import About from "./components/About";
import { ProjectBoard, ProjectBacklog } from "./components/ProjectRoutes";
import TaskDetail from "./components/TaskDetail";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <SideBar />
      <Outlet />
    </>
  ),
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

const router = createRouter({
  routeTree: rootRoute.addChildren([aboutRoute, projectBoardRoute, projectBacklogRoute, taskDetailRoute]),
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
