import React, { useState, useEffect } from "react";
import axios from 'axios';

const Comment = ({ comment, onReply }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReply = () => {
        onReply(comment.id, replyText);
        setReplyText("");
        setShowReply(false);
    };

    return (
        <div style={{ marginLeft: "20px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
            <p>{comment.text}</p>
            <button onClick={() => setShowReply(!showReply)}>
                {showReply ? "Cancelar" : "Responder"}
            </button>
            {showReply && (
                <div>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                    />
                    <button onClick={handleReply}>Responder</button>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div>
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCommentText, setNewCommentText] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/comments/');
                console.log('Comments fetched:', response.data);  // Log the fetched comments
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    const handleReply = async (commentId, replyText) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/comments/', {
                text: replyText,
                parent: commentId
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("userTokenLG")}`
                }
            });

            console.log('Reply added:', response.data);  // Log the added reply

            // Add the new reply to the comments state
            setComments(prevComments => {
                const addReply = (comments, commentId, reply) => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                replies: [...comment.replies, reply]
                            };
                        } else if (comment.replies) {
                            return {
                                ...comment,
                                replies: addReply(comment.replies, commentId, reply)
                            };
                        }
                        return comment;
                    });
                };

                return addReply(prevComments, commentId, response.data);
            });
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleNewComment = async () => {
        const token = localStorage.getItem("userTokenLG");
        if (!token) {
            console.error('User token is missing');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/comments/', {
                text: newCommentText,
                parent: null
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            console.log('New comment added:', response.data);  // Log the added comment
            setComments([...comments, response.data]);
            setNewCommentText("");
        } catch (error) {
            console.error('Error adding new comment:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);  // Log the response data
            }
        }
    };




    if (loading) {
        return <div>Cargando comentarios...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escribe un nuevo comentario..."
                    style={{ width: "100%", height: "50px", marginBottom: "10px" }}
                />
                <button onClick={handleNewComment}>Comentar</button>
            </div>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <Comment key={comment.id} comment={comment} onReply={handleReply} />
                ))
            ) : (
                <div>No hay comentarios aún. ¡Sé el primero en comentar!</div>
            )}
        </div>
    );
};

export default CommentSection;
