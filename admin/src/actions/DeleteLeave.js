// @flow
import axios from 'axios';

export const DELETE_LEAVE_REQUEST = 'DELETE_LEAVE_REQUEST';
export const DELETE_LEAVE_SUCCESS = 'DELETE_LEAVE_SUCCESS';
export const DELETE_LEAVE_ERROR = 'DELETE_LEAVE_ERROR';

export const requestDeleteLeave = () => ({
  type: DELETE_LEAVE_REQUEST
});

export const receiveDeleteLeave = (data: Object) => ({
  type: DELETE_LEAVE_SUCCESS,
  message: data.message
});

export const errorDeleteLeave = (data: Object) => ({
  type: DELETE_LEAVE_ERROR,
  message: data.message
});

export function submitDeleteLeave(deleteLeaveData: Object) {
  return (dispatch: Function) => {
    dispatch(requestDeleteLeave(deleteLeaveData));
    axios
      .post('http://localhost:8080/deleteleave', {
        leave_id: deleteLeaveData.leaveID,
        DeleteReason: deleteLeaveData.DeleteReason
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(errorDeleteLeave(response.data));
        } else {
          dispatch(receiveDeleteLeave(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
