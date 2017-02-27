import React from "react";
import { connect } from "react-redux";
import { fetchLogin } from "../actions/AdminLogin";
import Login from "../components/AdminLogin";

const AdminLogin = ({ dispatch, message, isAuthenticated, isFetching }) => (
  <div className="AdminLogin">
    {!isAuthenticated &&
      <Login
        isFetching={isFetching}
        message={message}
        onLoginClick={creds => dispatch(fetchLogin(creds))}
      />}
  </div>
);

const mapStateToProps = state => {
  const { adminAuth } = state;
  const { isAuthenticated, message, isFetching } = adminAuth;

  return { message, isAuthenticated, isFetching };
};

export default connect(mapStateToProps)(AdminLogin);
