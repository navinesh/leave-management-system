// @flow
import React, { Component } from 'react';

import {
  requestUnArchiveUser,
  successUnArchiveUser,
  failureUnArchiveUser
} from '../actions/UnArchiveUser';

const moment = require('moment');

const Search = props => (
  <div className="col-md-3">
    <div className="form-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={props.searchTerm}
        onChange={props.handleSearchChange}
      />
    </div>
  </div>
);

const ClearSearch = props => (
  <div className="col-md-3">
    <button className="btn btn-primary" onClick={props.handleClearSearch}>
      Clear
    </button>
  </div>
);

const UnArchiveLeave = props => (
  <div className="col-md-10 ml-auto mr-auto">
    {props.archived_staff_record.filter(e => e.id === props.id).map(record => (
      <div key={record.id}>
        <div
          className="col-md-6 ml-auto mr-auto"
          style={{ paddingTop: '10px' }}
        >
          <div className="card">
            <h5 className="card-header">Unarchive</h5>
            <div className="card-body">
              <form encType="multipart/form-data" onSubmit={props.handleSubmit}>
                <div className="row">
                  <div className="col">
                    <p>
                      {record.othernames} {record.surname}
                    </p>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={props.handleCloseUnarchive}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary ml-3 mr-3">
                    Yes
                  </button>
                </div>
                {props.isUnArchiveFetching ? (
                  <div className="loader2" />
                ) : (
                  <p className="text-primary text-center mt-3">
                    {props.unArchiveMessage}
                  </p>
                )}
                <div className="text-danger">{props.errorMessage}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

type Props = {
  archived_staff_record: Array<any>,
  dispatch: Function,
  unArchiveUser: Function,
  isUnArchiveFetching: Function,
  unArchiveMessage: string,
  refetch: Function
};

type State = {
  errorMessage: string,
  isUnarchive: boolean,
  id: string,
  searchTerm: string
};

export default class ArchivedStaffRecordList extends Component<Props, State> {
  handleSearchChange: Function;
  handleClearSearch: Function;
  handleOpenUnarchive: Function;
  handleCloseUnarchive: Function;
  handleSubmit: Function;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      id: '',
      isUnarchive: false,
      searchTerm: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleOpenUnarchive = this.handleOpenUnarchive.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseUnarchive = this.handleCloseUnarchive.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent<>) {
    this.setState({ searchTerm: target.value.toLowerCase() });
  }

  handleClearSearch() {
    this.setState({ searchTerm: '' });
  }

  handleOpenUnarchive(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isUnarchive: true,
      id: e.currentTarget.id
    });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const id = this.state.id;

    if (!id) {
      this.setState({
        errorMessage: 'Could not fetch ID!'
      });
      return null;
    }

    this.unArchiveStaff();
  }

  handleCloseUnarchive() {
    const { refetch } = this.props;

    this.setState({ isUnarchive: false, errorMessage: '', id: '' });

    refetch();
    this.props.dispatch({ type: 'CLEAR_UNARCHIVE_MESSAGE' });
  }

  unArchiveStaff = async () => {
    const { dispatch, unArchiveUser } = this.props;
    const { id } = this.state;

    try {
      dispatch(requestUnArchiveUser());
      await unArchiveUser({ variables: { id } });
      dispatch(successUnArchiveUser('User record has been unarchived.'));
    } catch (error) {
      console.log(error);
      dispatch(failureUnArchiveUser(error.message));
    }
  };

  render() {
    const {
      archived_staff_record,
      isUnArchiveFetching,
      unArchiveMessage
    } = this.props;

    if (this.state.isUnarchive) {
      return (
        <UnArchiveLeave
          archived_staff_record={this.props.archived_staff_record}
          id={this.state.id}
          handleSubmit={this.handleSubmit}
          handleCloseUnarchive={this.handleCloseUnarchive}
          isUnArchiveFetching={isUnArchiveFetching}
          unArchiveMessage={unArchiveMessage}
          errorMessage={this.state.errorMessage}
        />
      );
    }

    const filteredElements = archived_staff_record
      .filter(
        e =>
          e.othernames.toLowerCase().includes(this.state.searchTerm) ||
          e.surname.toLowerCase().includes(this.state.searchTerm)
      )
      .map(record => {
        let dob = new Date(record.dateOfBirth);
        let dateOfBirth = moment(dob).format('DD/MM/YYYY');

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <p className="h5">
                    {record.othernames} {record.surname}
                  </p>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Annual
                  <span className="badge badge-primary badge-pill">
                    {record.annual}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Sick
                  <span className="badge badge-primary badge-pill">
                    {record.sick}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Bereavement
                  <span className="badge badge-primary badge-pill">
                    {record.bereavement}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Christmas
                  <span className="badge badge-primary badge-pill">
                    {record.christmas}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  DOB
                  <span className="badge badge-primary badge-pill">
                    {dateOfBirth}
                  </span>
                </li>
                {record.gender.toLowerCase() === 'female' ? (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Maternity
                    <span className="badge badge-primary badge-pill">
                      {record.maternity}
                    </span>
                  </li>
                ) : (
                  <p className="list-group-item d-flex justify-content-between align-items-center">
                    <br />
                  </p>
                )}
                <li className="list-group-item">
                  <button
                    className="btn btn-link text-primary pl-0"
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
        {archived_staff_record.length > 0 ? (
          <div>
            <div className="row">
              <Search
                handleSearchChange={this.handleSearchChange}
                searchTerm={this.state.searchTerm}
              />
              {this.state.searchTerm && (
                <ClearSearch handleClearSearch={this.handleClearSearch} />
              )}
            </div>
            <div className="row">{filteredElements}</div>
          </div>
        ) : (
          <div
            className="card card-body border-0"
            style={{ paddingTop: '100px', paddingBottom: '260px' }}
          >
            <h1 className="display-4 text-center">
              <em>There is no record to display.</em>
            </h1>
          </div>
        )}
      </div>
    );
  }
}
