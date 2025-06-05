import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedBacklog from "./components/PaginatedBacklog";
import { useState } from "react";
import Tasks from "./components/Tasks";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";

const queryClient = new QueryClient();

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <PaginatedBacklog /> */}
        <TopBar />
        <Tasks selectedProject={selectedProject} />
        <SideBar selectedProject={selectedProject} onSelectProject={setSelectedProject} />
      </QueryClientProvider>
    </>
  );
}

export default App;
