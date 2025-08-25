import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import TheTinyShop from "./businessHTML/TheTinyShop/TheTinyShop.html"
import TamarasBustaurant from "./businessHTML/tamara/TamarasBustaurant.html"
import MaquinadeNieve from "./businessHTML/maq/MaquinadeNieve.html"
import MangoRojo from "./businessHTML/maongorojo/MangoRojo.html"
import FoodTruck from "./businessHTML/foodtruck/FoodTruck.html"
import CentrorecreativodeLeBaron from "./businessHTML/Centro/CentrorecreativodeLeBaron.html"

export default class BusinessNews extends Component {
    render() {
        return (
            <div className="column-wrapper">
                <NavLink to="/dashboard/news" className="column-link">
                    Go Back
        </NavLink>
                <div className="columns-title">
                    Business
        </div>

                <div className="news-para-wrapper">

                    <div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: TheTinyShop }}
                    /><div className="columns-divider"></div><div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: TamarasBustaurant }}
                    /><div className="columns-divider"></div><div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: MaquinadeNieve }}
                    /><div className="columns-divider"></div><div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: MangoRojo }}
                    /><div className="columns-divider"></div><div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: FoodTruck }}
                    /><div className="columns-divider"></div><div
                        className="column-content"
                        dangerouslySetInnerHTML={{ __html: CentrorecreativodeLeBaron }}
                    /><div className="columns-divider"></div>
                </div>
            </div>
        );
    }
}
