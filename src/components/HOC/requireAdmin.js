import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export default function(ComponentToBeRendered) {

  class RequireAdmin extends Component {
    componentWillMount() {
      if (this.props.user.profile.role !== "Admin") {
        this.props.history.push('/dashboard');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user.profile.role !== "Admin") {
        this.props.history.push('/dashboard');
      }
    }

    render() {
      return (
        <ComponentToBeRendered {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      user: state.auth.user
    };
  }

  return withRouter(connect(mapStateToProps)(RequireAdmin));
}