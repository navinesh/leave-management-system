import React, { PropTypes } from "react";
import { Link } from "react-router";

const moment = require("moment");

const ApprovedRecordList = ({ approved_items }) => {
  const items = approved_items
    .filter(record => {
      // get current date and format it
      let dateToday = moment();

      let todayDate = dateToday.format("DD/MM/YYYY");

      // get end date and format it
      let end_Date = moment(record.end_date, "DD/MM/YYYY").format("DD/MM/YYYY");

      // check if current date and end date is same
      let isCurrentDate = todayDate === end_Date ? true : false;

      // check if end date is same or greater than current date
      let eDate = moment(record.end_date, "DD/MM/YYYY").format("MM/DD/YYYY");

      let endDate = moment(new Date(eDate));

      let isEndDate = endDate.isSameOrAfter(dateToday);

      // return true for current and future leaves
      return isCurrentDate || isEndDate ? true : false;
    })
    .map(data => {
      return (
        <tr key={data.id}>
          <td>{data.user.othernames}{" "}{data.user.surname}</td>
          <td>{data.leave_name}</td>
          <td>{data.leave_type}</td>
          <td>{data.start_date}</td>
          <td>{data.end_date}</td>
          <td>{data.leave_days}</td>
          <td>
            <Link to="/reset" className="btn btn-info btn-sm">Edit</Link>
          </td>
          <td>
            <Link to="/reset" className="btn btn-danger btn-sm">Delete</Link>
          </td>
        </tr>
      );
    });

  return items.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
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
    ) : (
      <div className="container text-center" style={{ paddingTop: "100px" }}>
        <h1 className="display-3">There are no approved leave record.</h1>
      </div>
    );
};

const ApprovedLeaveList = ({ approved_items }) => (
  <ApprovedRecordList approved_items={approved_items} />
);

ApprovedLeaveList.propTypes = { approved_items: PropTypes.array.isRequired };

export default ApprovedLeaveList;
