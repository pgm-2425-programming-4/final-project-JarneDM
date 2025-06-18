import React from "react";

function TopBar({ onAddTask, onAddLabel }) {
  return (
    <nav>
      <button id="add-tsk" onClick={onAddTask}>
        Add Task
      </button>
      <button id="add-label" onClick={onAddLabel}>
        Add Label
      </button>
    </nav>
  );
}

export default TopBar;
