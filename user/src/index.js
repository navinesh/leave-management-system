import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import configureStore from './stores/configureStore'

import Header from './containers/header'
import Main from './containers/main'
import LeaveCalendar from './containers/leavecalendar'
import ResetPassword from './containers/resetpassword'
import UserChangePassword from './containers/changepassword'
import UserError from './components/usererror'
import LeaveApplication from './containers/leaveapplication'

import './bootstrap.min.css'
import './react-datepicker.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Header}>
        <IndexRoute component={Main} />
        <Route path="/leavecalendar" component={LeaveCalendar} />
        <Route path="/leaveapplication" component={LeaveApplication} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/changepassword" component={UserChangePassword} />
      </Route>
      <Route path="*" component={UserError}/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
