import React, { PropTypes } from "react";

const moment = require("moment");

const RecordList = ({ records }) => {
  const itemNodes = records
    .filter(record => {
      // get current date and format it
      let dateToday = moment();

      let todayDate = dateToday.format("DD/MM/YYYY");

      // get end date and format it
      let end_Date = moment(record.end_date, "DD/MM/YYYY").format("DD/MM/YYYY");

      // check if current date and end date is same
      let isCurrentDate = todayDate === end_Date ? true : false;

      // get end date and format it
      let eDate = moment(record.end_date, "DD/MM/YYYY").format("MM/DD/YYYY");

      let endDate = moment(new Date(eDate));

      // check if end date is same as or falls after current date
      let isEndDate = endDate.isSameOrAfter(dateToday);

      // return true for current and future dates
      return isCurrentDate || isEndDate ? true : false;
    })
    .map(data => {
      return (
        <tr key={data.id}>
          <td>{data.user.othernames} {data.user.surname}</td>
          <td>{data.leave_name}</td>
          <td>{data.start_date}</td>
          <td>{data.end_date}</td>
          <td>{data.leave_days}</td>
        </tr>
      );
    });

  return itemNodes.length > 0
    ? <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Leave type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
            </tr>
          </thead>
          <tbody>
            {itemNodes}
          </tbody>
        </table>
      </div>
    : <div className="container text-center" style={{ paddingTop: "100px" }}>
        <h1 className="display-3">There are no approved leave record.</h1>
      </div>;
};

const Leaves = ({ records }) => {
  return (
    <div style={{ marginTop: "80px" }}><RecordList records={records} /></div>
  );
};

Leaves.propTypes = { records: PropTypes.array.isRequired };

export default Leaves;
