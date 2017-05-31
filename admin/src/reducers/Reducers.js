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
  REQUEST_PENDING_LEAVE,
  RECEIVE_PENDING_LEAVE,
  ERROR_PENDING_LEAVE
} from '../actions/PendingLeave';

import {
  REQUEST_APPROVED_LEAVE,
  RECEIVE_APPROVED_LEAVE,
  ERROR_APPROVED_LEAVE
} from '../actions/ApprovedLeave';

import {
  REQUEST_STAFF_RECORD,
  RECEIVE_STAFF_RECORD,
  ERROR_STAFF_RECORD,
  STAFF_RECORD_SEARCH,
  CLEAR_STAFF_RECORD_SEARCH
} from '../actions/StaffRecord';

import {
  REQUEST_ARCHIVED_STAFF_RECORD,
  RECEIVE_ARCHIVED_STAFF_RECORD,
  ERROR_ARCHIVED_STAFF_RECORD
} from '../actions/ArchivedStaffRecord';

import {
  REQUEST_SICKSHEET_RECORD,
  RECEIVE_SICKSHEET_RECORD,
  ERROR_SICKSHEET_RECORD
} from '../actions/SickSheetRecord';

import {
  REQUEST_LEAVE_RECORD,
  RECEIVE_LEAVE_RECORD,
  ERROR_LEAVE_RECORD
} from '../actions/LeaveReport';

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
  ARCHIVE_USER_REQUEST,
  ARCHIVE_USER_SUCCESS,
  ARCHIVE_USER_FAILURE,
  CLEAR_ARCHIVE_MESSAGE
} from '../actions/ArchiveUser';

import {
  UNARCHIVE_USER_REQUEST,
  UNARCHIVE_USER_SUCCESS,
  UNARCHIVE_USER_FAILURE,
  CLEAR_UNARCHIVE_MESSAGE
} from '../actions/UnArchiveUser';

import {
  REQUEST_PUBLIC_HOLIDAY,
  RECEIVE_PUBLIC_HOLIDAY,
  ERROR_PUBLIC_HOLIDAY
} from '../actions/PublicHoliday';

import {
  ADD_PUBLIC_HOLIDAY_REQUEST,
  ADD_PUBLIC_HOLIDAY_SUCCESS,
  ADD_PUBLIC_HOLIDAY_FAILURE,
  CLEAR_ADD_PUBLIC_MESSAGE
} from '../actions/NewPublicHoliday';

import {
  DELETE_PUBLIC_HOLIDAY_REQUEST,
  DELETE_PUBLIC_HOLIDAY_SUCCESS,
  DELETE_PUBLIC_HOLIDAY_FAILURE,
  CLEAR_DELETE_PUBLIC_MESSAGE
} from '../actions/DeletePublicHoliday';

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
  isAuthenticated: boolean,
  message: string,
  auth_info: Object
};

const adminAuth = (
  state: adminState = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('admin_token') ? true : false,
    message: '',
    auth_info: {}
  },
  action
) => {
  switch (action.type) {
    case LOGIN_ADMIN_REQUEST:
      return { ...state, isFetching: true, isAuthenticated: false };
    case LOGIN_ADMIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        auth_info: action.auth_info,
        message: 'Login successful!'
      };
    case LOGIN_ADMIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: action.message
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
        isAuthenticated: false,
        message: action.message
      };
    case LOGOUT_ADMIN_REQUEST:
      return { ...state, isFetching: true, isAuthenticated: true };
    case LOGOUT_ADMIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        message: '',
        auth_info: ''
      };
    default:
      return state;
  }
};

type pendingLeaveState = {
  isFetching: boolean,
  pending_items: Array<any>
};

