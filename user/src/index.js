import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import configureStore from "./stores/configureStore";
const store = configureStore();

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "./index.css";
import "./bootstrap.min.css";

import Header from "./containers/header";
import Main from "./containers/main";
import StaffLeaveCalendar from "./containers/staffleavecalendar";
import ResetPassword from "./containers/resetpassword";
import UserChangePassword from "./containers/changepassword";
import UserError from "./components/usererror";
import LeaveApplication from "./containers/leaveapplication";

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      store.getState().userAuth.isAuthenticated
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
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/leavecalendar" component={StaffLeaveCalendar} />
          <Route path="/reset" component={ResetPassword} />
          <PrivateRoute path="/leaveapplication" component={LeaveApplication} />
          <PrivateRoute path="/changepassword" component={UserChangePassword} />
          <Route component={UserError} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

render(<App />, document.getElementById("root"));
