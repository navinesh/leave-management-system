// @flow
import React, { Fragment, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';

import configureStore from './stores/ConfigureStore';

import MainLogin from './containers/MainLogin';
import LeaveCalendar from './containers/LeaveCalendar';
import ResetPassword from './containers/ResetPassword';
import UserError from './components/UserError';

const Header = lazy(() => import('./containers/Header'));
const Main = lazy(() => import('./containers/Main'));
const UserChangePassword = lazy(() => import('./containers/ChangePassword'));
const LeaveApplication = lazy(() => import('./containers/LeaveApplication'));

const store = configureStore();

const client = new ApolloClient({ uri: 'http://localhost:8080/graphql' });

function PrivateRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        store.getState().userAuth.isAuthenticated ? (
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
            <Header />
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
              <Route component={UserError} />
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
