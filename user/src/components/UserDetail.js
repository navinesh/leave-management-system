// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import '../spinners.css';

const USER_DETAIL = gql`
  query($id: ID!) {
    user(id: $id) {
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

type Props = {
  userDetail: Object
};

const UserDetail = (props: Props) => {
  const { userDetail: { loading, error, user } } = props;

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="loader1" />
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '100px',
        paddingBottom: '30px'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <p className="display-4">
              {user.othernames} {user.surname}
            </p>
            <p>
              <Link to="/changepassword" className="btn btn-primary">
                Change password
              </Link>
            </p>
          </div>
          <div className="col-md-4">
            <ul className="list-group">
              <li className="list-group-item">
                Annual
                <span className="badge badge-primary badge-pill float-right">
                  {user.annual}
                </span>
              </li>
              <li className="list-group-item">
                Sick
                <span className="badge badge-primary badge-pill float-right">
                  {user.sick}
                </span>
              </li>
              <li className="list-group-item">
                Bereavement
                <span className="badge badge-primary badge-pill float-right">
                  {user.bereavement}
                </span>
              </li>
              <li className="list-group-item">
                Christmas
                <span className="badge badge-primary badge-pill float-right">
                  {user.christmas}
                </span>
              </li>
              {user.gender.toLowerCase() === 'female' &&
                user.maternity > 0 && (
                  <li className="list-group-item">
                    Maternity
                    <span className="badge badge-primary badge-pill float-right">
                      {user.maternity}
                    </span>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default graphql(USER_DETAIL, {
  options: ({ id }) => ({ variables: { id }, pollInterval: 60000 }),
  name: 'userDetail'
})(UserDetail);
