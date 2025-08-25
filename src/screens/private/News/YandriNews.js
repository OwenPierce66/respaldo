import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import Notasdereunioncomitedecuencas from "./yandriHTML/not/Notasdereunioncomitedecuencas.html";
import deSeptiembre from "./yandriHTML/sep/deSeptiembre.html";
import YOIPRESTONALEX from "./yandriHTML/yoi/YOIPRESTONALEX.html";

export default class YandriNews extends Component {
    render() {
        return (
            <div className="column-wrapper">
                <NavLink to="/dashboard/news" className="column-link">
                    Go Back
            </NavLink>

                <div className="columns-title">
                    Yandri
                </div>
                <div className="news-para-wrapper">
                    <div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: Notasdereunioncomitedecuencas }}
                    />

                    <div className="columns-divider"></div>
                    <div className="columns-divider"></div>
                    <div className="columns-divider"></div>
                    <div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: deSeptiembre }}
                    />

                    <div className="columns-divider"></div>
                    <div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: YOIPRESTONALEX }}
                    />

                    <div className="columns-divider"></div>
                </div>
            </div>
        );
    }
}

