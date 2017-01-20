import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import axios from "axios";

import configureStore from "./stores/ConfigureStore";

import AdminHeader from "./containers/AdminHeader";
//import AdminSidebar from './containers/Sidebar'
import PendingLeave from "./containers/PendingLeave";
import ApprovedLeave from "./containers/ApprovedLeave";
import StaffRecord from "./containers/StaffRecord";
import ArchivedStaffRecord from "./containers/ArchivedStaffRecord";
import LeaveReport from "./containers/LeaveReport";
import SickSheetRecord from "./containers/SickSheetRecord";
import NewRecord from "./containers/NewRecord";
import Error from "./components/Error";
import {
  requestAdminLoginFromToken,
  loginAdminErrorFromToken,
  receiveAdminLoginFromToken
} from "./actions/AdminLogin";

import "./index.css";
import "./bootstrap.min.css";

const store = configureStore();

export const requireAuthentication = (nextState, replace, callback) => {
  let admin_token = store.getState().adminAuth.auth_info.admin_token;
  if (admin_token) {
    store.dispatch(requestAdminLoginFromToken(admin_token));
    axios
      .post("http://localhost:8080/admintoken", { admin_token: admin_token })
      .then(response => {
        if (response.status === 200) {
          if (location.pathname !== "/") {
            replace("/");
          }
          localStorage.removeItem("admin_token");
          store.dispatch(loginAdminErrorFromToken(response.data));
        } else {
          store.dispatch(receiveAdminLoginFromToken(response.data));
        }
        callback();
      })
      .catch(error => {
        callback(error);
      });
  } else {
    admin_token = localStorage.getItem("admin_token");
    if (admin_token) {
      store.dispatch(requestAdminLoginFromToken(admin_token));
      axios
        .post("http://localhost:8080/admintoken", { admin_token: admin_token })
        .then(response => {
          if (response.status === 200) {
            if (location.pathname !== "/") {
              replace("/");
            }
            localStorage.removeItem("admin_token");
            store.dispatch(loginAdminErrorFromToken(response.data));
          } else {
            store.dispatch(receiveAdminLoginFromToken(response.data));
          }
          callback();
        })
        .catch(error => {
          callback(error);
        });
    }
  }
  let isAuthenticated = store.getState().adminAuth.isAuthenticated;
  if (!isAuthenticated) {
    if (location.pathname !== "/") {
      replace("/");
    }
    callback();
  }
};

render(
  (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={AdminHeader}>
          <IndexRoute
            onEnter={requireAuthentication}
            component={PendingLeave}
          />
          <Route
            path="/staffrecord"
            onEnter={requireAuthentication}
            component={StaffRecord}
          />
          <Route
            path="/approvedleave"
            onEnter={requireAuthentication}
            component={ApprovedLeave}
          />
          <Route
            path="/leavereport"
            onEnter={requireAuthentication}
            component={LeaveReport}
          />
          <Route
            path="/sicksheetrecord"
            onEnter={requireAuthentication}
            component={SickSheetRecord}
          />
          <Route
            path="/sicksheetrecord/:fileId"
            onEnter={requireAuthentication}
            component={SickSheetRecord}
          />
          <Route
            path="/archivedstaffrecord"
            onEnter={requireAuthentication}
            component={ArchivedStaffRecord}
          />
          <Route
            path="/newrecord"
            onEnter={requireAuthentication}
            component={NewRecord}
          />
        </Route>
        <Route path="*" component={Error} />
      </Router>
    </Provider>
  ),
  document.getElementById("root")
);
