// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/UserLogin';
import { fetchUserDetailsIfNeeded } from '../actions/UserDetails';
import { fetchUserRecordIfNeeded } from '../actions/UserRecord';
import { fetchLeaveApplication } from '../actions/LeaveApplication';
import LeaveApplications from '../components/LeaveApplication';
import { fetchPublicHoliday } from '../actions/PublicHoliday';

class LeaveApplication extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      dispatch(fetchLoginFromToken(auth_token));
      dispatch(fetchUserDetailsIfNeeded(auth_token));
      dispatch(fetchUserRecordIfNeeded(auth_token));
      dispatch(fetchPublicHoliday());
    }
  }

  render() {
    const {
      dispatch,
      isAuthenticated,
      message,
      isFetching,
      user_detail,
      user_record,
      public_holiday
    } = this.props;

    return (
      <div className="LeaveApplication">
        {isAuthenticated
          ? <LeaveApplications
              isFetching={isFetching}
              message={message}
              user_detail={user_detail}
              user_record={user_record}
              public_holiday={public_holiday}
              onLeaveApplicationClick={applicationDetails =>
                dispatch(fetchLeaveApplication(applicationDetails))}
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    userAuth,
    leaveApplication,
    userDetails,
    userRecords,
    publicHoliday
  } = state;

  const { auth_info, isAuthenticated } = userAuth;
  const { isFetching, message } = leaveApplication;
  const { userDetail: user_detail } = userDetails;
  const { userRecord: user_record } = userRecords;
  const { public_holiday } = publicHoliday;

  return {
    auth_info,
    isAuthenticated,
    message,
    isFetching,
    user_detail,
    user_record,
    public_holiday
  };
};

export default connect(mapStateToProps)(LeaveApplication);
