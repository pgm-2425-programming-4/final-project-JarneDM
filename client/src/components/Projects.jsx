import React, { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("http://localhost:1337/api/projects");
      const data = await res.json();

      if (data?.data) {
        setProjects(data.data);
        console.log(projects);
      } else {
        setError("Unexpected data format");
      }
    };

    fetchProjects();
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h3>PROJECTS</h3>
      {/* BREAK LINE */}
      <div className="projects">
        {projects.map((project) => (
          <p>{project.name}</p>
        ))}
      </div>
    </>
  );
}

export default Projects;
