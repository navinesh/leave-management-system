import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import configureStore from "./stores/configureStore";
const store = configureStore();

import { BrowserRouter, Switch, Route } from "react-router-dom";

import axios from "axios";

import "./index.css";
import "./bootstrap.min.css";

import {
  requestUserLoginFromToken,
  loginUserErrorFromToken,
  receiveUserLoginFromToken
} from "./actions/userlogin";
import Header from "./containers/header";
import Main from "./containers/main";
import StaffLeaveCalendar from "./containers/staffleavecalendar";
import ResetPassword from "./containers/resetpassword";
import UserChangePassword from "./containers/changepassword";
import UserError from "./components/usererror";
import LeaveApplication from "./containers/leaveapplication";

export const requireAuthentication = (nextState, replace, callback) => {
  let auth_token = store.getState().userAuth.auth_info.auth_token;
  if (auth_token) {
    store.dispatch(requestUserLoginFromToken(auth_token));
    axios
      .post("http://localhost:8080/usertoken", { auth_token: auth_token })
      .then(response => {
        if (response.status === 200) {
          if (location.pathname !== "/") {
            replace("/");
          }
          localStorage.removeItem("auth_token");
          store.dispatch(loginUserErrorFromToken(response.data));
        } else {
          store.dispatch(receiveUserLoginFromToken(response.data));
        }
        callback();
      })
      .catch(error => {
        callback(error);
      });
  } else {
    auth_token = localStorage.getItem("auth_token");
    if (auth_token) {
      store.dispatch(requestUserLoginFromToken(auth_token));
      axios
        .post("http://localhost:8080/usertoken", { auth_token: auth_token })
        .then(response => {
          if (response.status === 200) {
            if (location.pathname !== "/") {
              replace("/");
            }
            localStorage.removeItem("auth_token");
            store.dispatch(loginUserErrorFromToken(response.data));
          } else {
            store.dispatch(receiveUserLoginFromToken(response.data));
          }
          callback();
        })
        .catch(error => {
          callback(error);
        });
    }
  }
  let isAuthenticated = store.getState().userAuth.isAuthenticated;
  if (!isAuthenticated) {
    if (location.pathname !== "/") {
      replace("/");
    }
    callback();
  }
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/leavecalendar" component={StaffLeaveCalendar} />
          <Route path="/reset" component={ResetPassword} />
          <Route path="/leaveapplication" component={LeaveApplication} />
          <Route path="/changepassword" component={UserChangePassword} />
          <Route component={UserError} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

render(<App />, document.getElementById("root"));
