import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const BeatLoader = require("halogen/BeatLoader");

import { fetchLoginFromToken } from "../actions/AdminLogin";
import { fetchApprovedLeave } from "../actions/ApprovedLeave";
import { submitEditLeave } from "../actions/EditLeave";
import { submitDeleteLeave } from "../actions/DeleteLeave";
import ApprovedLeaveList from "../components/ApprovedLeave";

class ApprovedLeave extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem("admin_token");

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token, fetchApprovedLeave));
    }
  }

  render() {
    const {
      isAuthenticated,
      approved_items,
      isFetching,
      dispatch,
      isEditLeaveFetching,
      editLeaveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              : <ApprovedLeaveList
                  approved_items={approved_items}
                  dispatch={dispatch}
                  isEditLeaveFetching={isEditLeaveFetching}
                  editLeaveMessage={editLeaveMessage}
                  onEditLeaveSubmit={editLeaveData =>
                    dispatch(submitEditLeave(editLeaveData))}
                  onDeleteLeaveSubmit={deleteLeaveData =>
                    dispatch(submitDeleteLeave(deleteLeaveData))}
                />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, approvedLeave, editLeave } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, approved_items } = approvedLeave;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;

  return {
    auth_info,
    isAuthenticated,
    approved_items,
    isFetching,
    isEditLeaveFetching,
    editLeaveMessage
  };
};

export default connect(mapStateToProps)(ApprovedLeave);
