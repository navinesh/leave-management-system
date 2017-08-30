// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchSickSheetRecord } from '../actions/SickSheetRecord';
import SickSheetList from '../components/SickSheetRecord';

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  isFetching: boolean,
  sickSheet_items: Array<any>,
  dispatch: Function
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

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.dispatch(fetchSickSheetRecord());
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
          : <Redirect to="/login" />}
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
