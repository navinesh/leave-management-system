// @flow
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';
import './spinners.css';

import { typeDefs } from './resolvers';

import AdminHeader from './containers/AdminHeader';
import AdminLogin from './containers/AdminLogin';
import PendingLeave from './containers/PendingLeave';
import AdminResetPassword from './containers/AdminResetPassword';
import Error from './components/Error';

const ApprovedLeave = lazy(() => import('./containers/ApprovedLeave'));
const StaffView = lazy(() => import('./containers/StaffView'));
const LeaveReport = lazy(() => import('./containers/LeaveReport'));
const SickSheetRecord = lazy(() => import('./containers/SickSheetRecord'));
const CreateUser = lazy(() => import('./containers/CreateUser'));
const PublicHoliday = lazy(() => import('./containers/PublicHoliday'));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: 'http://localhost:8000/graphql'
      // headers: {
      //   authorization: localStorage.getItem('auth_token')
      // }
    })
  ]),
  initializers: {
    isAuthenticated: () => !!localStorage.getItem('admin_token'),
    admin_user: () => localStorage.getItem('admin_user'),
    admin_token: () => localStorage.getItem('admin_token'),
    sessionError: () => ''
  },
  typeDefs,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
});

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

function PrivateRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (
        <Query query={IS_AUTHENTICATED}>
          {({ data }) => {
            return data.isAuthenticated ? (
              React.createElement(component, props)
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location }
                }}
              />
            );
          }}
        </Query>
      )}
    />
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <AdminHeader />
          <Suspense
            fallback={
              <div className="text-center" style={{ marginTop: '80px' }}>
                <div className="loader" />
              </div>
            }
          >
            <Switch>
              <PrivateRoute exact path="/" component={PendingLeave} />
              <PrivateRoute path="/approvedleave" component={ApprovedLeave} />
              <PrivateRoute path="/staffview" component={StaffView} />
              <PrivateRoute path="/createuser" component={CreateUser} />
              <PrivateRoute path="/leavereport" component={LeaveReport} />
              <PrivateRoute
                path="/sicksheetrecord"
                component={SickSheetRecord}
              />
              <PrivateRoute path="/publicholiday" component={PublicHoliday} />
              <Route path="/login" component={AdminLogin} />
              <Route path="/resetpassword" component={AdminResetPassword} />
              <Route component={Error} />
            </Switch>
          </Suspense>
        </>
      </BrowserRouter>
    </ApolloProvider>
  );
}

const root = document.getElementById('root');

if (root instanceof Element) {
  ReactDOM.render(<App />, root);
}

registerServiceWorker();
