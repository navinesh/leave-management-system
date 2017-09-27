// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { graphql, gql, compose } from 'react-apollo';

import { fetchLoginFromToken } from '../actions/UserLogin';

import { fetchLeaveApplication } from '../actions/LeaveApplication';
import LeaveApplications from '../components/LeaveApplication';

import configureStore from '../stores/ConfigureStore';
const store = configureStore();

const User_Detail = gql`
  query($id: Int) {
    findUser(id: $id) {
      othernames
      surname
      annual
      sick
      bereavement
      christmas
      maternity
      gender
    }
  }
`;

const User_Record = gql`
  query($id: Int) {
    findUser(id: $id) {
      leaverecord {
        edges {
          node {
            id
            leaveName
            leaveDays
            startDate
            endDate
            leaveReason
            leaveStatus
          }
        }
      }
    }
  }
`;

const Public_Holiday = gql`
  {
    publicHoliday {
      edges {
        node {
          holidayDate
        }
      }
    }
  }
`;

type Props = {
  auth_info: Object,
  dispatch: Function,
  isAuthenticated: boolean,
  message: string,
  isFetching: boolean,
  userDetail: Object,
  userRecord: Object,
  publicHoliday: Object
};

class LeaveApplication extends Component<Props> {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let auth_token = auth_info.auth_token
      ? auth_info.auth_token
      : localStorage.getItem('auth_token');

    if (auth_token) {
      dispatch(fetchLoginFromToken(auth_token));
    }
  }

  render() {
    const {
      userDetail,
      userRecord,
      publicHoliday,
      dispatch,
      isAuthenticated,
      message,
      isFetching
    } = this.props;

    return (
      <div className="LeaveApplication">
        {isAuthenticated ? (
          <LeaveApplications
            user_detail={userDetail}
            user_record={userRecord}
            public_holiday={publicHoliday}
            isFetching={isFetching}
            message={message}
            onLeaveApplicationClick={applicationDetails =>
              dispatch(fetchLeaveApplication(applicationDetails))}
          />
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

let userID = store.getState().userAuth.auth_info.user_id
  ? store.getState().userAuth.auth_info.user_id
  : localStorage.getItem('user_id');

const mapStateToProps = state => {
  const { userAuth, leaveApplication } = state;

  const { auth_info, isAuthenticated } = userAuth;
  const { isFetching, message } = leaveApplication;

  return {
    auth_info,
    isAuthenticated,
    message,
    isFetching
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(User_Detail, {
    options: {
      variables: {
        id: userID
      }
    },
    name: 'userDetail'
  }),
  graphql(User_Record, {
    options: {
      variables: {
        id: userID
      }
    },
    name: 'userRecord'
  }),
  graphql(Public_Holiday, { name: 'publicHoliday' })
)(LeaveApplication);
