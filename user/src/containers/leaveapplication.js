import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchUserDetailsIfNeeded } from "../actions/userdetails";
import { fetchLeaveApplication } from "../actions/leaveapplication";
import LeaveApplications from "../components/leaveapplication";
import { fetchPublicHoliday } from "../actions/publicholiday";

class LeaveApplication extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token;
    if (auth_token) {
      dispatch(fetchUserDetailsIfNeeded(auth_token));
    } else {
      auth_token = localStorage.getItem("auth_token");
      if (auth_token) {
        dispatch(fetchUserDetailsIfNeeded(auth_token));
      }
    }
    dispatch(fetchPublicHoliday());
  }

  render() {
    const {
      dispatch,
      isAuthenticated,
      message,
      isFetching,
      user_detail,
      public_holiday
    } = this.props;

    return (
      <div className="LeaveApplication">
        {isAuthenticated
          ? <LeaveApplications
              isFetching={isFetching}
              message={message}
              user_detail={user_detail}
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
  const { userAuth, leaveApplication, userDetails, publicHoliday } = state;
  const { isAuthenticated, auth_info } = userAuth;
  const { isFetching, message } = leaveApplication;
  const { userDetail: user_detail } = userDetails;
  const { public_holiday } = publicHoliday;

  return {
    isAuthenticated,
    message,
    isFetching,
    auth_info,
    user_detail,
    public_holiday
  };
};

export default connect(mapStateToProps)(LeaveApplication);
