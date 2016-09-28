import { combineReducers } from 'redux'

import { LOGIN_ADMIN_REQUEST, LOGIN_ADMIN_SUCCESS, LOGIN_ADMIN_FAILURE } from '../actions/AdminLogin'

import { LOGOUT_ADMIN_REQUEST, LOGOUT_ADMIN_SUCCESS } from '../actions/AdminLogout'

import { REQUEST_PENDING_LEAVE, RECEIVE_PENDING_LEAVE, ERROR_PENDING_LEAVE } from '../actions/PendingLeave'

import { REQUEST_APPROVED_LEAVE, RECEIVE_APPROVED_LEAVE, ERROR_APPROVED_LEAVE } from '../actions/ApprovedLeave'

const adminAuth = (state = {isFetching: false,
  isAuthenticated: true,
  message: '', auth_info: {}}, action) => {
  switch (action.type) {
    case LOGIN_ADMIN_REQUEST:
    return { ...state,
      isFetching: true,
      isAuthenticated: false}
    case LOGIN_ADMIN_SUCCESS:
    return { ...state,
      isFetching: false,
      isAuthenticated: true,
      auth_info: action.auth_info,
      message: 'Login successful!'}
    case LOGIN_ADMIN_FAILURE:
    return { ...state,
      isFetching: false,
      isAuthenticated: false,
      message: action.message}
    case LOGOUT_ADMIN_REQUEST:
    return { ...state,
      isFetching: true,
      isAuthenticated: true}
    case LOGOUT_ADMIN_SUCCESS:
    return { ...state,
      isFetching: false,
      isAuthenticated: false,
      message: '',
      auth_info: ''}
    default:
      return state
  }
}

const pendingLeave = (state = {isFetching: false,
  message: '', items: []}, action) => {
  switch (action.type) {
    case REQUEST_PENDING_LEAVE:
    return { ...state,
      isFetching: true}
    case RECEIVE_PENDING_LEAVE:
    return { ...state,
      isFetching: false,
      items: action.records}
    case ERROR_PENDING_LEAVE:
    return { ...state,
      isFetching: false,
      message: action.message}
    default:
      return state
  }
}

const approvedLeave = (state = {isFetching: false,
  message: '', items: []}, action) => {
  switch (action.type) {
    case REQUEST_APPROVED_LEAVE:
    return { ...state,
      isFetching: true}
    case RECEIVE_APPROVED_LEAVE:
    return { ...state,
      isFetching: false,
      items: action.records}
    case ERROR_APPROVED_LEAVE:
    return { ...state,
      isFetching: false,
      message: action.message}
    default:
      return state
  }
}

const rootReducer = combineReducers({
  adminAuth,
  pendingLeave,
  approvedLeave
})

export default rootReducer
