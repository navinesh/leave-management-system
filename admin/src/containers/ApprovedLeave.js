import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchApprovedLeave } from "../actions/ApprovedLeave";
import ApprovedLeaveList from "../components/ApprovedLeave";

const BeatLoader = require("halogen/BeatLoader");

class ApprovedLeave extends Component {
  componentDidMount() {
    this.props.dispatch(fetchApprovedLeave());
  }

  render() {
    const { isAuthenticated, approved_items, isFetching } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              : <ApprovedLeaveList approved_items={approved_items} />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, approvedLeave } = state;
  const { isAuthenticated } = adminAuth;
  const { isFetching, approved_items } = approvedLeave;

  return { isAuthenticated, approved_items, isFetching };
};

export default connect(mapStateToProps)(ApprovedLeave);
