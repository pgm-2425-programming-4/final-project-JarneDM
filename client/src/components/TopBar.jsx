import React from "react";

function TopBar() {
  const [categories, setCategories] = React.useState([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/categories?populate[tasks]=true`);
      const data = await res.json();

      if (data?.data) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  fetchTasks();
  return (
    <>
      <nav>
        <select name="category__dropdown" id="category__dropdown">
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </nav>
    </>
  );
}

export default TopBar;
