import { useParams } from "@tanstack/react-router";
import Tasks from "./Tasks";
import PaginatedBacklog from "./PaginatedBacklog";
import TopBar from "./TopBar";

export function ProjectBoard() {
  const { id } = useParams({ strict: false });
  return (
    <>
      {/* <TopBar /> */}
      <Tasks selectedProject={id} />
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
