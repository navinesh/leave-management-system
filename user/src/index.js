import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import axios from 'axios'

import configureStore from './stores/configureStore'

import Header from './containers/header'
import Main from './containers/main'
import StaffLeaveCalendar from './containers/staffleavecalendar'
import ResetPassword from './containers/resetpassword'
import UserChangePassword from './containers/changepassword'
import UserError from './components/usererror'
import LeaveApplication from './containers/leaveapplication'

import { requestUserLoginFromToken, loginUserErrorFromToken, receiveUserLoginFromToken } from './actions/userlogin'


import './bootstrap.min.css'
import './react-datepicker.css'

const store = configureStore()

export const requireAuthentication = (nextState, replace, callback) => {
  let auth_token = store.getState().userAuth.auth_info.auth_token
  if(auth_token) {
    store.dispatch(requestUserLoginFromToken(auth_token))
    axios.post('http://localhost:8080/usertoken', {
      auth_token: auth_token
    })
    .then((response) => {
      if (response.status === 200){
        if (location.pathname !== '/') {
          replace('/')
        }
        localStorage.removeItem('auth_token')
        store.dispatch(loginUserErrorFromToken(response.data))
      }
      else {
        store.dispatch(receiveUserLoginFromToken(response.data))
      }
      callback()
    })
    .catch((error) => {
      callback(error)
    })
  }
  else {
    auth_token = localStorage.getItem('auth_token')
    if(auth_token) {
      store.dispatch(requestUserLoginFromToken(auth_token))
      axios.post('http://localhost:8080/usertoken', {
        auth_token: auth_token
      })
      .then((response) => {
        if (response.status === 200){
          if (location.pathname !== '/') {
            replace('/')
          }
          localStorage.removeItem('auth_token')
          store.dispatch(loginUserErrorFromToken(response.data))
        }
        else {
          store.dispatch(receiveUserLoginFromToken(response.data))
        }
        callback()
      })
      .catch((error) => {
        callback(error)
      })
    }
  }
  let isAuthenticated = store.getState().userAuth.isAuthenticated
  if (!isAuthenticated) {
    if (location.pathname !== '/') {
      replace('/')
    }
    callback()
  }
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Header}>
        <IndexRoute component={Main} />
        <Route path="/leavecalendar" component={StaffLeaveCalendar} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/leaveapplication" onEnter={requireAuthentication} component={LeaveApplication} />
        <Route path="/changepassword" onEnter={requireAuthentication} component={UserChangePassword} />
      </Route>
      <Route path="*" component={UserError}/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
