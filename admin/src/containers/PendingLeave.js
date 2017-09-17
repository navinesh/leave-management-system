// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchPendingLeave } from '../actions/PendingLeave';
import { fetchPublicHoliday } from '../actions/PublicHoliday';
import { submitApproveLeave } from '../actions/ApproveLeave';
import { submitDeclineLeave } from '../actions/DeclineLeave';
import { submitEditLeave } from '../actions/EditLeave';
import PendingLeaveList from '../components/PendingLeave';
import { Redirect } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  isFetching: boolean,
  pending_items: Array<any>,
  public_holiday: Array<any>,
  dispatch: Function,
  isApproveLeaveFetching: boolean,
  approveLeavemessage: string,
  isEditLeaveFetching: boolean,
  editLeaveMessage: string,
  isDeclineLeaveFetching: boolean,
  declineLeaveMessage: string
};

class PendingLeave extends Component<Props> {
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
      this.props.dispatch(fetchPendingLeave());
      this.props.dispatch(fetchPublicHoliday());
    }
  }

  render() {
    const {
      isAuthenticated,
      isFetching,
      pending_items,
      public_holiday,
      dispatch,
      isApproveLeaveFetching,
      approveLeavemessage,
      isEditLeaveFetching,
      editLeaveMessage,
      isDeclineLeaveFetching,
      declineLeaveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          isFetching ? (
            <div className="text-center">
              <div className="loader1" />
            </div>
          ) : (
            <PendingLeaveList
              pending_items={pending_items}
              public_holiday={public_holiday}
              dispatch={dispatch}
              isApproveLeaveFetching={isApproveLeaveFetching}
              approveLeavemessage={approveLeavemessage}
              isEditLeaveFetching={isEditLeaveFetching}
              editLeaveMessage={editLeaveMessage}
              isDeclineLeaveFetching={isDeclineLeaveFetching}
              declineLeaveMessage={declineLeaveMessage}
              onApproveLeaveSubmit={approveLeaveData =>
                dispatch(submitApproveLeave(approveLeaveData))}
              onDeclineLeaveSubmit={declineLeaveData =>
                dispatch(submitDeclineLeave(declineLeaveData))}
              onEditLeaveSubmit={editLeaveData =>
                dispatch(submitEditLeave(editLeaveData))}
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
    pendingLeave,
    publicHoliday,
    approveLeave,
    editLeave,
    declineLeave
  } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, pending_items } = pendingLeave;
  const { public_holiday } = publicHoliday;
  const { isApproveLeaveFetching, approveLeavemessage } = approveLeave;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;
  const { isDeclineLeaveFetching, declineLeaveMessage } = declineLeave;

  return {
    auth_info,
    isAuthenticated,
    isFetching,
    pending_items,
    public_holiday,
    isApproveLeaveFetching,
    approveLeavemessage,
    isEditLeaveFetching,
    editLeaveMessage,
    isDeclineLeaveFetching,
    declineLeaveMessage
  };
};

export default connect(mapStateToProps)(PendingLeave);
