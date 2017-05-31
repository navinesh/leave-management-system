// @flow
import React, { Component } from 'react';

import { searchStaffRecord } from '../actions/StaffRecord';
import { fetchArchivedStaffRecord } from '../actions/ArchivedStaffRecord';

import '../spinners.css';

const moment = require('moment');

export default class ArchivedStaffRecordList extends Component {
  props: {
    archived_staff_record: Array<any>,
    searchTerm: string,
    onUnArchiveUserSubmit: Function,
    dispatch: Function,
    isUnArchiveFetching: boolean,
    unArchiveMessage: string
  };

  state: {
    errorMessage: string,
    isUnarchive: boolean,
    listID: number
  };

  handleSearchChange: Function;
  handleOpenUnarchive: Function;
  handleCloseUnarchive: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      listID: 0,
      isUnarchive: false
    };

    this.handleOpenUnarchive = this.handleOpenUnarchive.bind(this);
    this.handleCloseUnarchive = this.handleCloseUnarchive.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent) {
    this.props.dispatch(searchStaffRecord(target.value.toLowerCase()));
  }

  handleOpenUnarchive(e: Event & { currentTarget: HTMLElement }) {
    this.setState({
      isUnarchive: true,
      listID: parseInt(e.currentTarget.id, 10)
    });
  }

  handleCloseUnarchive(e: Event) {
    const { dispatch } = this.props;

    this.setState({ isUnarchive: false, errorMessage: '' });
    dispatch(fetchArchivedStaffRecord());
    dispatch({ type: 'CLEAR_UNARCHIVE_MESSAGE' });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const id = this.state.listID;
    const isArchived = false;

    if (!id) {
      this.setState({
        errorMessage: 'Could not fetch ID!'
      });
      return null;
    }

    const unArchiveUser = {
      id: id,
      isArchived: isArchived
    };

    this.props.onUnArchiveUserSubmit(unArchiveUser);
  }

  render() {
    const { archived_staff_record, searchTerm } = this.props;

    if (this.state.isUnarchive) {
      return (
        <div>
          {archived_staff_record
            .filter(e => e.id === this.state.listID)
            .map(record => (
              <div key={record.id}>
                <div
                  className="col-md-5 offset-md-3 pb-2"
                  style={{ paddingTop: '40px' }}
                >
                  <div className="card card-block">
                    <form
                      encType="multipart/form-data"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="row">
                        <div className="col">
                          <p>
                            Are you sure you want to unarchive{' '}
                          </p>
                          <p>
                            <span className="h5">
                              {record.othernames}
                              {' '}
                              {record.surname}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={this.handleCloseUnarchive}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm ml-4"
                      >
                        Yes
                      </button>
                      {this.props.isUnArchiveFetching
                        ? <div className="loader2" />
                        : <p className="text-primary text-center mt-3">
                            {this.props.unArchiveMessage}
                          </p>}

                      <div className="text-danger">
                        {this.state.errorMessage}
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            ))}
        </div>
      );
    }

    const filteredElements = archived_staff_record
      .filter(
        e =>
          e.othernames.toLowerCase().includes(searchTerm) ||
          e.surname.toLowerCase().includes(searchTerm)
      )
      .map(record => {
        let dob = new Date(record.date_of_birth);
        let dateOfBirth = moment(dob).format('DD/MM/YYYY');

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <p className="h5">{record.othernames}{' '}{record.surname}</p>
                </li>
                <li className="list-group-item justify-content-between">
                  Annual
                  <span className="badge badge-primary badge-pill">
                    {record.annual}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Sick
                  <span className="badge badge-primary badge-pill">
                    {record.sick}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Bereavement
                  <span className="badge badge-primary badge-pill">
                    {record.bereavement}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  Christmas
                  <span className="badge badge-primary badge-pill">
                    {record.christmas}
                  </span>
                </li>
                <li className="list-group-item justify-content-between">
                  DOB
                  <span className="badge badge-primary badge-pill">
                    {dateOfBirth}
                  </span>
                </li>
                {record.gender.toLowerCase() === 'female'
                  ? <li className="list-group-item justify-content-between">
                      Maternity
                      <span className="badge badge-primary badge-pill">
                        {record.maternity}
                      </span>
                    </li>
                  : <p className="list-group-item"><br /></p>}
                <li className="list-group-item">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={this.handleOpenUnarchive}
                    id={record.id}
                  >
                    Unarchive
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      });

    return (
      <div className="ArchivedStaffRecordList">
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={this.handleSearchChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          {filteredElements}
        </div>
      </div>
    );
  }
}
