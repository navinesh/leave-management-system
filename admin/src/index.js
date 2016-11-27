import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import axios from 'axios'

import configureStore from './stores/ConfigureStore'

import AdminHeader from './containers/AdminHeader'
import AdminSidebar from './containers/Sidebar'
import PendingLeave from './containers/PendingLeave'
import ApprovedLeave from './containers/ApprovedLeave'
import StaffRecord from './containers/StaffRecord'
import ArchivedStaffRecord from './containers/ArchivedStaffRecord'
import LeaveReport from './containers/LeaveReport'
import SickSheetRecord from './containers/SickSheetRecord'
import NewRecord from './containers/NewRecord'
import Error from './components/Error'

import { requestAdminLoginFromToken, loginAdminErrorFromToken, receiveAdminLoginFromToken } from './actions/AdminLogin'

import './index.css'
import './bootstrap.min.css'

const store = configureStore()

export const requireAuthentication = (nextState, replace, callback) => {
  let admin_token = store.getState().adminAuth.auth_info.admin_token
  if(admin_token) {
    store.dispatch(requestAdminLoginFromToken(admin_token))
    axios.post('http://localhost:8080/admintoken', {
      admin_token: admin_token
    })
    .then((response) => {
      if (response.status === 200){
        if (location.pathname !== '/') {
          replace('/')
        }
        localStorage.removeItem('admin_token')
        store.dispatch(loginAdminErrorFromToken(response.data))
      }
      else {
        store.dispatch(receiveAdminLoginFromToken(response.data))
      }
      callback()
    })
    .catch((error) => {
      callback(error)
    })
  }
  else {
    admin_token = localStorage.getItem('admin_token')
    if(admin_token) {
      store.dispatch(requestAdminLoginFromToken(admin_token))
      axios.post('http://localhost:8080/admintoken', {
        admin_token: admin_token
      })
      .then((response) => {
        if (response.status === 200){
          if (location.pathname !== '/') {
            replace('/')
          }
          localStorage.removeItem('admin_token')
          store.dispatch(loginAdminErrorFromToken(response.data))
        }
        else {
          store.dispatch(receiveAdminLoginFromToken(response.data))
        }
        callback()
      })
      .catch((error) => {
        callback(error)
      })
    }
  }
  let isAuthenticated = store.getState().adminAuth.isAuthenticated
  if (!isAuthenticated) {
    if (location.pathname !== '/') {
      replace('/')
    }
    callback()
  }
}

const App = ({ main }) =>
  <div className="App">
    <div className="Header">
      <AdminHeader />
    </div>
    <div className="col-sm-2 p-0">
      <AdminSidebar />
    </div>
    <div className="col-sm-10">
      {main}
    </div>
  </div>

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute onEnter={requireAuthentication} components={{main: PendingLeave}}/>
        <Route path="/staffrecord" onEnter={requireAuthentication} components={{main: StaffRecord}} />
        <Route path="/approvedleave" onEnter={requireAuthentication} components={{main: ApprovedLeave}} />
        <Route path="/leavereport" onEnter={requireAuthentication} components={{main: LeaveReport}} />
        <Route path="/sicksheetrecord" onEnter={requireAuthentication} components={{main: SickSheetRecord}} />
        <Route path="/sicksheetrecord/:fileId" onEnter={requireAuthentication} components={{main: SickSheetRecord}}/>
        <Route path="/archivedstaffrecord" onEnter={requireAuthentication} components={{main: ArchivedStaffRecord}} />
        <Route path="/newrecord" onEnter={requireAuthentication} components={{main: NewRecord} }/>
      </Route>
      <Route path="*" component={Error}/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
