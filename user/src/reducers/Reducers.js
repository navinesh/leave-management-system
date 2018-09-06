import { combineReducers } from 'redux';

import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST_FROM_TOKEN,
  LOGIN_USER_SUCCESS_FROM_TOKEN,
  LOGIN_USER_FAILURE_FROM_TOKEN
} from '../actions/UserLogin';

import { LOGOUT_USER } from '../actions/UserLogout';

import {
  LEAVE_APPLICATION_REQUEST,
  LEAVE_APPLICATION_SUCCESS,
  LEAVE_APPLICATION_FAILURE,
  CLEAR_LEAVE_APPLICATION_MESSAGE
} from '../actions/LeaveApplication';

import {
  REQUEST_PASSWORD_CHANGE,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_ERROR,
  CLEAR_CHANGE_PASSWORD_ERROR
} from '../actions/ChangePassword';

import {
  REQUEST_PASSWORD_RESET,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR,
  CLEAR_RESET_PASSWORD_MESSAGE
} from '../actions/ResetPassword';

type UserAuth = {
  isFetching: boolean,
  isAuthenticated: boolean,
  message: string,
  auth_info: Object
};

function userAuth(
  state: UserAuth = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('auth_token') ? true : false,
    message: '',
    auth_info: {}
  },
  action
) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        message: ''
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      };
    case LOGIN_USER_REQUEST_FROM_TOKEN:
      return {
        ...state,
        isFetching: true
      };
    case LOGIN_USER_SUCCESS_FROM_TOKEN:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info
      };
    case LOGIN_USER_FAILURE_FROM_TOKEN:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: 'Your session has expired!',
        auth_info: ''
      };
    default:
      return state;
  }
}

type LeaveApplication = {
  isFetching: boolean,
  message: string
};

function leaveApplication(
  state: LeaveApplication = {
    isFetching: false,
    message: ''
  },
  action
) {
  switch (action.type) {
    case LEAVE_APPLICATION_REQUEST:
      return {
        ...state,
        isFetching: true,
        message: ''
      };
    case LEAVE_APPLICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case LEAVE_APPLICATION_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case CLEAR_LEAVE_APPLICATION_MESSAGE:
      return {
        ...state,
        isFetching: false,
        message: ''
      };
    default:
      return state;
  }
}

type ChangePassword = {
  isFetching: boolean,
  message: string
};

function changePassword(
  state: ChangePassword = {
    isFetching: false,
    message: ''
  },
  action
) {
  switch (action.type) {
    case REQUEST_PASSWORD_CHANGE:
      return {
        ...state,
        isFetching: true
      };
    case PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case PASSWORD_CHANGE_ERROR:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case CLEAR_CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        isFetching: false,
        message: ''
      };
    default:
      return state;
  }
}

type ResetPassword = {
  isFetching: boolean,
  message: string
};

function resetPassword(
  state: ResetPassword = {
    isFetching: false,
    message: ''
  },
  action
) {
  switch (action.type) {
    case REQUEST_PASSWORD_RESET:
      return {
        ...state,
        isFetching: true
      };
    case PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case PASSWORD_RESET_ERROR:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case CLEAR_RESET_PASSWORD_MESSAGE:
      return {
        ...state,
        isFetching: false,
        message: ''
      };
    default:
      return state;
  }
}

const appReducer = combineReducers({
  userAuth,
  leaveApplication,
  changePassword,
  resetPassword
});

function rootReducer(state, action) {
  if (action.type === LOGOUT_USER) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
