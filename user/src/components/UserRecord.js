// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type pendingRecordProps = {
  user_record: Array<any>
};

const PendingRecordList = (props: pendingRecordProps) => {
  const pendingList = props.user_record
    .filter(data => data.leave_status === 'pending')
    .map(record =>
      <tr key={record.id}>
        <td>
          {record.leave_name}
        </td>
        <td>
          {record.leave_days}
        </td>
        <td>
          {record.start_date}
        </td>
        <td>
          {record.end_date}
        </td>
        <td>
          {record.leave_reason}
        </td>
      </tr>
    );

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

type approvedRecordProps = {
  user_record: Array<any>
};

const ApprovedRecordList = (props: approvedRecordProps) => {
  const approvedList = props.user_record
    .filter(data => data.leave_status === 'approved')
    .map(record =>
      <tr key={record.id}>
        <td>
          {record.leave_name}
        </td>
        <td>
          {record.leave_days}
        </td>
        <td>
          {record.start_date}
        </td>
        <td>
          {record.end_date}
        </td>
        <td>
          {record.leave_reason}
        </td>
      </tr>
    );

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

type userRecordProps = {
  user_detail: Object,
  message: string
};

export const UserRecord = (props: userRecordProps) => {
  let gender = props.user_detail.gender
    ? props.user_detail.gender.toLowerCase()
    : null;

  if (props.message) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 offset-md-2 ">
          <h1 className="display-4">
            The site configured at this address does not contain the requested
            resource.
          </h1>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="jumbotron jumbotron-fluid"
        style={{ backgroundColor: '#FFFFFF', paddingTop: '80px' }}
      >
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-7">
              <p className="display-4">
                {props.user_detail.othernames} {props.user_detail.surname}
              </p>
              <p>
                <Link to="/changepassword" className="btn btn-primary">
                  Change password
                </Link>
              </p>
            </div>
            <div className="col-md-3">
              <ul className="list-group">
                <li className="list-group-item justify-content-between">
                  Annual
                  <span className="badge badge-primary badge-pill">
                    {props.user_detail.annual}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Sick
                  <span className="badge badge-primary badge-pill">
                    {props.user_detail.sick}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Bereavement
                  <span className="badge badge-primary badge-pill">
                    {props.user_detail.bereavement}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Christmas
                  <span className="badge badge-primary badge-pill">
                    {props.user_detail.christmas}
                  </span>
                </li>
                {gender === 'female' &&
                  <li className="list-group-item justify-content-between">
                    Maternity
                    <span className="badge badge-primary badge-pill">
                      {props.user_detail.maternity}
                    </span>
                  </li>}
              </ul>
            </div>
            {/*<div className="col-md-2 offset-md-1">
              <Link to="/changepassword" className="btn btn-primary">
                Change password
              </Link>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
};

type Props = {
  user_record: Array<any>
};

export const RecordList = (props: Props) =>
  <div className="container">
    <div className="row">
      <PendingRecordList user_record={props.user_record} />
      <ApprovedRecordList user_record={props.user_record} />
    </div>
  </div>;
