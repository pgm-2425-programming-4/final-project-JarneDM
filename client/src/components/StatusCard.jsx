import React, { useState, useEffect } from "react";
import "./css/Tasks.css";

function StatusCard() {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // http://localhost:1337/api/statuses?populate[tasks]=true

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:1337/api/statuses?populate[tasks]=true`);
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
    <div className="status-container">
      {status?.map((stat) => (
        <div key={stat.id} className="status-card">
          <div className="status__title" key={stat.id}>
            {stat.name || " No status"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusCard;
