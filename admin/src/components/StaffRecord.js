// @flow
import React, { Component, Fragment } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');

const ARCHIVE_USER = gql`
  mutation archiveUser($id: String!, $archiveReason: String!) {
    archiveUser(id: $id, archiveReason: $archiveReason) {
      User {
        isArchived
      }
      ok
    }
  }
`;

const ARCHIVED_USERS = gql`
  {
    findUsers(isArchived: "true") {
      id
      dbId
      othernames
      surname
      email
      annual
      sick
      bereavement
      familyCare
      christmas
      dateOfBirth
      maternity
      paternity
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

const Archive = props => (
  <Mutation
    mutation={ARCHIVE_USER}
    variables={{
      id: props.id,
      archiveReason: props.archiveReason
    }}
    refetchQueries={[{ query: ARCHIVED_USERS }]}
  >
    {(archiveUser, { loading, error, data }) => {
      if (loading) {
        return <p className="font-italic text-primary mr-3">Loading...</p>;
      }

      if (error) {
        return <p className="font-italic text-warning mr-3">Error...</p>;
      }

      if (data) {
        return (
          <p className="font-italic text-success mr-3">
            User has been archived!
          </p>
        );
      }

      return (
        <button onClick={archiveUser} className="btn btn-primary mr-3">
          Confirm
        </button>
      );
    }}
  </Mutation>
);

const ArchiveUser = props => (
  <Fragment>
    {props.staff_record.filter(e => e.id === props.id).map(record => (
      <div key={record.id}>
        <div
          className="col-md-6 ml-auto mr-auto"
          style={{ paddingTop: '10px' }}
        >
          <div className="card">
            <h5 className="card-header">Archive</h5>
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <p>
                    {record.othernames} {record.surname}
                  </p>
                  <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter reason"
                      id="reason"
                      onChange={props.handleArchiveReason}
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-end">
                <Archive id={props.id} archiveReason={props.archiveReason} />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={props.handleCloseArchive}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Fragment>
);

type Props = {
  staff_record: Object,
  dispatch: Function,
  onModifyUserRecordSubmit: Function,
  message: string,
  isFetching: boolean,
  refetch: Function
};

type State = {
  errorMessage: string,
  id: string,
  dbid: string,
  dob: any,
  archiveReason: any,
  isEditing: boolean,
  isArchiving: boolean,
  editReason: string,
  searchTerm: string
};

export default class StaffRecordList extends Component<Props, State> {
  handleDateChange: Function;
  handleEditReason: Function;
  handleSubmit: Function;
  handleArchiveReason: Function;
  handleOpenEdit: Function;
  handleCloseEdit: Function;
  handleOpenArchive: Function;
  handleCloseArchive: Function;
  handleSearchChange: Function;
  handleClearSearch: Function;

  surname: any;
  othernames: any;
  designation: any;
  email: any;
  annual: any;
  sick: any;
  bereavement: any;
  familyCare: any;
  christmas: any;
  gender: any;
  dob: any;
  maternity: any;
  paternity: any;
  employeeNumber: any;

  constructor() {
    super();
    this.state = {
      errorMessage: '',
      id: '',
      dbid: '',
      dob: null,
      archiveReason: null,
      editReason: '',
      isEditing: false,
      isArchiving: false,
      searchTerm: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEditReason = this.handleEditReason.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleOpenArchive = this.handleOpenArchive.bind(this);
    this.handleArchiveReason = this.handleArchiveReason.bind(this);
    this.handleCloseArchive = this.handleCloseArchive.bind(this);
  }

  handleSearchChange({ target }: SyntheticInputEvent<>) {
    this.setState({ searchTerm: target.value });
  }

  handleClearSearch() {
    this.setState({ searchTerm: '' });
  }

  handleOpenEdit({ target }: SyntheticInputEvent<>) {
    this.setState({
      isEditing: !this.state.isEditing,
      id: target.id,
      dbid: target.value
    });
  }

  handleDateChange(e: Event) {
    this.setState({ dob: e });
  }

  handleEditReason({ target }: SyntheticInputEvent<>) {
    this.setState({ editReason: target.value });
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const dbid = this.state.dbid;
    const surname = this.surname.value;
    const othernames = this.othernames.value;
    const staffEmail = this.email.value;
    const designation = this.designation.value;
    const annualDays = this.annual.value;
    const sickDays = this.sick.value;
    const bereavmentDays = this.bereavement.value;
    const christmasDays = this.christmas.value;
    const gender = this.gender.value;
    const familyCare = this.familyCare.value;
    const employeeNumber = this.employeeNumber.value;

    let dobDate = new Date(this.dob.value);
    let dob = moment(dobDate).format('DD/MM/YYYY');

    const dateOfBirth = this.state.dob
      ? moment(this.state.dob).format('DD/MM/YYYY')
      : dob;

    const mDays = gender => {
      if (gender.toLowerCase() === 'female' && this.maternity) {
        return this.maternity.value ? this.maternity.value : 0;
      } else {
        return 0;
      }
    };
    const maternityDays = mDays(gender);

    const pDays = gender => {
      if (gender.toLowerCase() === 'male' && this.paternity) {
        return this.paternity.value ? this.paternity.value : 0;
      } else {
        return 0;
      }
    };
    const paternityDays = pDays(gender);

    const editReason = this.state.editReason
      ? this.state.editReason.trim()
      : null;

    const adminUser = localStorage.getItem('admin_user');

    // verify data
    if (
      !dbid ||
      !surname ||
      !othernames ||
      !staffEmail ||
      !designation ||
      !annualDays ||
      !sickDays ||
      !bereavmentDays ||
      !christmasDays ||
      !dateOfBirth ||
      !familyCare ||
      !gender ||
      !editReason ||
      !employeeNumber
    ) {
      this.setState({
        errorMessage: 'One or more required fields are missing!'
      });
      return null;
    }

    // prepare data to post to database
    const modifyUserDetails = {
      dbid: dbid,
      surname: surname,
      othernames: othernames,
      staffEmail: staffEmail,
      designation: designation,
      annualDays: annualDays,
      sickDays: sickDays,
      bereavmentDays: bereavmentDays,
      christmasDays: christmasDays,
      dateOfBirth: dateOfBirth,
      familyCare: familyCare,
      maternityDays: maternityDays,
      paternityDays: paternityDays,
      gender: gender,
      editReason: editReason,
      employeeNumber: employeeNumber,
      adminUser: adminUser
    };

    this.props.onModifyUserRecordSubmit(modifyUserDetails);
  }

  handleCloseEdit() {
    const { dispatch, refetch } = this.props;

    this.setState({
      isEditing: !this.state.isEditing,
      errorMessage: '',
      dob: null,
      id: '',
      dbid: ''
    });

    if (this.state.editReason) {
      dispatch({ type: 'CLEAR_MODIFY_USER_MESSAGE' });
      refetch();
    }
  }

  handleOpenArchive(e: SyntheticEvent<HTMLElement>) {
    this.setState({
      isArchiving: !this.state.isArchiving,
      id: e.currentTarget.id
    });
  }

  handleArchiveReason({ target }: SyntheticInputEvent<>) {
    this.setState({ archiveReason: target.value });
  }

  handleCloseArchive() {
    if (this.state.archiveReason) {
      this.props.refetch();
    }

    this.setState({
      isArchiving: !this.state.isArchiving,
      archiveReason: null,
      id: ''
    });
  }

  render() {
    const { staff_record, isFetching, message } = this.props;

    const id = this.state.id;

    if (this.state.isEditing) {
      return (
        <Fragment>
          {staff_record.filter(e => e.id === id).map(record => {
            let dob = new Date(record.dateOfBirth);
            let dateOfBirth = moment(dob).format('DD/MM/YYYY');
            return (
              <div key={record.id}>
                <div className="col-md-6 ml-auto mr-auto pb-2">
                  <div className="card">
                    <h5 className="card-header">Edit</h5>
                    <div className="card-body">
                      <form
                        encType="multipart/form-data"
                        onSubmit={this.handleSubmit}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="surName">Surname</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.surname}
                                ref={input => (this.surname = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="otherNames">Other Names</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={record.othernames}
                                ref={input => (this.othernames = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="staffEmail">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            defaultValue={record.email}
                            ref={input => (this.email = input)}
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="designation">Designation</label>
                              <select
                                className="form-control"
                                id="designation"
                                defaultValue={record.designation}
                                ref={select => (this.designation = select)}
                              >
                                <option>{record.designation}</option>
                                <option>Admin</option>
                                <option>Level 3 Lawyer</option>
                                <option>Level 4 Lawyer</option>
                                <option>Level 3 Secretary</option>
                                <option>Level 4 Secretary</option>
                                <option>TM</option>
                                <option>Accounts</option>
                                <option>Library</option>
                                <option>IT</option>
                                <option>Search Clerk Level 3</option>
                                <option>Search Clerk Level 4</option>
                                <option>Legal Executive</option>
                                <option>Partner</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="gender">Gender</label>
                              <select
                                className="form-control"
                                id="designation"
                                defaultValue={record.gender}
                                ref={select => (this.gender = select)}
                              >
                                <option>{record.gender}</option>
                                <option>Male</option>
                                <option>Female</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="annualLeave">Annual leave</label>
                              <input
                                className="form-control"
                                defaultValue={record.annual}
                                ref={input => (this.annual = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="sickLeave">Sick leave</label>
                              <input
                                className="form-control"
                                defaultValue={record.sick}
                                ref={input => (this.sick = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="bereavementLeave">
                                Bereavement leave
                              </label>
                              <input
                                className="form-control"
                                defaultValue={record.bereavement}
                                ref={input => (this.bereavement = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="familyCareLeave">
                                Family care leave
                              </label>
                              <input
                                className="form-control"
                                defaultValue={record.familyCare}
                                ref={input => (this.familyCare = input)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="christmasLeave">
                                Christmas leave
                              </label>
                              <input
                                className="form-control"
                                defaultValue={record.christmas}
                                ref={input => (this.christmas = input)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="dob">Date of birth</label>
                              <input
                                type="hidden"
                                defaultValue={record.dateOfBirth}
                                ref={input => (this.dob = input)}
                              />
                              <DatePicker
                                className="form-control"
                                dateFormat="DD/MM/YYYY"
                                openToDate={moment(dob)}
                                selected={this.state.dob}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                onChange={this.handleDateChange}
                                placeholderText={dateOfBirth}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="employeeNumber">Employee #</label>
                              <input
                                className="form-control"
                                defaultValue={record.employeeNumber}
                                ref={input => (this.employeeNumber = input)}
                              />
                            </div>
                          </div>
                          {record.gender.toLowerCase() === 'female' && (
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="Maternity leave">
                                  Maternity leave
                                </label>
                                <input
                                  className="form-control"
                                  defaultValue={record.maternity}
                                  ref={input => (this.maternity = input)}
                                />
                              </div>
                            </div>
                          )}
                          {record.gender.toLowerCase() === 'male' && (
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="Paternity leave">
                                  Paternity leave
                                </label>
                                <input
                                  className="form-control"
                                  defaultValue={record.paternity}
                                  ref={input => (this.paternity = input)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div className="col">
                            <div className="form-group">
                              <label htmlFor="reason">Reason</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter reason"
                                id="reason"
                                onChange={this.handleEditReason}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-primary mr-3"
                          >
                            Save changes
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={this.handleCloseEdit}
                          >
                            Close
                          </button>
                        </div>
                        <div className="text-primary text-center">
                          {isFetching ? (
                            <div className="loader2" />
                          ) : (
                            <p className="mt-3">{message}</p>
                          )}
                        </div>
                        <div className="text-danger text-center">
                          {this.state.errorMessage}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Fragment>
      );
    }

    if (this.state.isArchiving) {
      return (
        <ArchiveUser
          staff_record={staff_record}
          id={id}
          handleArchiveReason={this.handleArchiveReason}
          archiveReason={this.state.archiveReason}
          handleCloseArchive={this.handleCloseArchive}
        />
      );
    }

    const filteredElements = staff_record
      .filter(
        e =>
          e.othernames
            .toLowerCase()
            .includes(this.state.searchTerm.toLowerCase()) ||
          e.surname.toLowerCase().includes(this.state.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        return a.othernames.localeCompare(b.othernames);
      })
      .map(record => {
        let dob = new Date(record.dateOfBirth);
        let dateOfBirth = moment(dob).format('DD/MM/YYYY');

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card mb-3 shadow p-3 mb-5 bg-white rounded">
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
                    onClick={this.handleOpenEdit}
                    id={record.id}
                    value={record.dbId}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-link text-primary"
                    onClick={this.handleOpenArchive}
                    id={record.id}
                  >
                    Archive
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      });

    return (
      <Fragment>
        {staff_record.length > 0 ? (
          <div>
            <div className="row">
              <Search
                searchTerm={this.state.searchTerm}
                handleSearchChange={this.handleSearchChange}
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
