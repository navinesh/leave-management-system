import React from "react";
import { connect } from "react-redux";
import LeaveCalendar from "./leavecalendar";
import UserLogin from "./userlogin";
import UserRecord from "./userrecord";

const Main = ({ isAuthenticated }) => {
  return (
    <div className="Main">
      {
        !isAuthenticated && (
            <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <LeaveCalendar />
                </div>
                <div className="col-md-4">
                  <UserLogin />
                </div>
              </div>
            </div>
          )
      }
      {isAuthenticated && <UserRecord />}
    </div>
  );
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(Main);
