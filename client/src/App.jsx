import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedBacklog from "./components/PaginatedBacklog";
import Projects from "./components/Projects";
import { useState } from "react";
import Tasks from "./components/Tasks";

const queryClient = new QueryClient();

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <PaginatedBacklog /> */}
        <Tasks selectedProject={selectedProject} />
        <Projects selectedProject={selectedProject} onSelectProject={setSelectedProject} />
      </QueryClientProvider>
    </>
  );
}

export default App;
