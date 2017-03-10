import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import configureStore from "./stores/ConfigureStore";
const store = configureStore();

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import "./index.css";
import "./bootstrap.min.css";

import AdminHeader from "./containers/AdminHeader";
import PendingLeave from "./containers/PendingLeave";
import ApprovedLeave from "./containers/ApprovedLeave";
import StaffRecord from "./containers/StaffRecord";
import ArchivedStaffRecord from "./containers/ArchivedStaffRecord";
import LeaveReport from "./containers/LeaveReport";
import SickSheetRecord from "./containers/SickSheetRecord";
import NewRecord from "./containers/NewRecord";
import PublicHoliday from "./containers/PublicHoliday";
import Error from "./components/Error";

/*const requireAuthentication = (nextState, replace, callback) => {
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
};*/

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props => store.getState().adminAuth.isAuthenticated
      ? React.createElement(component, props)
      : <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />}
  />
);

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <AdminHeader />
        <Switch>
          <Route exact path="/" component={PendingLeave} />
          <PrivateRoute path="/staffrecord" component={StaffRecord} />
          <PrivateRoute path="/approvedleave" component={ApprovedLeave} />
          <PrivateRoute path="/leavereport" component={LeaveReport} />
          <PrivateRoute path="/sicksheetrecord" component={SickSheetRecord} />
          <PrivateRoute
            path="/sicksheetrecord/:fileId"
            component={SickSheetRecord}
          />
          <PrivateRoute
            path="/archivedstaffrecord"
            component={ArchivedStaffRecord}
          />
          <PrivateRoute path="/newrecord" component={NewRecord} />
          <PrivateRoute path="/publicholiday" component={PublicHoliday} />
          <Route component={Error} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

render(<App />, document.getElementById("root"));
