import { combineReducers } from 'redux';

import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST_FROM_TOKEN,
  LOGIN_USER_SUCCESS_FROM_TOKEN,
  LOGIN_USER_FAILURE_FROM_TOKEN,
  LOGIN_FAILURE_FROM_TOKEN
} from '../actions/UserLogin';

import { LOGOUT_USER_REQUEST } from '../actions/UserLogout';
import { LOGOUT_USER_SUCCESS } from '../actions/UserLogout';

import {
  REQUEST_USER_RECORD,
  RECEIVE_USER_RECORD,
  USER_RECORD_ERROR,
  CLEAR_USER_RECORD
} from '../actions/UserRecord';

import {
  REQUEST_USER_DETAILS,
  RECEIVE_USER_DETAILS,
  USER_DETAILS_ERROR,
  CLEAR_USER_DETAILS
} from '../actions/UserDetails';

import {
  LEAVE_APPLICATION_REQUEST,
  LEAVE_APPLICATION_SUCCESS,
  LEAVE_APPLICATION_FAILURE
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
  PASSWORD_RESET_ERROR
} from '../actions/ResetPassword';

import {
  REQUEST_PUBLIC_HOLIDAY,
  RECEIVE_PUBLIC_HOLIDAY,
  ERROR_PUBLIC_HOLIDAY
} from '../actions/PublicHoliday';

type UserAuth = {
  isFetching: boolean,
  isAuthenticated: boolean,
  message: string,
  auth_info: Object
};

const userAuth = (
  state: UserAuth = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('auth_token') ? true : false,
    message: '',
    auth_info: {}
  },
  action
) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info,
        message: 'Login successful!'
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      };
    case LOGOUT_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: true
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: '',
        auth_info: ''
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
        auth_info: action.auth_info,
        message: 'Login successful!'
      };
    case LOGIN_USER_FAILURE_FROM_TOKEN:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      };
    case LOGIN_FAILURE_FROM_TOKEN:
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
};

type UserRecords = {
  isFetching: boolean,
  userRecord: Array<any>,
  message: string
};

const userRecords = (
  state: UserRecords = {
    isFetching: false,
    userRecord: [],
    message: ''
  },
  action
) => {
  switch (action.type) {
    case REQUEST_USER_RECORD:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_USER_RECORD:
      return {
        ...state,
        isFetching: false,
        userRecord: action.user_record
      };
    case USER_RECORD_ERROR:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case CLEAR_USER_RECORD:
      return {
        ...state,
        isFetching: false,
        message: '',
        userRecord: []
      };
    default:
      return state;
  }
};

type UserDeatils = {
  isFetching: boolean,
  userDetail: Object,
  message: string
};

const userDetails = (
  state: UserDeatils = {
    isFetching: false,
    userDetail: {},
    message: ''
  },
  action
) => {
  switch (action.type) {
    case REQUEST_USER_DETAILS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_USER_DETAILS:
      return {
        ...state,
        isFetching: false,
        userDetail: action.user_detail
      };
    case USER_DETAILS_ERROR:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    case CLEAR_USER_DETAILS:
      return {
        ...state,
        isFetching: false,
        message: '',
        userDetail: {}
      };
    default:
      return state;
  }
};

type LeaveApplication = {
  isFetching: boolean,
  message: string
};

const leaveApplication = (
  state: LeaveApplication = {
    isFetching: false,
    message: ''
  },
  action
) => {
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
        isFetching: false
      };
    case LEAVE_APPLICATION_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    default:
      return state;
  }
};

type ChangePassword = {
  isFetching: boolean,
  message: string
};

const changePassword = (
  state: ChangePassword = {
    isFetching: false,
    message: ''
  },
  action
) => {
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
};

type ResetPassword = {
  isFetching: boolean,
  message: string
};

const resetPassword = (
  state: ResetPassword = {
    isFetching: false,
    message: ''
  },
  action
) => {
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
    default:
      return state;
  }
};

type PublicHoliday = {
  isFetching: boolean,
  public_holiday: Array<any>
};

const publicHoliday = (
  state: PublicHoliday = { isFetching: false, public_holiday: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_PUBLIC_HOLIDAY:
      return { ...state, isFetching: true };
    case RECEIVE_PUBLIC_HOLIDAY:
      return {
        ...state,
        isFetching: false,
        public_holiday: action.public_holiday
      };
    case ERROR_PUBLIC_HOLIDAY:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  userAuth,
  userRecords,
  userDetails,
  leaveApplication,
  changePassword,
  resetPassword,
  publicHoliday
});

export default rootReducer;
