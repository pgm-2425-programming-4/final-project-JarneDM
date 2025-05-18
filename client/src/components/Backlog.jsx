const Backlog = ({ tasks }) => (
  <ul>
    {tasks.map((task) => (
      <li key={task.id}>{task.attributes.title}</li>
    ))}
  </ul>
);

export default Backlog;
