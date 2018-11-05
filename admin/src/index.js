// @flow
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';
import './spinners.css';

import configureStore from './stores/ConfigureStore';

import AdminHeader from './containers/AdminHeader';
import AdminLogin from './containers/AdminLogin';
import PendingLeave from './containers/PendingLeave';
import AdminResetPassword from './containers/AdminResetPassword';
import Error from './components/Error';

const ApprovedLeave = lazy(() => import('./containers/ApprovedLeave'));
const StaffRecord = lazy(() => import('./containers/StaffRecord'));
const ArchivedStaffRecord = lazy(() =>
  import('./containers/ArchivedStaffRecord')
);
const LeaveReport = lazy(() => import('./containers/LeaveReport'));
const SickSheetRecord = lazy(() => import('./containers/SickSheetRecord'));
const CreateUser = lazy(() => import('./containers/CreateUser'));
const PublicHoliday = lazy(() => import('./containers/PublicHoliday'));

const store = configureStore();

const client = new ApolloClient({ uri: 'http://localhost:8080/graphql' });

function PrivateRoute({ component, ...rest }) {
  return (
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
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="text-center">
                <div className="loader1" />
              </div>
            }
          >
            <AdminHeader />
            <Switch>
              <PrivateRoute exact path="/" component={PendingLeave} />
              <PrivateRoute path="/staffrecord" component={StaffRecord} />
              <PrivateRoute path="/approvedleave" component={ApprovedLeave} />
              <PrivateRoute path="/leavereport" component={LeaveReport} />
              <PrivateRoute
                path="/sicksheetrecord"
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
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}

const root = document.getElementById('root');

if (root instanceof Element) {
  ReactDOM.render(<App />, root);
}

registerServiceWorker();
