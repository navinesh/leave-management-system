import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import configureStore from './stores/ConfigureStore'

import AdminHeader from './containers/AdminHeader'
import PendingLeave from './containers/PendingLeave'
import ApprovedLeave from './containers/ApprovedLeave'
import StaffRecord from './containers/StaffRecord'
import ArchivedStaffRecord from './containers/ArchivedStaffRecord'
import LeaveReport from './containers/LeaveReport'
import SickSheetRecord from './containers/SickSheetRecord'
import NewRecord from './containers/NewRecord'

import { fetchLoginFromToken } from './actions/AdminLogin'

import './index.css'
import './bootstrap.min.css'

const store = configureStore()

const requireAuthentication = (nextState, replace) => {
  let admin_token = store.getState().adminAuth.auth_info.admin_token
  if(admin_token) {
    store.dispatch(fetchLoginFromToken(admin_token))
  }
  else {
    admin_token = localStorage.getItem('admin_token')
    if(admin_token) {
      store.dispatch(fetchLoginFromToken(admin_token))
    }
  }
  let isAuthenticated = store.getState().adminAuth.isAuthenticated
  if (!isAuthenticated) {
    replace('/')
  }
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AdminHeader}>
        <IndexRoute component={PendingLeave} />
        <Route path="/staffrecord" onEnter={requireAuthentication} component={StaffRecord} />
        <Route path="/approvedleave" onEnter={requireAuthentication} component={ApprovedLeave} />
        <Route path="/leavereport" onEnter={requireAuthentication} component={LeaveReport} />
        <Route path="/sicksheetrecord" onEnter={requireAuthentication} component={SickSheetRecord} />
        <Route path="/sicksheetrecord/:fileId" onEnter={requireAuthentication} component={SickSheetRecord}/>
        <Route path="/newrecord" onEnter={requireAuthentication} component={NewRecord} />
        <Route path="/archivedstaffrecord" onEnter={requireAuthentication} component={ArchivedStaffRecord} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
