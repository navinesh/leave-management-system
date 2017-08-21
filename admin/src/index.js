// @flow
import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';

import AdminHeader from './containers/AdminHeader';
import AdminLogin from './containers/AdminLogin';
import PendingLeave from './containers/PendingLeave';
import ApprovedLeave from './containers/ApprovedLeave';
import StaffRecord from './containers/StaffRecord';
import ArchivedStaffRecord from './containers/ArchivedStaffRecord';
import LeaveReport from './containers/LeaveReport';
import SickSheetRecord from './containers/SickSheetRecord';
import NewRecord from './containers/NewRecord';
import PublicHoliday from './containers/PublicHoliday';
import AdminResetPassword from './containers/AdminResetPassword';
import Error from './components/Error';

import { Provider } from 'react-redux';
import configureStore from './stores/ConfigureStore';
const store = configureStore();

const PrivateRoute = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      store.getState().adminAuth.isAuthenticated
        ? React.createElement(component, props)
        : <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />}
  />;

const App = () =>
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <AdminHeader />
        <Switch>
          <PrivateRoute exact path="/" component={PendingLeave} />
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
          <Route path="/login" component={AdminLogin} />
          <Route path="/resetpassword" component={AdminResetPassword} />
          <Route component={Error} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>;

render(<App />, document.getElementById('root'));
