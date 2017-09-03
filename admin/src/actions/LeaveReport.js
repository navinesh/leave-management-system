// @flow
export const REQUEST_LEAVE_RECORD = "REQUEST_LEAVE_RECORD";
export const RECEIVE_LEAVE_RECORD = "RECEIVE_LEAVE_RECORD";
export const ERROR_LEAVE_RECORD = "ERROR_LEAVE_RECORD";

export const REQUEST_USER_UPDATES = "REQUEST_USER_UPDATES";
export const RECEIVE_USER_UPDATES = "RECEIVE_USER_UPDATES";
export const ERROR_USER_UPDATES = "ERROR_USER_UPDATES";

export const requestLeaveRecord = () => ({
  type: REQUEST_LEAVE_RECORD
});

export const receiveLeaveRecord = (data: Object) => ({
  type: RECEIVE_LEAVE_RECORD,
  leave_record: data.leave_record,
  receivedAt: Date.now()
});

export const errorLeaveRecord = () => ({
  type: ERROR_LEAVE_RECORD
});

export const fetchLeaveRecord = () => async (dispatch: Function) => {
  try {
    dispatch(requestLeaveRecord());
    const response = await fetch(`http://localhost:8080/leave-record.api`);
    const data = await response.json();
    dispatch(receiveLeaveRecord(data));
  } catch (error) {
    dispatch(errorLeaveRecord());
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
