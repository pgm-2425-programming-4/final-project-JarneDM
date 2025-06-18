import React from "react";
import "./css/TopBar.css";

function TopBar({ onAddTask, onAddLabel }) {
  return (
    <nav className="topbar-nav">
      <button id="add-tsk" className="topbar-btn" onClick={onAddTask}>
        Add Task
      </button>
      <button id="add-label" className="topbar-btn" onClick={onAddLabel}>
        Add Label
      </button>
    </nav>
  );
}

export default TopBar;
