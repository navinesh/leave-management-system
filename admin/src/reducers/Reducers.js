// @flow
import { combineReducers } from 'redux';

import {
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAILURE
} from '../actions/AdminLogin';

import {
  LOGIN_ADMIN_REQUEST_FROM_TOKEN,
  LOGIN_ADMIN_SUCCESS_FROM_TOKEN,
  LOGIN_ADMIN_FAILURE_FROM_TOKEN
} from '../actions/AdminLogin';

import {
  LOGOUT_ADMIN_REQUEST,
  LOGOUT_ADMIN_SUCCESS
} from '../actions/AdminLogout';

import {
  REQUEST_PASSWORD_RESET,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR
} from '../actions/AdminResetPassword';

import {
  NEW_USER_RECORD_REQUEST,
  NEW_USER_RECORD_SUCCESS,
  NEW_USER_RECORD_FAILURE,
  CLEAR_NEW_USER_RECORD
} from '../actions/NewRecord';

import {
  MODIFY_USER_RECORD_REQUEST,
  MODIFY_USER_RECORD_SUCCESS,
  MODIFY_USER_RECORD_FAILURE,
  CLEAR_MODIFY_USER_MESSAGE
} from '../actions/ModifyRecord';

import {
  APPROVE_LEAVE_REQUEST,
  APPROVE_LEAVE_SUCCESS,
  APPROVE_LEAVE_ERROR,
  CLEAR_APPROVE_LEAVE
} from '../actions/ApproveLeave';

import {
  DECLINE_LEAVE_REQUEST,
  DECLINE_LEAVE_SUCCESS,
  DECLINE_LEAVE_ERROR,
  CLEAR_DECLINE_LEAVE
} from '../actions/DeclineLeave';

import {
  EDIT_LEAVE_REQUEST,
  EDIT_LEAVE_SUCCESS,
  EDIT_LEAVE_FAILURE,
  CLEAR_EDIT_LEAVE
} from '../actions/EditLeave';

import {
  CANCEL_LEAVE_REQUEST,
  CANCEL_LEAVE_SUCCESS,
  CANCEL_LEAVE_ERROR,
  CLEAR_CANCEL_LEAVE
} from '../actions/CancelLeave';

type adminState = {
  isFetching: boolean,
  message: string,
  isAuthenticated: boolean,
  auth_info: Object
};

const adminAuth = (
  state: adminState = {
    isFetching: false,
    message: '',
    isAuthenticated: localStorage.getItem('admin_token') ? true : false,
    auth_info: {}
  },
  action
) => {
  switch (action.type) {
    case LOGIN_ADMIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        message: '',
        isAuthenticated: false
      };
    case LOGIN_ADMIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info
      };
    case LOGIN_ADMIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false
      };
    case LOGIN_ADMIN_REQUEST_FROM_TOKEN:
      return { ...state, isFetching: true };
    case LOGIN_ADMIN_SUCCESS_FROM_TOKEN:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info
      };
    case LOGIN_ADMIN_FAILURE_FROM_TOKEN:
      return {
        ...state,
        isFetching: false,
        message: action.message,
        isAuthenticated: false,
        auth_info: ''
      };
    case LOGOUT_ADMIN_REQUEST:
      return { ...state, isFetching: true, isAuthenticated: true };
    case LOGOUT_ADMIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        auth_info: ''
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

type addUserState = {
  isFetching: boolean,
  message: string
};

const addUser = (
  state: addUserState = { isFetching: false, message: '' },
  action
) => {
  switch (action.type) {
    case NEW_USER_RECORD_REQUEST:
      return { ...state, isFetching: true };
    case NEW_USER_RECORD_SUCCESS:
      return { ...state, isFetching: false, message: action.message };
    case NEW_USER_RECORD_FAILURE:
      return { ...state, isFetching: false, message: action.message };
    case CLEAR_NEW_USER_RECORD:
      return { ...state, isFetching: false, message: '' };
    default:
      return state;
  }
};

type modifyUserState = {
  isFetching: boolean,
  message: string
};

