import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../spinners.css';

import { fetchUserDetailsIfNeeded } from '../actions/userdetails';
import { fetchUserRecordIfNeeded } from '../actions/userrecord';
import { UserRecord, RecordList } from '../components/userrecord';

class UserRecords extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      dispatch(fetchUserDetailsIfNeeded(auth_token));
      dispatch(fetchUserRecordIfNeeded(auth_token));
    }
  }

  render() {
    const {
      isFetching,
      isRecordFetching,
      user_detail,
      user_record,
      message
    } = this.props;

    return (
      <div className="UserRecords">
        {isFetching
          ? <div className="text-center">
              <div className="loader1" />
            </div>
          : <UserRecord user_detail={user_detail} message={message} />}
        {isRecordFetching
          ? <div className="text-center">
              <div className="loader1" />
            </div>
          : <RecordList user_record={user_record} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { userRecords, userAuth, userDetails } = state;
  const { auth_info } = userAuth;
  const { isFetching, userDetail: user_detail } = userDetails;
  const {
    isFetching: isRecordFetching,
    userRecord: user_record,
    message
  } = userRecords;

  return {
    auth_info,
    isFetching,
    isRecordFetching,
    user_record,
    message,
    user_detail
  };
};

export default connect(mapStateToProps)(UserRecords);
