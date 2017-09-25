// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import '../spinners.css';

const PendingRecordList = props => {
  const pendingList = props.user_record.leaverecord.edges
    .filter(data => data.node.leaveStatus === 'pending')
    .map(record => (
      <tr key={record.node.id}>
        <td>{record.node.leaveName}</td>
        <td>{record.node.leaveDays}</td>
        <td>{record.node.startDate}</td>
        <td>{record.node.endDate}</td>
        <td>{record.node.leaveReason}</td>
      </tr>
    ));

  if (pendingList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="text-uppercase">Pending Leave Schedule</p>
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Leave type</th>
              <th>Leave days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>{pendingList}</tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

const ApprovedRecordList = props => {
  const approvedList = props.user_record.leaverecord.edges
    .filter(data => data.node.leaveStatus === 'approved')
    .map(record => (
      <tr key={record.node.id}>
        <td>{record.node.leaveName}</td>
        <td>{record.node.leaveDays}</td>
        <td>{record.node.startDate}</td>
        <td>{record.node.endDate}</td>
        <td>{record.node.leaveReason}</td>
      </tr>
    ));

  if (approvedList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="text-uppercase">Approved Leave Schedule</p>
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <thead className="thead-default">
            <tr>
              <th>Leave type</th>
              <th>Leave days</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>{approvedList}</tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

type Props = {
  user_record: Object
};

export const RecordList = (props: Props) => {
  const { user_record: { loading, error, user } } = props;

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
    <div className="container">
      <div className="row">
        <PendingRecordList user_record={user} />
        <ApprovedRecordList user_record={user} />
      </div>
    </div>
  );
};

type userRecordProps = {
  user_detail: Object
};

export const UserRecord = (props: userRecordProps) => {
  const { user_detail: { loading, error, user } } = props;

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

  let gender = user.gender ? user.gender.toLowerCase() : null;

  return (
    <div
      className="jumbotron jumbotron-fluid"
      style={{ backgroundColor: '#FFFFFF', paddingTop: '80px' }}
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
              {gender === 'female' &&
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
