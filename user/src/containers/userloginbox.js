import React from "react";
import { connect } from "react-redux";
import UserLoginBox from "./userlogincontainer";

const MainUserLoginBox = ({ isAuthenticated }) => {
  return (
    <div className="MainView">
      {
        !isAuthenticated && (
            <div className="row">
              <div className="col-md-4 offset-md-4">
                <UserLoginBox />
              </div>
            </div>
          )
      }
    </div>
  );
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(MainUserLoginBox);
