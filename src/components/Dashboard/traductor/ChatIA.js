import React, { useState } from 'react';

const ChatAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isSending, setIsSending] = useState(false); // Controlar si la solicitud está en curso

    const handleSendMessage = async () => {
        if (!userInput.trim() || isSending) return; // No enviar si ya está en curso una solicitud

        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsSending(true); // Marcar que la solicitud está en curso

        try {
            const botResponse = await callOpenAIAPI(userInput);
            if (botResponse) {
                setMessages([...newMessages, { role: 'bot', content: botResponse }]);
            }
        } finally {
            setIsSending(false); // Finalizar la solicitud
        }
    };

    const callOpenAIAPI = async (userInput) => {
        const OPENAI_API_KEY = 'sk-proj-*****';

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`, // Corregir el formato del token de autorización
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: userInput }],
                }),
            });

            if (response.status === 429) {
                console.log('Demasiadas solicitudes, por favor intenta más tarde.');
                return null; // No reintentar para evitar múltiples solicitudes
            }

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error al llamar a la API de OpenAI:', error);
            return null; // Devolver null si hay un error
        }
    };

    return (
        <div id="chat-window">
            <div id="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                disabled={isSending} // Deshabilitar el input mientras se envía una solicitud
            />
            <button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? 'Enviando...' : 'Enviar'}
            </button>
        </div>
    );
};

export default ChatAssistant;