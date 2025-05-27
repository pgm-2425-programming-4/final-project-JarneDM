import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedBacklog from "./components/PaginatedBacklog";
import Projects from "./components/Projects";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Projects />
      <QueryClientProvider client={queryClient}>
        <PaginatedBacklog />
      </QueryClientProvider>
    </>
  );
}

export default App;
