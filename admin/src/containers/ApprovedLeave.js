import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchApprovedLeave } from "../actions/ApprovedLeave";
import ApprovedLeaveList from "../components/ApprovedLeave";

const BeatLoader = require("halogen/BeatLoader");

class ApprovedLeave extends Component {
  componentDidMount() {
    this.props.dispatch(fetchApprovedLeave());
  }

  render() {
    const { approved_items, isFetching, isAuthenticated } = this.props;

    return (
      <div className="container">
        {isAuthenticated &&
          (isFetching
            ? <div className="text-center">
                <BeatLoader color="#0275d8" size="12px" />
              </div>
            : <ApprovedLeaveList approved_items={approved_items} />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { approvedLeave, adminAuth } = state;
  const { isFetching, approved_items } = approvedLeave;
  const { isAuthenticated } = adminAuth;

  return { approved_items, isFetching, isAuthenticated };
};

export default connect(mapStateToProps)(ApprovedLeave);
