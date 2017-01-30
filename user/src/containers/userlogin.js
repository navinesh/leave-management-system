import React from "react";
import { connect } from "react-redux";
import { fetchLogin } from "../actions/userlogin";
import Login from "../components/userlogin";

const UserLogin = ({ dispatch, message, isAuthenticated, isFetching }) => {
  return (
    <div className="UserLogin">
      {
        !isAuthenticated &&
          (
            <Login
              isFetching={isFetching}
              message={message}
              onLoginClick={creds => dispatch(fetchLogin(creds))}
            />
          )
      }
    </div>
  );
};

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated, message, isFetching } = userAuth;

  return { message, isAuthenticated, isFetching };
};

export default connect(mapStateToProps)(UserLogin);
