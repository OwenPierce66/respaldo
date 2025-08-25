// src/SharedTask.js
import React from 'react';

const SharedTask = ({ task, onClose }) => {
  if (!task) {
    return null;
  }

  return (
    <div className="shared-task">
      <button onClick={onClose}>Cerrar</button>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      {task.image && <img src={task.image} alt="Task Image" />}
      {task.video && <video controls src={task.video}></video>}
      <ul>
        {task.subtasks.map((subtask) => (
          <li key={subtask.id}>
            <div>{subtask.title}</div>
            <div>{subtask.description}</div>
            {subtask.image && <img src={subtask.image} alt="Subtask Image" />}
            {subtask.video && <video controls src={subtask.video}></video>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharedTask;
