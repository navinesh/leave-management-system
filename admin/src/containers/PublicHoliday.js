// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import {
  requestAdminLoginFromToken,
  receiveAdminLoginFromToken,
  loginAdminErrorFromToken
} from '../actions/AdminLogin';
import PublicHolidays from '../components/PublicHoliday';

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      token
      ok
    }
  }
`;

const PUBLIC_HOLIDAY = gql`
  {
    publicHoliday {
      edges {
        node {
          id
          dbId
          holidayDate
        }
      }
    }
  }
`;

const ADD_PUBLIC_HOLIDAY = gql`
  mutation addPublicholiday($holidayDate: String!) {
    addPublicholiday(holidayDate: $holidayDate) {
      publicHoliday {
        id
        holidayDate
      }
    }
  }
`;

const DELETE_PUBLIC_HOLIDAY = gql`
  mutation deletePublicholiday($id: String!) {
    deletePublicholiday(id: $id) {
      publicHoliday {
        id
        holidayDate
      }
    }
  }
`;

type Props = {
  isAuthenticated: boolean,
  auth_info: Object,
  dispatch: Function,
  verifyAdminToken: Function,
  publicHolidays: Object,
  addHoliday: Function,
  deleteHoliday: Function
};

class PublicHoliday extends Component<Props> {
  componentWillMount() {
    const { auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      this.verifyToken();
    }
  }

  verifyToken = async () => {
    const { dispatch, verifyAdminToken } = this.props;
    const adminToken = localStorage.getItem('admin_token');

    try {
      dispatch(requestAdminLoginFromToken());
      const response = await verifyAdminToken({
        variables: { adminToken }
      });
      dispatch(
        receiveAdminLoginFromToken(response.data.verifyAdminToken.token)
      );
    } catch (error) {
      console.log(error);
      localStorage.removeItem('admin_token');
      dispatch(loginAdminErrorFromToken('Your session has expired!'));
    }
  };

  render() {
    const {
      isAuthenticated,
      publicHolidays,
      addHoliday,
      deleteHoliday
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated ? (
          <PublicHolidays
            publicHolidays={publicHolidays}
            addHoliday={addHoliday}
            deleteHoliday={deleteHoliday}
          />
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

  return {
    auth_info,
    isAuthenticated
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(VERIFY_ADMIN_TOKEN, {
    name: 'verifyAdminToken'
  }),
  graphql(PUBLIC_HOLIDAY, { name: 'publicHolidays' }),
  graphql(ADD_PUBLIC_HOLIDAY, {
    name: 'addHoliday',
    props: ({ addHoliday }) => ({
      addHoliday: holidayDate => addHoliday({ variables: { holidayDate } })
    }),
    options: {
      refetchQueries: [{ query: PUBLIC_HOLIDAY }]
    }
  }),
  graphql(DELETE_PUBLIC_HOLIDAY, {
    name: 'deleteHoliday',
    props: ({ deleteHoliday }) => ({
      deleteHoliday: id => deleteHoliday({ variables: { id } })
    }),
    options: {
      refetchQueries: [{ query: PUBLIC_HOLIDAY }]
    }
  })
)(PublicHoliday);
