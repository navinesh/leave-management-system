// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import '../spinners.css';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchSickSheetRecord } from '../actions/SickSheetRecord';
import SickSheetList from '../components/SickSheetRecord';

class SickSheetRecord extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token, fetchSickSheetRecord));
    }
  }

  render() {
    const { isAuthenticated, isFetching, sickSheet_items } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <div className="loader1" />
                </div>
              : <SickSheetList sickSheet_items={sickSheet_items} />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, sickSheet } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, sickSheet_items } = sickSheet;

  return { auth_info, isAuthenticated, isFetching, sickSheet_items };
};

export default connect(mapStateToProps)(SickSheetRecord);
