import React from "react";

function TopBar({ onAddTask }) {
  return (
    <nav>
      <button id="add-tsk" onClick={onAddTask}>
        Add Task
      </button>
    </nav>
  );
}

export default TopBar;
