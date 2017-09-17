// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchApprovedLeave } from '../actions/ApprovedLeave';
import { submitEditApprovedLeave } from '../actions/EditLeave';
import { submitCancelLeave } from '../actions/CancelLeave';
import ApprovedLeaveList from '../components/ApprovedLeave';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  approved_items: Array<any>,
  public_holiday: Array<any>,
  isFetching: boolean,
  dispatch: Function,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string
};

class ApprovedLeave extends Component<Props> {
  componentWillMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.dispatch(fetchApprovedLeave());
    }
  }

  render() {
    const {
      isAuthenticated,
      approved_items,
      public_holiday,
      isFetching,
      dispatch,
      isEditLeaveFetching,
      editLeaveMessage,
      isCancelLeaveFetching,
      cancelLeaveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          isFetching ? (
            <div className="text-center">
              <div className="loader1" />
            </div>
          ) : (
            <ApprovedLeaveList
              approved_items={approved_items}
              public_holiday={public_holiday}
              dispatch={dispatch}
              isEditLeaveFetching={isEditLeaveFetching}
              editLeaveMessage={editLeaveMessage}
              isCancelLeaveFetching={isCancelLeaveFetching}
              cancelLeaveMessage={cancelLeaveMessage}
              onEditApprovedLeaveSubmit={editLeaveData =>
                dispatch(submitEditApprovedLeave(editLeaveData))}
              onCancelLeaveSubmit={cancelLeaveData =>
                dispatch(submitCancelLeave(cancelLeaveData))}
            />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    adminAuth,
    approvedLeave,
    publicHoliday,
    editLeave,
    cancelLeave
  } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, approved_items } = approvedLeave;
  const { public_holiday } = publicHoliday;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;
  const { isCancelLeaveFetching, cancelLeaveMessage } = cancelLeave;

  return {
    auth_info,
    isAuthenticated,
    approved_items,
    public_holiday,
    isFetching,
    isEditLeaveFetching,
    editLeaveMessage,
    isCancelLeaveFetching,
    cancelLeaveMessage
  };
};

export default connect(mapStateToProps)(ApprovedLeave);
