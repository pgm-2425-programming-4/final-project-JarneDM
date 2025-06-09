import React from "react";
import "./css/Tasks.css";

function StatusCard({ tasks, loading, error }) {
  if (loading) {
    return <div>Loading task statuses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="statusTitle">
      {tasks?.map((task) => (
        <div key={task.id}>{task.taskStatus?.name || "No status"}</div>
      ))}
    </div>
  );
}

export default StatusCard;
