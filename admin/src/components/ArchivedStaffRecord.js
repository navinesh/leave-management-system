import React, { PropTypes, Component } from "react";

const moment = require("moment");

import { searchStaffRecord } from "../actions/StaffRecord";

class ArchivedStaffRecordList extends Component {
  handleSearchChange(e) {
    this.props.dispatch(searchStaffRecord(e.target.value.toLowerCase()));
  }

  render() {
    const { archived_staff_record, searchTerm } = this.props;

    const filteredElements = archived_staff_record
      .filter(
        e =>
          e.othernames.toLowerCase().includes(searchTerm) ||
            e.surname.toLowerCase().includes(searchTerm)
      )
      .map(record => {
        let dob = new Date(record.date_of_birth);

        let dateOfBirth = moment(dob).format("DD/MM/YYYY");

        return (
          <div className="col-md-3" key={record.id}>
            <div className="card">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">{record.othernames}{record.surname}</li>
                <li className="list-group-item justify-content-between">
                  Annual
                  <span className="badge badge-primary badge-pill">{record.annual}</span>
                </li>
                <li className="list-group-item justify-content-between">
                  Sick
                  <span className="badge badge-primary badge-pill">{record.sick}</span>
                </li>
                <li className="list-group-item justify-content-between">
                  Bereavement
                  <span className="badge badge-primary badge-pill">{record.bereavement}</span>
                </li>
                <li className="list-group-item justify-content-between">
                  Christmas
                  <span className="badge badge-primary badge-pill">{record.christmas}</span>
                </li>
                <li className="list-group-item justify-content-between">
                  DOB
                  <span className="badge badge-primary badge-pill">{dateOfBirth}</span>
                </li>
                <li className="list-group-item justify-content-between">
                  Maternity
                  <span className="badge badge-primary badge-pill">{record.maternity}</span>
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
              <input type="text" className="form-control" placeholder="Search" onChange={
                this.handleSearchChange.bind(this)
              } />
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

ArchivedStaffRecordList.propTypes = {
  archived_staff_record: PropTypes.array.isRequired,
  searchTerm: React.PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

export default ArchivedStaffRecordList;
