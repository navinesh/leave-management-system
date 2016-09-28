import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import configureStore from './stores/ConfigureStore'

import AdminHeader from './containers/AdminHeader'
import NewRecord from './containers/NewRecord'
import PendingLeave from './containers/PendingLeave'

import './index.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AdminHeader}>
        <IndexRoute component={PendingLeave} />
        <Route path="/newrecord" component={NewRecord} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
