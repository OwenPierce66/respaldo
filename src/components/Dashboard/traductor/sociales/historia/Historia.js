// Favoritos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Historia = () => {
    const [historia, setHistoria] = useState();

    useEffect(() => {

    }, []);
    //elejir cual rendereizar

    return (
        <div>
            <div><Consejos /></div>
            <div><Peticiones /></div>
            <div><Historia /></div>
        </div>
    );
};

export default Historia;