const pendingLeave = (
  state: pendingLeaveState = { isFetching: false, pending_items: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_PENDING_LEAVE:
      return { ...state, isFetching: true };
    case RECEIVE_PENDING_LEAVE:
      return {
        ...state,
        isFetching: false,
        pending_items: action.pending_records
      };
    case ERROR_PENDING_LEAVE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

type approvedLeaveState = {
  isFetching: boolean,
  approved_items: Array<any>
};

const approvedLeave = (
  state: approvedLeaveState = { isFetching: false, approved_items: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_APPROVED_LEAVE:
      return { ...state, isFetching: true };
    case RECEIVE_APPROVED_LEAVE:
      return {
        ...state,
        isFetching: false,
        approved_items: action.approved_records
      };
    case ERROR_APPROVED_LEAVE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

type staffRecordState = {
  isFetching: boolean,
  staff_record: Array<any>
};

const staffRecord = (
  state: staffRecordState = { isFetching: false, staff_record: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_STAFF_RECORD:
      return { ...state, isFetching: true };
    case RECEIVE_STAFF_RECORD:
      return {
        ...state,
        isFetching: false,
        staff_record: action.staff_record
      };
    case ERROR_STAFF_RECORD:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

type archivedRecordState = {
  isFetching: boolean,
  archived_staff_record: Array<any>
};

const archivedStaffRecord = (
  state: archivedRecordState = { isFetching: false, archived_staff_record: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_ARCHIVED_STAFF_RECORD:
      return { ...state, isFetching: true };
    case RECEIVE_ARCHIVED_STAFF_RECORD:
      return {
        ...state,
        isFetching: false,
        archived_staff_record: action.archived_staff_record
      };
    case ERROR_ARCHIVED_STAFF_RECORD:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

type searchStaffRecordState = {
  isSearching: boolean,
  searchTerm: string
};

const searchStaffRecord = (
  state: searchStaffRecordState = { isSearching: false, searchTerm: '' },
  action
) => {
  switch (action.type) {
    case STAFF_RECORD_SEARCH:
      return { ...state, isSearching: true, searchTerm: action.searchTerm };
    case CLEAR_STAFF_RECORD_SEARCH:
      return { ...state, isSearching: false, searchTerm: '' };
    default:
      return state;
  }
};

type leaveReportState = {
  isFetching: boolean,
  leave_record: Array<any>
};

const leaveReport = (
  state: leaveReportState = { isFetching: false, leave_record: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_LEAVE_RECORD:
      return { ...state, isFetching: true };
    case RECEIVE_LEAVE_RECORD:
      return {
        ...state,
        isFetching: false,
        leave_record: action.leave_record
      };
    case ERROR_LEAVE_RECORD:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

type sickSheetState = {
  isFetching: boolean,
  sickSheet_items: Array<any>
};

const sickSheet = (
  state: sickSheetState = { isFetching: false, sickSheet_items: [] },
  action
) => {
  switch (action.type) {
    case REQUEST_SICKSHEET_RECORD:
      return { ...state, isFetching: true };
    case RECEIVE_SICKSHEET_RECORD:
      return {
        ...state,
        isFetching: false,
        sickSheet_items: action.sickSheet_records
      };
    case ERROR_SICKSHEET_RECORD:
      return { ...state, isFetching: false };
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

type archivedUserState = {
  isArchiveFetching: boolean,
  archiveMessage: string
};

const archiveUser = (
  state: archivedUserState = { isArchiveFetching: false, archiveMessage: '' },
  action
) => {
  switch (action.type) {
    case ARCHIVE_USER_REQUEST:
      return { ...state, isArchiveFetching: true };
    case ARCHIVE_USER_SUCCESS:
      return {
        ...state,
        isArchiveFetching: false,
        archiveMessage: action.message
      };
    case ARCHIVE_USER_FAILURE:
      return {
        ...state,
        isArchiveFetching: false,
        archiveMessage: action.message
      };
    case CLEAR_ARCHIVE_MESSAGE:
      return {
        ...state,
        isArchiveFetching: false,
        archiveMessage: ''
      };
    default:
      return state;
  }
};

type unArchivedUserState = {
  isUnArchiveFetching: boolean,
  unArchiveMessage: string
};

const unArchiveUser = (
  state: unArchivedUserState = {
    isUnArchiveFetching: false,
    unArchiveMessage: ''
  },
  action
) => {
  switch (action.type) {
    case UNARCHIVE_USER_REQUEST:
      return { ...state, isUnArchiveFetching: true };
    case UNARCHIVE_USER_SUCCESS:
      return {
        ...state,
        isUnArchiveFetching: false,
        unArchiveMessage: action.message
      };
    case UNARCHIVE_USER_FAILURE:
      return {
        ...state,
        isUnArchiveFetching: false,
        unArchiveMessage: action.message
      };
    case CLEAR_UNARCHIVE_MESSAGE:
      return {
        ...state,
        isUnArchiveFetching: false,
        unArchiveMessage: ''
      };
    default:
      return state;
  }
};

type publicHolidayState = {
  isFetching: boolean,
  public_holiday: Array<any>
};

const publicHoliday = (
  state: publicHolidayState = { isFetching: false, public_holiday: [] },
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

type addPublicHolidayState = {
  isAddPublicFetching: boolean,
  addPublicMessage: string
};

const addPublicHoliday = (
  state: addPublicHolidayState = {
    isAddPublicFetching: false,
    addPublicMessage: ''
  },
  action
) => {
  switch (action.type) {
    case ADD_PUBLIC_HOLIDAY_REQUEST:
      return { ...state, isAddPublicFetching: true };
    case ADD_PUBLIC_HOLIDAY_SUCCESS:
      return {
        ...state,
        isAddPublicFetching: false,
        addPublicMessage: action.message
      };
    case ADD_PUBLIC_HOLIDAY_FAILURE:
      return {
        ...state,
        isAddPublicFetching: false,
        addPublicMessage: action.message
      };
    case CLEAR_ADD_PUBLIC_MESSAGE:
      return {
        ...state,
        isAddPublicFetching: false,
        addPublicMessage: ''
      };
    default:
      return state;
  }
};

type deletePublicHolidayState = {
  isDeletePublicFetching: boolean,
  deletePublicMessage: string
};

const deletePublicHoliday = (
  state: deletePublicHolidayState = {
    isDeletePublicFetching: false,
    deletePublicMessage: ''
  },
  action
) => {
  switch (action.type) {
    case DELETE_PUBLIC_HOLIDAY_REQUEST:
      return { ...state, isDeletePublicFetching: true };
    case DELETE_PUBLIC_HOLIDAY_SUCCESS:
      return {
        ...state,
        isDeletePublicFetching: false,
        deletePublicMessage: action.message
      };
    case DELETE_PUBLIC_HOLIDAY_FAILURE:
      return {
        ...state,
        isDeletePublicFetching: false,
        deletePublicMessage: action.message
      };
    case CLEAR_DELETE_PUBLIC_MESSAGE:
      return {
        ...state,
        isDeletePublicFetching: false,
        deletePublicMessage: ''
      };
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
  pendingLeave,
  approvedLeave,
  staffRecord,
  searchStaffRecord,
  archivedStaffRecord,
  leaveReport,
  sickSheet,
  addUser,
  modifyUser,
  archiveUser,
  unArchiveUser,
  addPublicHoliday,
  publicHoliday,
  deletePublicHoliday,
  approveLeave,
  declineLeave,
  editLeave,
  cancelLeave
});

export default rootReducer;