const modifyUser = (
  state: modifyUserState = { isFetching: false, message: '' },
  action
) => {
  switch (action.type) {
    case MODIFY_USER_RECORD_REQUEST:
      return { ...state, isFetching: true };
    case MODIFY_USER_RECORD_SUCCESS:
      return { ...state, isFetching: false, message: action.message };
    case MODIFY_USER_RECORD_FAILURE:
      return { ...state, isFetching: false, message: action.message };
    case CLEAR_MODIFY_USER_MESSAGE:
      return { ...state, isFetching: false, message: '' };
    default:
      return state;
  }
};

type approveLeaveState = {
  isApproveLeaveFetching: boolean,
  approveLeavemessage: string
};

const approveLeave = (
  state: approveLeaveState = {
    isApproveLeaveFetching: false,
    approveLeavemessage: ''
  },
  action
) => {
  switch (action.type) {
    case APPROVE_LEAVE_REQUEST:
      return { ...state, isApproveLeaveFetching: true };
    case APPROVE_LEAVE_SUCCESS:
      return {
        ...state,
        isApproveLeaveFetching: false,
        approveLeavemessage: action.message
      };
    case APPROVE_LEAVE_ERROR:
      return {
        ...state,
        isApproveLeaveFetching: false,
        approveLeavemessage: action.message
      };
    case CLEAR_APPROVE_LEAVE:
      return {
        ...state,
        isApproveLeaveFetching: false,
        approveLeavemessage: ''
      };
    default:
      return state;
  }
};

type declineLeaveState = {
  isDeclineLeaveFetching: boolean,
  message: string
};

const declineLeave = (
  state: declineLeaveState = { isDeclineLeaveFetching: false, message: '' },
  action
) => {
  switch (action.type) {
    case DECLINE_LEAVE_REQUEST:
      return { ...state, isApproveLeaveFetching: true };
    case DECLINE_LEAVE_SUCCESS:
      return {
        ...state,
        isDeclineLeaveFetching: false,
        declineLeaveMessage: action.message
      };
    case DECLINE_LEAVE_ERROR:
      return {
        ...state,
        isDeclineLeaveFetching: false,
        declineLeaveMessage: action.message
      };
    case CLEAR_DECLINE_LEAVE:
      return {
        ...state,
        isDeclineLeaveFetching: false,
        declineLeaveMessage: ''
      };
    default:
      return state;
  }
};

type editLeaveState = {
  isEditLeaveFetching: boolean,
  editLeaveMessage: string
};

const editLeave = (
  state: editLeaveState = { isEditLeaveFetching: false, editLeaveMessage: '' },
  action
) => {
  switch (action.type) {
    case EDIT_LEAVE_REQUEST:
      return { ...state, isEditLeaveFetching: true };
    case EDIT_LEAVE_SUCCESS:
      return {
        ...state,
        isEditLeaveFetching: false,
        editLeaveMessage: action.message
      };
    case EDIT_LEAVE_FAILURE:
      return {
        ...state,
        isEditLeaveFetching: false,
        editLeaveMessage: action.message
      };
    case CLEAR_EDIT_LEAVE:
      return {
        ...state,
        isEditLeaveFetching: false,
        editLeaveMessage: ''
      };
    default:
      return state;
  }
};

type cancelLeaveState = {
  isCancelLeaveFetching: boolean,
  cancelLeaveMessage: string
};

const cancelLeave = (
  state: cancelLeaveState = {
    isCancelLeaveFetching: false,
    cancelLeaveMessage: ''
  },
  action
) => {
  switch (action.type) {
    case CANCEL_LEAVE_REQUEST:
      return { ...state, isCancelLeaveFetching: true };
    case CANCEL_LEAVE_SUCCESS:
      return {
        ...state,
        isCancelLeaveFetching: false,
        cancelLeaveMessage: action.message
      };
    case CANCEL_LEAVE_ERROR:
      return {
        ...state,
        isCancelLeaveFetching: false,
        cancelLeaveMessage: action.message
      };
    case CLEAR_CANCEL_LEAVE:
      return {
        ...state,
        isCancelLeaveFetching: false,
        cancelLeaveMessage: ''
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  adminAuth,
  resetPassword,
  addUser,
  modifyUser,
  approveLeave,
  declineLeave,
  editLeave,
  cancelLeave
});

export default rootReducer;
