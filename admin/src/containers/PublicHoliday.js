import React, { Component } from "react";
import { connect } from "react-redux";

import PublicHolidays from "../components/PublicHoliday";
import { fetchPublicHoliday } from "../actions/PublicHoliday";
import { submitAddPublicHoliday } from "../actions/NewPublicHoliday";

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
      isPublicFetching,
      publicMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated &&
          <PublicHolidays
            public_holiday={public_holiday}
            dispatch={dispatch}
            isPublicFetching={isPublicFetching}
            publicMessage={publicMessage}
            onAddPublicHolidaySubmit={publicHolidayDate =>
              dispatch(submitAddPublicHoliday(publicHolidayDate))}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    publicHoliday,
    addPublicHoliday,
    adminAuth
  } = state;

  const { public_holiday } = publicHoliday;
  const { isPublicFetching, publicMessage } = addPublicHoliday;
  const { isAuthenticated } = adminAuth;

  return {
    public_holiday,
    isAuthenticated,
    isPublicFetching,
    publicMessage
  };
};

export default connect(mapStateToProps)(PublicHoliday);
