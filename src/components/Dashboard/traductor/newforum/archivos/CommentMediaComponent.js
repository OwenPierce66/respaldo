// CommentMediaComponent.jsx
import React from 'react';

const CommentMediaComponent = ({ comment, imageSelect }) => {
    return (
        <div>
            {comment.image && (
                <img
                    src={comment.image}
                    alt="comment"
                    onClick={() => imageSelect(comment.image)}
                    className="imagenPeticion"
                    style={{ height: "100px", width: "100px" }}
                />
            )}
            {comment.video && (
                <video controls className="testimonial-video">
                    <source src={comment.video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default CommentMediaComponent;
