import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import configureStore from './stores/ConfigureStore'

import AdminHeader from './containers/AdminHeader'
import PendingLeave from './containers/PendingLeave'
import ApprovedLeave from './containers/ApprovedLeave'
import NewRecord from './containers/NewRecord'

import './index.css'
import './App.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AdminHeader}>
        <IndexRoute component={PendingLeave} />
        <Route path="/approvedleave" component={ApprovedLeave} />
        <Route path="/newrecord" component={NewRecord} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
