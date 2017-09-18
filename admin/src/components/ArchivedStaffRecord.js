// @flow
import React, { Component } from 'react';

import { fetchArchivedStaffRecord } from '../actions/ArchivedStaffRecord';

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
    {props.archived_staff_record
      .filter(e => e.id === props.listID)
      .map(record => (
        <div key={record.id}>
          <div
            className="col-md-6 ml-auto mr-auto"
            style={{ paddingTop: '10px' }}
          >
            <div className="card">
              <h5 className="card-header">Unarchive</h5>
              <div className="card-body">
                <form
                  encType="multipart/form-data"
                  onSubmit={props.handleSubmit}
                >
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
  onUnArchiveUserSubmit: Function,
  dispatch: Function,
  isUnArchiveFetching: boolean,
  unArchiveMessage: string
};

type State = {
  errorMessage: string,
  isUnarchive: boolean,
  listID: number,
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
      listID: 0,
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
      listID: parseInt(e.currentTarget.id, 10)
    });
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

  handleCloseUnarchive() {
    this.setState({ isUnarchive: false, errorMessage: '', listID: 0 });
    this.props.dispatch({ type: 'CLEAR_UNARCHIVE_MESSAGE' });
    if (this.props.unArchiveMessage) {
      this.props.dispatch(fetchArchivedStaffRecord());
    }
  }

  render() {
    const { archived_staff_record } = this.props;

    if (this.state.isUnarchive) {
      return (
        <UnArchiveLeave
          archived_staff_record={this.props.archived_staff_record}
          listID={this.state.listID}
          handleSubmit={this.handleSubmit}
          handleCloseUnarchive={this.handleCloseUnarchive}
          isUnArchiveFetching={this.props.isUnArchiveFetching}
          unArchiveMessage={this.props.unArchiveMessage}
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
        let dob = new Date(record.date_of_birth);
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
                <li className="list-group-item">
                  Annual
                  <span className="badge badge-primary badge-pill float-right">
                    {record.annual}
                  </span>
                </li>
                <li className="list-group-item">
                  Sick
                  <span className="badge badge-primary badge-pill float-right">
                    {record.sick}
                  </span>
                </li>
                <li className="list-group-item">
                  Bereavement
                  <span className="badge badge-primary badge-pill float-right">
                    {record.bereavement}
                  </span>
                </li>
                <li className="list-group-item">
                  Christmas
                  <span className="badge badge-primary badge-pill float-right">
                    {record.christmas}
                  </span>
                </li>
                <li className="list-group-item">
                  DOB
                  <span className="badge badge-primary badge-pill float-right">
                    {dateOfBirth}
                  </span>
                </li>
                {record.gender.toLowerCase() === 'female' ? (
                  <li className="list-group-item">
                    Maternity
                    <span className="badge badge-primary badge-pill float-right">
                      {record.maternity}
                    </span>
                  </li>
                ) : (
                  <p className="list-group-item">
                    <br />
                  </p>
                )}
                <li className="list-group-item">
                  <button
                    className="btn btn-link text-primary"
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
