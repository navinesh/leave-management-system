// @flow
import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';

import Header from './containers/Header';
import Main from './containers/Main';
import StaffLeaveCalendar from './containers/StaffLeaveCalendar';
import ResetPassword from './containers/ResetPassword';
import UserChangePassword from './containers/ChangePassword';
import UserError from './components/UserError';
import LeaveApplication from './containers/LeaveApplication';

import configureStore from './stores/ConfigureStore';
const store = configureStore();

const PrivateRoute = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      store.getState().userAuth.isAuthenticated
        ? React.createElement(component, props)
        : <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />}
  />;

const App = () =>
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
  </Provider>;

render(<App />, document.getElementById('root'));
