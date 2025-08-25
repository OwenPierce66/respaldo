import React, { useState, useRef, useEffect } from "react";

const TextoConVerMas = ({ title, description, tema }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpandButton, setNeedsExpandButton] = useState(false);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
            const maxHeight = lineHeight * 5; // 5 líneas de alto máximo
            if (descriptionRef.current.scrollHeight > maxHeight) {
                setNeedsExpandButton(true);
            }
        }
    }, [description]);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="textos">
            <div
                className="textosTitle"
                style={{ color: tema === "consejos" ? "white" : "black" }} // Cambio dinámico de color
            >
                {title}
            </div>
            <div
                ref={descriptionRef}
                className={`textosDescription ${isExpanded ? "expanded" : ""}`}
                style={{
                    maxHeight: isExpanded ? 'none' : '5.7em',
                    overflow: isExpanded ? 'visible' : 'hidden',
                    color: tema === "consejos" ? "#FFFFFF" : "#2699fb", // Cambio dinámico de color
                }}
            >
                {description}
            </div>
            {needsExpandButton && (
                <button onClick={handleToggleExpand} className="ver-mas-btn">
                    {isExpanded ? "Ver menos..." : "Ver más..."}
                </button>
            )}
        </div>
    );
};

export default TextoConVerMas;
