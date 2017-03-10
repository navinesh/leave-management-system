import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import PublicHolidays from "../components/PublicHoliday";
import { fetchPublicHoliday } from "../actions/PublicHoliday";
import { submitAddPublicHoliday } from "../actions/NewPublicHoliday";
import { submitDeletePublicHoliday } from "../actions/DeletePublicHoliday";

class PublicHoliday extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPublicHoliday());
  }

  render() {
    const {
      isAuthenticated,
      public_holiday,
      dispatch,
      isAddPublicFetching,
      addPublicMessage,
      isDeletePublicFetching,
      deletePublicMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? <PublicHolidays
              public_holiday={public_holiday}
              dispatch={dispatch}
              isAddPublicFetching={isAddPublicFetching}
              addPublicMessage={addPublicMessage}
              isDeletePublicFetching={isDeletePublicFetching}
              deletePublicMessage={deletePublicMessage}
              onAddPublicHolidaySubmit={publicHolidayDate =>
                dispatch(submitAddPublicHoliday(publicHolidayDate))}
              onDeletePublicHolidaySubmit={deletePublicHolidayDate =>
                dispatch(submitDeletePublicHoliday(deletePublicHolidayDate))}
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    adminAuth,
    publicHoliday,
    addPublicHoliday,
    deletePublicHoliday
  } = state;

  const { isAuthenticated } = adminAuth;
  const { public_holiday } = publicHoliday;
  const { isAddPublicFetching, addPublicMessage } = addPublicHoliday;
  const { isDeletePublicFetching, deletePublicMessage } = deletePublicHoliday;

  return {
    isAuthenticated,
    public_holiday,
    isAddPublicFetching,
    addPublicMessage,
    isDeletePublicFetching,
    deletePublicMessage
  };
};

export default connect(mapStateToProps)(PublicHoliday);
