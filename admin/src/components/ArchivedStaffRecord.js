// @flow
import React, { Component, Fragment } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

const moment = require('moment');

const UNARCHIVE_USER = gql`
  mutation unArchiveUser($id: String!) {
    unArchiveUser(id: $id) {
      User {
        isArchived
      }
      ok
    }
  }
`;

const ACTIVE_USERS = gql`
  {
    findUsers(isArchived: "false") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      christmas
      bereavement
      dateOfBirth
      maternity
      gender
    }
  }
`;

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
    <button className="btn btn-link" onClick={props.handleClearSearch}>
      Clear
    </button>
  </div>
);

const UnArchive = props => (
  <Mutation
    mutation={UNARCHIVE_USER}
    variables={{ id: props.id }}
    refetchQueries={[{ query: ACTIVE_USERS }]}
  >
    {(unArchiveUser, { loading, error, data }) => {
      if (loading) {
        return <p className="font-italic text-primary mr-3">Loading...</p>;
      }

      if (error) {
        return <p className="font-italic text-warning mr-3">Error...</p>;
      }

      if (data) {
        return (
          <p className="font-italic text-success mr-3">
            User has been unarchived!
          </p>
        );
      }

      return (
        <button onClick={unArchiveUser} className="btn btn-primary mr-3">
          Yes
        </button>
      );
    }}
  </Mutation>
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
              <div className="row">
                <div className="col">
                  <p>
                    {record.othernames} {record.surname}
                  </p>
                </div>
              </div>
              <div className="row justify-content-end">
                <UnArchive id={props.id} />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={props.handleCloseUnarchive}
                >
                  Close
                </button>
              </div>
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

  handleCloseUnarchive() {
    this.setState({ isUnarchive: false, errorMessage: '', id: '' });

    this.props.refetch();
  }

  render() {
    const { archived_staff_record } = this.props;

    if (this.state.isUnarchive) {
      return (
        <UnArchiveLeave
          archived_staff_record={this.props.archived_staff_record}
          id={this.state.id}
          handleCloseUnarchive={this.handleCloseUnarchive}
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
                  Family care
                  <span className="badge badge-primary badge-pill">
                    {record.familyCare}
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
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Paternity
                    <span className="badge badge-primary badge-pill">
                      {record.paternity}
                    </span>
                  </li>
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
      <Fragment>
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
      </Fragment>
    );
  }
}
