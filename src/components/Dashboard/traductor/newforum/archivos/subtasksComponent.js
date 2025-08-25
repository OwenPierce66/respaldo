// SubtasksComponent.jsx
import React from 'react';

const SubtasksComponent = ({ subtasks }) => {
    return (
        <div className="subtasks-container">
            {subtasks.map(subtask => (
                <div key={subtask.id} className="subtask">
                    <div>{subtask.title}</div>
                    <div>{subtask.description}</div>
                    {subtask.image && (
                        <img src={subtask.image} alt="Subtask" style={{ marginLeft: "4px", width: '336px', height: '336px' }} />
                    )}
                    {subtask.video && (
                        <video controls className="testimonial-video" style={{ marginLeft: "4px", width: '200px', height: '333px' }}>
                            <source src={subtask.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SubtasksComponent;
