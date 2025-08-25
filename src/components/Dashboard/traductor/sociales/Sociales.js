// Favoritos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PerfilesP from '../perfilesP';

const Sociales = () => {
    const [social, setSocial] = useState();
    const [tema, setTema] = useState("consejos");

    useEffect(() => {

    }, []);
    //elejir cual rendereizar

    const handleClick = (componentName) => {
        setTema(componentName);
    };

    const renderComponent = () => {
        switch (tema) {
            case "consejos":
                return <Consejos />;
            case "peticiones":
                return <Peticiones />;
            case "historia":
                return <Historia />;
            default:
                return null;
        }
    };

    return (
        <div>
            {/* <div><PerfilesP /></div> */}
            <div>
                <button
                    onClick={() => handleClick("consejos")}
                    style={{ display: tema === "consejos" ? "none" : "block" }}
                >
                    {tema === "consejos" ? "Consejos" : "consejos"}
                </button>
                <button
                    onClick={() => handleClick("peticiones")}
                    style={{ display: tema === "peticiones" ? "none" : "block" }}
                >
                    {tema === "peticiones" ? "Peticiones" : "peticiones"}
                </button>
                <button
                    onClick={() => handleClick("historia")}
                    style={{ display: tema === "historia" ? "none" : "block" }}
                >
                    {tema === "historia" ? "Historia" : "historia"}
                </button>
                <div>
                    {renderComponent()}
                </div>
            </div>
            {/* <button>consejos</button>
            <button>peticiones</button>
            <button>histoia</button>
            <div><Consejos /></div>
            <div><Peticiones /></div>
            <div><Historia /></div> */}
        </div>
    );
};

const Consejos = () => <div>Contenido de Consejos</div>;
const Peticiones = () => <div>Contenido de Peticiones</div>;
const Historia = () => <div>Contenido de Historia</div>;


export default Sociales;
