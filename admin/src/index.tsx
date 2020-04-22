import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { useQuery, ApolloProvider } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';

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

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
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
      uri: 'http://localhost:8080/graphql',
      // headers: {
      //   authorization: localStorage.getItem('auth_token')
      // }
    }),
  ]),
  typeDefs,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

cache.writeData({
  data: {
    isAuthenticated: !!localStorage.getItem('admin_token'),
    admin_user: localStorage.getItem('admin_user'),
    admin_token: localStorage.getItem('admin_token'),
    sessionError: '',
  },
});

const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

function PrivateRoute({ children, ...rest }: any): JSX.Element {
  const { data } = useQuery(IS_AUTHENTICATED);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return data.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <AdminHeader />
          <Suspense
            fallback={
              <div className="text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
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

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
