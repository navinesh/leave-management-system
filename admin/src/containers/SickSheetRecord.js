// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { graphql, gql, compose } from 'react-apollo';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import SickSheetList from '../components/SickSheetRecord';

const SICK_RECORD = gql`
  {
    findSicksheetRecord {
      id
      startDate
      endDate
      leaveDays
      datePosted
      fileName
      user {
        othernames
        surname
      }
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  sickRecord: Object
};

class SickSheetRecord extends Component<Props> {
  componentWillMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  render() {
    const {
      isAuthenticated,
      sickRecord: { loading, error, findSicksheetRecord: sickSheet_items }
    } = this.props;

    if (loading) {
      return (
        <div className="text-center">
          <div className="loader1" />
        </div>
      );
    }

    if (error) {
      console.log(error);
      return (
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      );
    }

    return (
      <div className="container">
        {isAuthenticated ? (
          <SickSheetList sickSheet_items={sickSheet_items} />
        ) : (
          <Redirect to="/login" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { auth_info, isAuthenticated } = adminAuth;

  return { auth_info, isAuthenticated };
};

export default compose(
  connect(mapStateToProps),
  graphql(SICK_RECORD, { name: 'sickRecord' })
)(SickSheetRecord);
