// @flow
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';
import './spinners.css';

import AdminHeader from './containers/AdminHeader';
import AdminLogin from './containers/AdminLogin';
import PendingLeave from './containers/PendingLeave';
import ApprovedLeave from './containers/ApprovedLeave';
import StaffRecord from './containers/StaffRecord';
import ArchivedStaffRecord from './containers/ArchivedStaffRecord';
import LeaveReport from './containers/LeaveReport';
import SickSheetRecord from './containers/SickSheetRecord';
import CreateUser from './containers/CreateUser';
import PublicHoliday from './containers/PublicHoliday';
import AdminResetPassword from './containers/AdminResetPassword';
import Error from './components/Error';

import configureStore from './stores/ConfigureStore';
const store = configureStore();

const client = new ApolloClient({ uri: 'http://localhost:8080/graphql' });

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      store.getState().adminAuth.isAuthenticated ? (
        React.createElement(component, props)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
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
            <PrivateRoute path="/createuser" component={CreateUser} />
            <PrivateRoute path="/publicholiday" component={PublicHoliday} />
            <Route path="/login" component={AdminLogin} />
            <Route path="/resetpassword" component={AdminResetPassword} />
            <Route component={Error} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
);

const root = document.getElementById('root');

if (root instanceof Element) {
  ReactDOM.render(<App />, root);
}

registerServiceWorker();
