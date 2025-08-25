import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useParams, useHistory } from 'react-router-dom';
import '../owenscss/directmessagingg.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faHeart } from '@fortawesome/free-solid-svg-icons';

const DirectMessaging = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [visibleTranslatedMessages, setVisibleTranslatedMessages] = useState({});

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0 && userId) {
            const selectedUserOption = users.find(user => user.id.toString() === userId);
            if (selectedUserOption) {
                setSelectedUser({ value: userId, label: selectedUserOption.username });
            }
        }
    }, [userId, users]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.value, 1, true);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            filterMessages(selectedUser.value);
        } else {
            setFilteredMessages([]);
        }
    }, [messages, selectedUser]);

    useEffect(() => {
        if (!loadingMessages) {
            scrollToBottom();
        }
    }, [filteredMessages, loadingMessages]);

    useEffect(() => {
        const handleScroll = async () => {
            if (messagesContainerRef.current) {
                const { scrollTop } = messagesContainerRef.current;
                if (scrollTop === 0 && !loadingMoreMessages && hasMoreMessages) {
                    const currentHeight = messagesContainerRef.current.scrollHeight;
                    setLoadingMoreMessages(true);
                    await fetchMoreMessages();
                    setLoadingMoreMessages(false);
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - currentHeight;
                }
            }
        };

        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [loadingMoreMessages, hasMoreMessages]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("userTokenLG");
            const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
                headers: { Authorization: `Token ${token}` },
            });
            setUsuario(response.data.user.id);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsers(response.data);
            setLoadingUsers(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoadingUsers(false);
        }
    };

    const fetchMessages = async (userId, page, replace = false) => {
        try {
            setLoadingMessages(true);
            const url = `http://127.0.0.1:8000/massaging/messages/?user_id=${userId}&page=${page}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
            });

            const newMessages = response.data.reverse();
            setMessages(prevMessages => replace ? newMessages : [...newMessages, ...prevMessages]);

            if (newMessages.length < 10) { // Assume page size is 10
                setHasMoreMessages(false);
            }

            setLoadingMessages(false);
            setPage(page);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoadingMessages(false);
        }
    };

    const fetchMoreMessages = async () => {
        if (selectedUser) {
            await fetchMessages(selectedUser.value, page + 1);
        }
    };

    const filterMessages = (userId) => {
        const filtered = messages.filter(
            message => (
                message.sender.id.toString() === userId.toString() ||
                message.receiver.id.toString() === userId.toString()
            )
        );
        setFilteredMessages(filtered);
    };

    const handleSendMessage = async () => {
        if (selectedUser && (messageContent.trim() || selectedImage || selectedVideo)) {
            try {
                const token = localStorage.getItem("userTokenLG");
                const formData = new FormData();
                formData.append('receiver', selectedUser.value);
                formData.append('content', messageContent);
                formData.append('translated_content', translatedText); // Agregar contenido traducido

                if (selectedImage) {
                    formData.append('image', selectedImage);
                }

                if (selectedVideo) {
                    formData.append('video', selectedVideo);
                }

                const response = await axios.post('http://127.0.0.1:8000/massaging/messages/', formData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const newMessage = response.data;
                setMessages(prevMessages => {
                    if (!prevMessages.some(message => message.id === newMessage.id)) {
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });
                setMessageContent('');
                setTranslatedText(''); // Limpiar el texto traducido
                setSelectedImage(null);
                setSelectedVideo(null);
                setSelectedImagePreview(null);
                setVideoPreview(null);

                // Actualiza los mensajes filtrados inmediatamente
                setFilteredMessages(prevMessages => {
                    if (!prevMessages.some(message => message.id === newMessage.id)) {
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages;
                });

                // Scroll to the new message
                scrollToBottom();

            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleUserChange = (user) => {
        setSelectedUser(user);
        history.push(`/dashboard/direcmassaging/${user.value}`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type.split('/')[0];

        if (fileType === 'image') {
            setSelectedImage(file);
            setSelectedVideo(null);
            const imageURL = URL.createObjectURL(file);
            setSelectedImagePreview(imageURL);
            setVideoPreview(null);
        } else if (fileType === 'video') {
            setSelectedVideo(file);
            setSelectedImage(null);
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
            setSelectedImagePreview(null);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const translateText = async (text) => {
        setMessageContent(text); // Actualiza el contenido original
        const apiKey = "AIzaSyA1pr1L0zW8cv6TNwadyjFHqUhh11POuAQ";
        const targetLanguage = "es";
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage,
                }),
            });
            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;
            setTranslatedText(translatedText);
        } catch (error) {
            console.error("Error al traducir el texto:", error);
        }
    };

    const handleContentClick = (messageId) => {
        setVisibleTranslatedMessages(prevState => ({
            ...prevState,
            [messageId]: !prevState[messageId]
        }));
    };

    const userOptions = users.map(user => ({
        value: user.id,
        label: user.username,
    }));

    const handleLikeClick = async (messageId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/massaging/messages/${messageId}/like/`, {}, {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
            });

            setMessages(prevMessages =>
                prevMessages.map(message =>
                    message.id === messageId ? { ...message, user_has_liked: !message.user_has_liked, likes_count: message.user_has_liked ? message.likes_count - 1 : message.likes_count + 1 } : message
                )
            );
        } catch (error) {
            console.error('Error liking/unliking message:', error);
        }
    };

    return (
        <div className="direct-messaging-container">
            <div className="header">
                <h1>Direct Messaging</h1>
                {loadingUsers ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <Select
                        options={userOptions}
                        onChange={handleUserChange}
                        placeholder="Select a user to message"
                        isClearable
                        value={selectedUser}
                    />
                )}
                {selectedUser && (
                    <p>Chateando con: {selectedUser.label}</p>
                )}
            </div>


            <div className="messages" ref={messagesContainerRef}>
                {loadingMessages ? (
                    <p>Cargando mensajes...</p>
                ) : (
                    filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                            <div key={message.id} className={`message ${message.sender.id === usuario ? 'sent' : 'received'}`}>
                                <p>
                                    <div style={{ display: "flex", flexDirection: "column" }}>

                                        <strong>{message.sender.username} ({message.sender.id}) to {message.receiver.username} ({message.receiver.id}):</strong>
                                        {visibleTranslatedMessages[message.id] && (
                                            <span>{message.translated_content}</span>
                                        )}
                                        <span onClick={() => handleContentClick(message.id)} style={{ cursor: 'pointer' }}>
                                            {message.content}
                                        </span>
                                    </div>
                                </p>
                                {message.image && (
                                    <img src={message.image} alt="Imagen" style={{ height: "100px", width: "100px" }} />
                                )}
                                {message.video && (
                                    <video controls style={{ height: "100px", width: "100px" }}>
                                        <source src={message.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="like-container" onClick={() => handleLikeClick(message.id)}>
                                    <FontAwesomeIcon icon={faHeart} style={{ color: message.user_has_liked ? 'red' : 'grey' }} />
                                    <span>{message.likes_count}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay mensajes para mostrar</p>
                    )
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                {selectedImagePreview && (
                    <img src={selectedImagePreview} alt="Imagen seleccionada" style={{ height: "100px", width: "100px" }} />
                )}
                {videoPreview && (
                    <video src={videoPreview} controls style={{ height: "100px", width: "100px" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <p style={{ paddingLeft: "15px", paddingRight: "15px" }}>{translatedText}</p>

                    </div>

                    <textarea
                        value={messageContent}
                        onChange={(e) => translateText(e.target.value)}
                        placeholder="Type your message"
                    />
                </div>

                <input
                    type="file"
                    id="fileInput"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="fileInput">
                    <div className="imagenIcon">
                        <FontAwesomeIcon icon={faImage} />
                    </div>
                </label>
                <button onClick={handleSendMessage} disabled={!messageContent.trim() && !selectedImage && !selectedVideo}>Send</button>
            </div>
        </div>
    );
};

export default DirectMessaging;
