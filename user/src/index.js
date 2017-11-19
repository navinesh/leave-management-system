// @flow
import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './index.css';
import './bootstrap.min.css';

import Header from './containers/Header';
import MainLogin from './containers/MainLogin';
import Main from './containers/Main';
import LeaveCalendar from './containers/LeaveCalendar';
import ResetPassword from './containers/ResetPassword';
import UserChangePassword from './containers/ChangePassword';
import UserError from './components/UserError';
import LeaveApplication from './containers/LeaveApplication';

import configureStore from './stores/ConfigureStore';
const store = configureStore();

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8080/graphql' }),
  cache: new InMemoryCache()
});

const PrivateRoute = ({ component, ...rest }) => (
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
      )}
  />
);

const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <div>
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
        </div>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
