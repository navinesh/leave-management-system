import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import NewRecordForm from "../components/NewRecord";
import { submitNewUserRecord, clearNewUserRecord } from "../actions/NewRecord";

class NewRecord extends Component {
  componentWillUnmount() {
    this.props.dispatch(clearNewUserRecord());
  }

  render() {
    const {
      isAuthenticated,
      dispatch,
      message,
      isFetching
    } = this.props;

    return (
      <div className="NewRecord">
        {isAuthenticated
          ? <NewRecordForm
              isFetching={isFetching}
              message={message}
              dispatch={dispatch}
              onNewUserRecordSubmit={newUserDetails =>
                dispatch(submitNewUserRecord(newUserDetails))}
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, addUser } = state;
  const { isAuthenticated } = adminAuth;
  const { isFetching, message } = addUser;

  return { isAuthenticated, isFetching, message };
};

export default connect(mapStateToProps)(NewRecord);
