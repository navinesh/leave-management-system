// @flow
import axios from 'axios';

export const EDIT_LEAVE_REQUEST = 'EDIT_LEAVE_REQUEST';
export const EDIT_LEAVE_SUCCESS = 'EDIT_LEAVE_SUCCESS';
export const EDIT_LEAVE_FAILURE = 'EDIT_LEAVE_FAILURE';
export const CLEAR_EDIT_LEAVE = 'CLEAR_EDIT_LEAVE';

export const requestEditLeave = (editLeaveData: Object) => {
  return { type: EDIT_LEAVE_REQUEST, editLeaveData };
};

export const successEditLeave = (data: Object) => {
  return { type: EDIT_LEAVE_SUCCESS, message: data.message };
};

export const failureEditLeave = (data: Object) => {
  return { type: EDIT_LEAVE_FAILURE, message: data.message };
};

export const clearEditLeave = () => ({ type: CLEAR_EDIT_LEAVE });

export const submitEditLeave = (editLeaveData: Object) => async (
  dispatch: Function
) => {
  try {
    dispatch(requestEditLeave(editLeaveData));
    const response = await axios.post('http://localhost:8080/editleave', {
      leave_id: editLeaveData.leave_id,
      leave: editLeaveData.leave,
      leaveType: editLeaveData.leaveType,
      startDate: editLeaveData.startDate,
      endDate: editLeaveData.endDate,
      reason: editLeaveData.reason,
      leaveDays: editLeaveData.leaveDays,
      previousLeaveDays: editLeaveData.previousLeaveDays,
      previousLeaveName: editLeaveData.previousLeaveName,
      previousLeaveType: editLeaveData.previousLeaveType,
      previousStartDate: editLeaveData.previousStartDate,
      previousEndDate: editLeaveData.previousEndDate
    });

    if (response.status !== 201) {
      dispatch(failureEditLeave(response.data));
    } else {
      dispatch(successEditLeave(response.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const submitEditApprovedLeave = (editLeaveData: Object) => async (
  dispatch: Function
) => {
  try {
    dispatch(requestEditLeave(editLeaveData));
    const response = await axios.post(
      'http://localhost:8080/editapprovedleave',
      {
        leave_id: editLeaveData.leave_id,
        leave: editLeaveData.leave,
        leaveType: editLeaveData.leaveType,
        startDate: editLeaveData.startDate,
        endDate: editLeaveData.endDate,
        reason: editLeaveData.reason,
        leaveDays: editLeaveData.leaveDays,
        applicationDays: editLeaveData.applicationDays,
        previousLeaveDays: editLeaveData.previousLeaveDays,
        previousLeaveName: editLeaveData.previousLeaveName,
        previousLeaveType: editLeaveData.previousLeaveType,
        previousStartDate: editLeaveData.previousStartDate,
        previousEndDate: editLeaveData.previousEndDate,
        newLeaveBalance: editLeaveData.newLeaveBalance
      }
    );

    if (response.status !== 201) {
      dispatch(failureEditLeave(response.data));
    } else {
      dispatch(successEditLeave(response.data));
    }
  } catch (error) {
    console.log(error);
  }
};
