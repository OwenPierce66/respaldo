// GroupMessaging.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useParams, useHistory } from 'react-router-dom';
import '../owenscss/groupmessaging.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faUsers, faUserPlus, faUserMinus, faCrown } from '@fortawesome/free-solid-svg-icons';

const GroupMessaging = () => {
    const { groupId } = useParams();
    const history = useHistory();
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        fetchUser();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (groups.length > 0 && groupId) {
            const selectedGroupOption = groups.find(group => group.id.toString() === groupId);
            if (selectedGroupOption) {
                setSelectedGroup({ value: groupId, label: selectedGroupOption.name });
            }
        }
    }, [groupId, groups]);

    useEffect(() => {
        if (selectedGroup) {
            fetchMessages(selectedGroup.value);
        }
    }, [selectedGroup]);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("userTokenLG");
            const response = await axios.get('http://127.0.0.1:8000/api/get-user/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const userDetails = response.data;
            setUsuario(userDetails.user.id);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/massaging/groupss/', {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
            });
            setGroups(response.data);
            setLoadingGroups(false);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setLoadingGroups(false);
        }
    };

    const fetchMessages = async (groupId) => {
        try {
            setLoadingMessages(true);
            const response = await axios.get(`http://127.0.0.1:8000/massaging/groupss/${groupId}/messages/`, {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
            });
            setMessages(response.data.reverse());
            setLoadingMessages(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async () => {
        if (selectedGroup && (messageContent.trim() || selectedImage || selectedVideo)) {
            try {
                const token = localStorage.getItem("userTokenLG");
                const formData = new FormData();
                formData.append('content', messageContent);

                if (selectedImage) {
                    formData.append('image', selectedImage);
                }

                if (selectedVideo) {
                    formData.append('video', selectedVideo);
                }

                const response = await axios.post(`http://127.0.0.1:8000/massaging/groupss/${selectedGroup.value}/send_message/`, formData, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const newMessage = response.data;
                setMessages(prevMessages => [newMessage, ...prevMessages]);
                setMessageContent('');
                setSelectedImage(null);
                setSelectedVideo(null);
                setSelectedImagePreview(null);
                setVideoPreview(null);

                scrollToBottom();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleGroupChange = (group) => {
        setSelectedGroup(group);
        history.push(`/dashboard/groupmessaging/${group.value}`);
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

    const groupOptions = groups.map(group => ({
        value: group.id,
        label: group.name,
    }));

    return (
        <div className="group-messaging-container">
            <div className="header">
                <h1>Group Messaging</h1>
                {loadingGroups ? (
                    <p>Cargando grupos...</p>
                ) : (
                    <Select
                        options={groupOptions}
                        onChange={handleGroupChange}
                        placeholder="Select a group to message"
                        isClearable
                        value={selectedGroup}
                    />
                )}
                {selectedGroup && (
                    <p>Chateando en: {selectedGroup.label}</p>
                )}
            </div>

            <div className="messages" ref={messagesContainerRef}>
                {loadingMessages ? (
                    <p>Cargando mensajes...</p>
                ) : (
                    messages.length > 0 ? (
                        messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender.id === usuario ? 'sent' : 'received'}`}>
                                <p><strong>{message.sender.username}:</strong> {message.content}</p>
                                {message.image && (
                                    <img src={message.image} alt="Imagen" style={{ height: "100px", width: "100px" }} />
                                )}
                                {message.video && (
                                    <video controls style={{ height: "100px", width: "100px" }}>
                                        <source src={message.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
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
                <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message"
                />
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="fileInput">
                    <div className="fileIcon">
                        <FontAwesomeIcon icon={faImage} />
                        <FontAwesomeIcon icon={faVideo} />
                    </div>
                </label>
                <button onClick={handleSendMessage} disabled={!messageContent.trim() && !selectedImage && !selectedVideo}>Send</button>
            </div>
        </div>
    );
};

export default GroupMessaging;
