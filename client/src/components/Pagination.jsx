import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <button className="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        Previous
      </button>

      <span style={{ margin: "0 1rem" }}>
        Page {page} of {totalPages}
      </span>

      <button className="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        Next
      </button>
    </div>
  );
};

export default Pagination;
