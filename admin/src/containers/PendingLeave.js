import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPendingLeave } from "../actions/PendingLeave";
import { fetchPublicHoliday } from "../actions/PublicHoliday";
import { submitApproveLeave } from "../actions/ApproveLeave";
import { submitDeclineLeave } from "../actions/DeclineLeave";
import { submitEditLeave } from "../actions/EditLeave";
import PendingLeaveList from "../components/PendingLeave";

const BeatLoader = require("halogen/BeatLoader");

class PendingLeave extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPendingLeave());
    this.props.dispatch(fetchPublicHoliday());
  }

  render() {
    const {
      isFetching,
      pending_items,
      isAuthenticated,
      public_holiday,
      dispatch,
      isEditLeaveFetching,
      editLeaveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated &&
          (isFetching
            ? <div className="text-center">
                <BeatLoader color="#0275d8" size="12px" />
              </div>
            : <PendingLeaveList
                pending_items={pending_items}
                public_holiday={public_holiday}
                dispatch={dispatch}
                isEditLeaveFetching={isEditLeaveFetching}
                editLeaveMessage={editLeaveMessage}
                onApproveLeaveSubmit={approveLeaveData =>
                  dispatch(submitApproveLeave(approveLeaveData))}
                onDeclineLeaveSubmit={declineLeaveData =>
                  dispatch(submitDeclineLeave(declineLeaveData))}
                onEditLeaveSubmit={editLeaveData =>
                  dispatch(submitEditLeave(editLeaveData))}
              />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { pendingLeave, adminAuth, publicHoliday, editLeave } = state;
  const { isFetching, pending_items } = pendingLeave;
  const { isAuthenticated } = adminAuth;
  const { public_holiday } = publicHoliday;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;

  return {
    isFetching,
    pending_items,
    isAuthenticated,
    public_holiday,
    isEditLeaveFetching,
    editLeaveMessage
  };
};

export default connect(mapStateToProps)(PendingLeave);
