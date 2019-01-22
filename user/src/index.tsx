import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Query, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';
import './spinners.css';

import { typeDefs } from './resolvers';

import Header from './containers/Header';
import MainLogin from './containers/MainLogin';
import Main from './containers/Main';
import LeaveCalendar from './containers/LeaveCalendar';
import ResetPassword from './containers/ResetPassword';
import UserError from './components/UserError';

const UserChangePassword = lazy(() => import('./containers/ChangePassword'));
const LeaveApplication = lazy(() => import('./containers/LeaveApplication'));

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
      uri: 'http://localhost:8080/graphql'
      // headers: {
      //   authorization: localStorage.getItem('auth_token')
      // }
    })
  ]),
  initializers: {
    isAuthenticated: () => !!localStorage.getItem('auth_token'),
    id: () => localStorage.getItem('id'),
    auth_token: () => localStorage.getItem('auth_token'),
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

function PrivateRoute({ component, ...rest }: any): JSX.Element {
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

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Header />
          <Suspense
            fallback={
              <div className="text-center" style={{ marginTop: '80px' }}>
                <div className="loader" />
              </div>
            }
          >
            <Switch>
              <PrivateRoute exact path="/" component={Main} />
              <Route path="/leavecalendar" component={LeaveCalendar} />
              <Route path="/reset" component={ResetPassword} />
              <Route path="/login" component={MainLogin} />
              <PrivateRoute
                path="/leaveapplication"
                component={LeaveApplication}
              />
              <PrivateRoute
                path="/changepassword"
                component={UserChangePassword}
              />
              <Route path="/login" component={UserError} />
            </Switch>
          </Suspense>
        </>
      </BrowserRouter>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
