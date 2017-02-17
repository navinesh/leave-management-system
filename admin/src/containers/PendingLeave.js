import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPendingLeave } from "../actions/PendingLeave";
import { fetchPublicHoliday } from "../actions/PublicHoliday";
import PendingLeaveList from "../components/PendingLeave";

const BeatLoader = require("halogen/BeatLoader");

class PendingLeave extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPendingLeave());
    dispatch(fetchPublicHoliday());
  }

  render() {
    const {
      isFetching,
      pending_items,
      isAuthenticated,
      public_holiday
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
              />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { pendingLeave, adminAuth, publicHoliday } = state;
  const { isFetching, pending_items } = pendingLeave;
  const { isAuthenticated } = adminAuth;
  const { public_holiday } = publicHoliday;

  return { isFetching, pending_items, isAuthenticated, public_holiday };
};

export default connect(mapStateToProps)(PendingLeave);
