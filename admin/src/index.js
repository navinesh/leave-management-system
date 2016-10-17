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

import './index.css'
import './bootstrap.min.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AdminHeader}>
        <IndexRoute component={PendingLeave} />
        <Route path="/staffrecord" component={StaffRecord} />
        <Route path="/approvedleave" component={ApprovedLeave} />
        <Route path="/leavereport" component={LeaveReport} />
        <Route path="/sicksheetrecord" component={SickSheetRecord} />
        <Route path="/sicksheetrecord/:fileId" component={SickSheetRecord}/>
        <Route path="/newrecord" component={NewRecord} />
        <Route path="/archivedstaffrecord" component={ArchivedStaffRecord} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
