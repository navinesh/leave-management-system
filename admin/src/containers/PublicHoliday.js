import React, { Component } from "react";
import { connect } from "react-redux";

import PublicHolidays from "../components/PublicHoliday";
import { fetchPublicHoliday } from "../actions/PublicHoliday";
import { submitAddPublicHoliday } from "../actions/NewPublicHoliday";
import { submitDeletePublicHoliday } from "../actions/DeletePublicHoliday";

class PublicHoliday extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPublicHoliday());
  }

  render() {
    const {
      public_holiday,
      isAuthenticated,
      dispatch,
      isAddPublicFetching,
      addPublicMessage,
      isDeletePublicFetching,
      deletePublicMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated &&
          <PublicHolidays
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
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    publicHoliday,
    addPublicHoliday,
    deletePublicHoliday,
    adminAuth
  } = state;

  const { public_holiday } = publicHoliday;
  const { isAddPublicFetching, addPublicMessage } = addPublicHoliday;
  const { isDeletePublicFetching, deletePublicMessage } = deletePublicHoliday;
  const { isAuthenticated } = adminAuth;

  return {
    public_holiday,
    isAuthenticated,
    isAddPublicFetching,
    addPublicMessage,
    isDeletePublicFetching,
    deletePublicMessage
  };
};

export default connect(mapStateToProps)(PublicHoliday);
