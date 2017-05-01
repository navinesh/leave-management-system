// @flow
import React from 'react';
import { Link } from 'react-router-dom';

const PendingRecordList = ({ user_record }: { user_record: Array<any> }) => {
  const pendingList = user_record
    .filter(data => data.leave_status === 'pending')
    .map(record => (
      <tr key={record.id}>
        <td>{record.leave_name}</td>
        <td>{record.leave_days}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_reason}</td>
      </tr>
    ));

  if (pendingList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="lead">Pending Leave Schedule</p>
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
          <tbody>
            {pendingList}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

const ApprovedRecordList = ({ user_record }: { user_record: Array<any> }) => {
  const approvedList = user_record
    .filter(data => data.leave_status === 'approved')
    .map(record => (
      <tr key={record.id}>
        <td>{record.leave_name}</td>
        <td>{record.leave_days}</td>
        <td>{record.start_date}</td>
        <td>{record.end_date}</td>
        <td>{record.leave_reason}</td>
      </tr>
    ));

  if (approvedList.length > 0) {
    return (
      <div className="col-md-12">
        <p className="lead">Approved Leave Schedule</p>
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
          <tbody>
            {approvedList}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <div />;
  }
};

export const UserRecord = ({
  user_detail,
  message
}: {
  user_detail: Object,
  message: string
}) => {
  let gender = user_detail.gender ? user_detail.gender.toLowerCase() : null;

  if (message) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 offset-md-2 ">
          <h1 className="display-4">
            The site configured at this address does not contain the requested resource.
          </h1>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="jumbotron jumbotron-fluid"
        style={{ backgroundColor: '#FFFFFF', paddingTop: '90px' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="display-4">
                {user_detail.othernames}{' '}{user_detail.surname}
                <br />
                <Link to="/changepassword" className="btn btn-outline-primary">
                  Change password
                </Link>
              </p>
            </div>
            <div className="col-md-2 pt-3">
              <p className="lead">
                Annual{' '}
                <span className="badge badge-primary badge-pill">
                  {user_detail.annual}
                </span>
              </p>
            </div>
            <div className="col-md-2 pt-3">
              <p className="lead">
                Sick{' '}
                <span className="badge badge-primary badge-pill">
                  {user_detail.sick}
                </span>
              </p>
            </div>
            <div className="col-md-2 pt-3">
              <p className="lead">
                Christmas{' '}
                <span className="badge badge-primary badge-pill">
                  {user_detail.christmas}
                </span>
              </p>
            </div>
            <div className="col-md-2 pt-3">
              <p className="lead">
                Bereavement{' '}
                <span className="badge badge-primary badge-pill">
                  {user_detail.bereavement}
                </span>
              </p>
            </div>
            <div className="col-md-2 pt-3">
              {gender === 'female' &&
                <p className="lead">
                  Maternity{' '}
                  <span className="badge badge-primary badge-pill">
                    {user_detail.maternity}
                  </span>
                </p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export const RecordList = ({ user_record }: { user_record: Array<any> }) => (
  <div className="container">
    <div className="row">
      <PendingRecordList user_record={user_record} />
      <ApprovedRecordList user_record={user_record} />
    </div>
  </div>
);
