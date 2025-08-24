import React from "react";
import "./css/TopBar.css";

function TopBar({ searchInput, setSearchInput, searched, handleSearch, onAddTask }) {
  return (
    <nav className="topbar-nav">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="topbar-search"
      />
      <button id="search-btn" className="topbar-btn" onClick={handleSearch}>
        {searched ? "Clear Search" : "Search"}
      </button>

      <button id="add-task" className="topbar-btn" onClick={onAddTask}>
        + Add Task
      </button>
    </nav>
  );
}

export default TopBar;
