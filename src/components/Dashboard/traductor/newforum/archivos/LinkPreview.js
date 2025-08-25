import React, { useState, useEffect } from 'react';

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        const fetchLinkPreview = async (url) => {
            try {
                const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                setPreviewData(data.data);  // Microlink devuelve los datos en el campo `data`
                console.log(data.data);  // Microlink devuelve los datos en el campo `data`
            } catch (error) {
                console.error("Error fetching link preview:", error);
            }
        };

        fetchLinkPreview(url);
    }, [url]);

    if (!previewData) return null;

    return (
        <div className="link-preview" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', maxWidth: '600px' }}>
            {previewData.image && previewData.image.url && (
                <img src={previewData.image.url} alt="preview" style={{ maxWidth: "100%", marginBottom: "10px" }} />
            )}
            <h3>{previewData.title}</h3>
            <p>{previewData.description}</p>
            <a href={previewData.url} target="_blank" rel="noopener noreferrer">
                {previewData.publisher || "Visit link"}
            </a>
        </div>
    );
};

export default LinkPreview;
