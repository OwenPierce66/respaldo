import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
    };
  }
  handleClickOutside() {
    this.setState({
      listOpen: false,
    });
  }
  toggleList() {
    this.setState((prevState) => ({
      listOpen: !prevState.listOpen,
    }));
  }
  render() {
    const { list, icon, title } = this.props;
    const { listOpen, headerTitle } = this.state;
    return (
      <div className="dropdown">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <FontAwesomeIcon className="link-icon" icon={icon} />
          <div className="dd-header-title">{title}</div>
          {listOpen ? (
            <FontAwesomeIcon className="dd-icon" icon="chevron-up" />
          ) : (
            <FontAwesomeIcon className="dd-icon" icon="chevron-down" />
          )}
        </div>
        {listOpen && (
          <div className="dd-list">
            {list.map((item) => (
              <Link to={item.location} className="dd-list-item">
                <p className="dd-title">{item.title}</p>
                <FontAwesomeIcon className="dd-list-icon" icon="chevron-right" />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
