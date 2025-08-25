import React, { Component } from "react";
import { css } from "@emotion/core";
import { BeatLoader } from "react-spinners";
// Can be a string as well. Need to ensure each key-value pair ends with ;

const bar = css`
  display: block;
  margin: 0 auto;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    return (
      <div className="sweet-loading">
        <BeatLoader
          css={bar}
          size={30}
          margin={10}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
