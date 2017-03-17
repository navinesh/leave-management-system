import React, { PropTypes, Component } from "react";
import { Link } from "react-router-dom";

var DatePicker = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

import customStyles from "../Styles";

class ApprovedLeaveList extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      deleteReason: null,
      editReason: null,
      showModal1: false
    };
  }

  render() {
    const { approved_items } = this.props;

    const items = approved_items
      .filter(record => {
        // get current date and format it
        let dateToday = moment();

        let todayDate = dateToday.format("DD/MM/YYYY");

        // get end date and format it
        let end_Date = moment(record.end_date, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        );

        // check if current date and end date is same
        let isCurrentDate = todayDate === end_Date ? true : false;

        // check if end date is same or greater than current date
        let eDate = moment(record.end_date, "DD/MM/YYYY").format("MM/DD/YYYY");

        let endDate = moment(new Date(eDate));

        let isEndDate = endDate.isSameOrAfter(dateToday);

        // return true for current and future leaves
        return isCurrentDate || isEndDate ? true : false;
      })
      .map(data => (
        <tr key={data.id}>
          <td>{data.user.othernames}{" "}{data.user.surname}</td>
          <td>{data.leave_name}</td>
          <td>{data.leave_type}</td>
          <td>{data.start_date}</td>
          <td>{data.end_date}</td>
          <td>{data.leave_days}</td>
          <td>
            <Link to="/reset" className="btn btn-link">Edit</Link>
          </td>
          <td>
            <Link to="/reset" className="btn btn-link text-danger">
              Delete
            </Link>
          </td>
        </tr>
      ));

    return items.length > 0
      ? <div className="table-responsive">
          <table
            className="table table-bordered table-hover"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <thead className="thead-default">
              <tr>
                <th>Name</th>
                <th>Leave</th>
                <th>Type</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Leave days</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {items}
            </tbody>
          </table>
        </div>
      : <div className="container text-center" style={{ paddingTop: "100px" }}>
          <h1 className="display-4">There are no approved leave record.</h1>
        </div>;
  }
}

ApprovedLeaveList.propTypes = { approved_items: PropTypes.array.isRequired };

export default ApprovedLeaveList;
