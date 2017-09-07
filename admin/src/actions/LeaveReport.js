// @flow
export const REQUEST_APPROVED_LEAVE_REPORT = 'REQUEST_APPROVED_LEAVE_REPORT';
export const RECEIVE_APPROVED_LEAVE_REPORT = 'RECEIVE_APPROVED_LEAVE_REPORT';
export const ERROR_APPROVED_LEAVE_REPORT = 'ERROR_APPROVED_LEAVE_REPORT';

export const REQUEST_PENDING_LEAVE_REPORT = 'REQUEST_PENDING_LEAVE_REPORT';
export const RECEIVE_PENDING_LEAVE_REPORT = 'RECEIVE_PENDING_LEAVE_REPORT';
export const ERROR_PENDING_LEAVE_REPORT = 'ERROR_PENDING_LEAVE_REPORT';

export const REQUEST_CANCELLED_RECORD = 'REQUEST_CANCELLED_RECORD';
export const RECEIVE_CANCELLED_RECORD = 'RECEIVE_CANCELLED_RECORD';
export const ERROR_CANCELLED_RECORD = 'ERROR_CANCELLED_RECORD';

export const REQUEST_DECLINED_RECORD = 'REQUEST_DECLINED_RECORD';
export const RECEIVE_DECLINED_RECORD = 'RECEIVE_DECLINED_RECORD';
export const ERROR_DECLINED_RECORD = 'ERROR_DECLINED_RECORD';

export const REQUEST_USER_UPDATES = 'REQUEST_USER_UPDATES';
export const RECEIVE_USER_UPDATES = 'RECEIVE_USER_UPDATES';
export const ERROR_USER_UPDATES = 'ERROR_USER_UPDATES';

export const REQUEST_LEAVE_UPDATES = 'REQUEST_LEAVE_UPDATES';
export const RECEIVE_LEAVE_UPDATES = 'RECEIVE_LEAVE_UPDATES';
export const ERROR_LEAVE_UPDATES = 'ERROR_LEAVE_UPDATES';

export const requestApprovedLeaveReport = () => ({
  type: REQUEST_APPROVED_LEAVE_REPORT
});

export const receiveApprovedLeaveReport = (data: Object) => ({
  type: RECEIVE_APPROVED_LEAVE_REPORT,
  approved_record: data.approved_leave_report,
  receivedAt: Date.now()
});

export const errorApprovedLeaveReport = () => ({
  type: ERROR_APPROVED_LEAVE_REPORT
});

export const fetchApprovedLeaveReport = () => async (dispatch: Function) => {
  try {
    dispatch(requestApprovedLeaveReport());
    const response = await fetch(
      `http://localhost:8080/approved-leave-report.api`
    );
    const data = await response.json();
    dispatch(receiveApprovedLeaveReport(data));
  } catch (error) {
    dispatch(errorApprovedLeaveReport());
  }
};

export const requestPendingLeaveReport = () => ({
  type: REQUEST_PENDING_LEAVE_REPORT
});

export const receivePendingLeaveReport = (data: Object) => ({
  type: RECEIVE_PENDING_LEAVE_REPORT,
  pending_record: data.pending_leave_report,
  receivedAt: Date.now()
});

export const errorPendingLeaveReport = () => ({
  type: ERROR_PENDING_LEAVE_REPORT
});

export const fetchPendingLeaveReport = () => async (dispatch: Function) => {
  try {
    dispatch(requestPendingLeaveReport());
    const response = await fetch(
      `http://localhost:8080/pending-leave-report.api`
    );
    const data = await response.json();
    dispatch(receivePendingLeaveReport(data));
  } catch (error) {
    dispatch(errorPendingLeaveReport());
  }
};

export const requestCancelledRecord = () => ({
  type: REQUEST_CANCELLED_RECORD
});

export const receiveCancelledRecord = (data: Object) => ({
  type: RECEIVE_CANCELLED_RECORD,
  cancelled_record: data.cancelled_record,
  receivedAt: Date.now()
});

export const errorCancelledRecord = () => ({
  type: ERROR_CANCELLED_RECORD
});

export const fetchCancelledRecord = () => async (dispatch: Function) => {
  try {
    dispatch(requestCancelledRecord());
    const response = await fetch(
      `http://localhost:8080/cancelled-leave-record.api`
    );
    const data = await response.json();
    dispatch(receiveCancelledRecord(data));
  } catch (error) {
    dispatch(errorCancelledRecord());
  }
};

export const requestDeclinedRecord = () => ({
  type: REQUEST_DECLINED_RECORD
});

export const receiveDeclinedRecord = (data: Object) => ({
  type: RECEIVE_DECLINED_RECORD,
  declined_record: data.declined_record,
  receivedAt: Date.now()
});

export const errorDeclinedRecord = () => ({
  type: ERROR_DECLINED_RECORD
});

export const fetchDeclinedRecord = () => async (dispatch: Function) => {
  try {
    dispatch(requestDeclinedRecord());
    const response = await fetch(
      `http://localhost:8080/declined-leave-record.api`
    );
    const data = await response.json();
    dispatch(receiveDeclinedRecord(data));
  } catch (error) {
    dispatch(errorDeclinedRecord());
  }
};

export const requestUserUpdates = () => ({
  type: REQUEST_USER_UPDATES
});

export const receiveUserUpdates = (data: Object) => ({
  type: RECEIVE_USER_UPDATES,
  user_updates: data.user_updates,
  receivedAt: Date.now()
});

export const errorUserUpdates = () => ({
  type: ERROR_USER_UPDATES
});

export const fetchUserUpdates = () => async (dispatch: Function) => {
  try {
    dispatch(requestUserUpdates());
    const response = await fetch(`http://localhost:8080/user-updates.api`);
    const data = await response.json();
    dispatch(receiveUserUpdates(data));
  } catch (error) {
    dispatch(errorUserUpdates());
  }
};

export const requestLeaveUpdates = () => ({
  type: REQUEST_LEAVE_UPDATES
});

export const receiveLeaveUpdates = (data: Object) => ({
  type: RECEIVE_LEAVE_UPDATES,
  leave_updates: data.leave_updates,
  receivedAt: Date.now()
});

export const errorLeaveUpdates = () => ({
  type: ERROR_LEAVE_UPDATES
});

export const fetchLeaveUpdates = () => async (dispatch: Function) => {
  try {
    dispatch(requestLeaveUpdates());
    const response = await fetch(`http://localhost:8080/leave-updates.api`);
    const data = await response.json();
    dispatch(receiveLeaveUpdates(data));
  } catch (error) {
    dispatch(errorLeaveUpdates());
  }
};
