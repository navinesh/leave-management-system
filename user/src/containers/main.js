// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchLoginFromToken } from '../actions/userlogin';
import LeaveCalendar from './leavecalendar';
import UserLogin from './userlogin';
import UserRecord from './userrecord';

class Main extends Component {
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
    const { isAuthenticated } = this.props;
    return (
      <div className="Main">
        {isAuthenticated
          ? <UserRecord />
          : <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <LeaveCalendar />
                </div>
                <div className="col-md-4">
                  <UserLogin />
                </div>
              </div>
            </div>}
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
