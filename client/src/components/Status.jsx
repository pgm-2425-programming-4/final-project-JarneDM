import React, { useEffect, useState } from "react";

function Status() {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://final-project-jarnedm.onrender.com//api/statuses`);
        const data = await res.json();

        if (data?.data) {
          setStatus(data.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) {
    return <div>Loading task statuses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="status-container">
        {status?.map((stat) => (
          <div className="status-row">
            <div className="status__title">{stat.name || "No status"}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Status;
