// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/UserLogin';
import LeaveCalendar from './LeaveCalendar';
import UserLogin from './UserLogin';

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean
};

class Main extends Component<Props> {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      dispatch(fetchLoginFromToken(auth_token));
    }
  }

  render() {
    return (
      <div className="Main">
        {!this.props.isAuthenticated ? (
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <LeaveCalendar />
              </div>
              <div className="col-md-4">
                <UserLogin />
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { userAuth } = state;
  const { auth_info, isAuthenticated } = userAuth;

  return { auth_info, isAuthenticated };
};

export default connect(mapStateToProps)(Main);
