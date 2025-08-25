import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import goFishing from "./chantelleHTML/letsGoFishing/letsgofishing.html"

export default class ChantelleNews extends Component {
  render() {
    return (
      <div className="column-wrapper">
        <NavLink to="/dashboard/news" className="column-link">
          Go Back
        </NavLink>
        <div className="columns-title">
          chantelle's column
        </div>


        <div
          className="column-content"
        />

        <div className="columns-divider"></div>

        <div className="news-para-wrapper">
          <p className="news-para">
            “The world will not be destroyed by those who do evil,
            but by those who watch them without doing anything.”
            - Albert Einstein
          </p>

          <p className="news-para">
            As the cancer of corruption continues to grow at an exponential rate in Mexico,
            becoming so loud and obvious as if attempting to become the norm.
            Government officials and police force seem to forget their call to protect and serve and focus on personal and political gain.
            Becoming a popular theme in television and music and targeting novelas and corridas both popular platforms among the masses.
            Its citizens no longer trust in its government to protect them or the best interest of the country.
          </p>

          <p className="news-para">
            <a className="news-para-link" href="http://www.openculture.com/2016/03/edmund-burkeon-in-action.html.">
              “The only thing necessary for the triumph of evil is for good men to do nothing.”
            </a> ― Edmund Burke
          </p>

          <p className="news-para">
            Mexican American Water Treaty
          </p>

          <a className="news-para-link" href="https://www.ibwc.gov/Files/1944Treaty.pdf">
            TREATY SERIES 994
          </a>

          <p className="news-para">
            In this time of uncertainty,
            desperate farmers of Chihuahua call upon Activist Adrian LeBaron Soto to join them in their protest and cry for justice.
            Farmers and citizens of Chihuahua are joining together to stand up and protect the reservoir water that rightfully belongs to them according to article 26 in the Mexican American water treaty of 1944. While The nation is under mandatory quarantine,
            the Mexican government affiliates conspire against its own citizens. Using “CONAGUA” a popular tool for legal extortion much like the “BARZONES”.


          </p>

          <p className="news-para">
            How does this affect LeBaron?
          </p>

          <p className="news-para">
            The Community of LeBaron and nearby communities are very familiar with these tactics. For generations,
            farmers have paid a high price for rendering rights and ignorantly legitimizing unconstitutional organizations and being led to believe that organizations like “CONAGUA” were the ultimate authority in water.
            Recent findings suggest that there are in fact options. Professionals suggesting delegitimizing such an organization.
          </p>

          <p className="news-para">
            “Do the best you can until you know better. Then when you know better, do better.”  ― Maya Angelou
          </p>

          <p className="news-para">
            Professionals are suggesting “Sub-Watershed Committee
          </p>

          <p className="news-para">
            As the LeBaron Movement for justice and peace has gained popularity in Mexico since 2009 and adding fuel to the flame with the recent activity in 2019. Through Tragedy and Devastation, Activists such as Adrian LeBaron Soto, Julian LeBaron Ray, Lenzo Widmar Stubbs, and Brian LeBaron Jones have risen from the ashes and call for unity and Justice.  LeBaron can no longer be ignored, gaining support from professionals that are suggesting an opportunity, a legitimate committee to delegate the water.  A “Sub-Comite de Cuencas” or a “Sub-Watershed Committee”.  With a team of professionals, it is possible to legally, responsibly, and peacefully delegate the watershed. This movement will require unity and effort from the whole tribe.
          </p>

          <p className="news-para">
            Let’s go fishing
          </p>

          <p className="news-para">
            There's an old Cuban saying about how a "river whose waters are rough rewards the fisherman [with a better catch] but no one says it better than Adrian LeBaron Soto.
          </p>

          <p className="news-para">
            There's an old Cuban saying about how a "river whose waters are rough rewards the fisherman [with a better catch] but no one says it better than Adrian LeBaron Soto.
          </p>

          <p className="news-para">
            <a href="https://anchor.fm/adrian-lebaron/episodes/Comit-de-Cuenca--Water-regulation-committee-ek0uuh" className="news-para-link">
              Comité de Cuencas
            </a> <br />
            By Adrian Lebaron
          </p>

        </div>

      </div>
    );
  }
}
