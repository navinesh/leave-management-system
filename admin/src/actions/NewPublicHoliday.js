// @flow
import axios from "axios";
import { fetchPublicHoliday } from "../actions/PublicHoliday";

export const ADD_PUBLIC_HOLIDAY_REQUEST = "ADD_PUBLIC_HOLIDAY_REQUEST";
export const ADD_PUBLIC_HOLIDAY_SUCCESS = "ADD_PUBLIC_HOLIDAY_SUCCESS";
export const ADD_PUBLIC_HOLIDAY_FAILURE = "ADD_PUBLIC_HOLIDAY_FAILURE";
export const CLEAR_ADD_PUBLIC_MESSAGE = "CLEAR_ADD_PUBLIC_MESSAGE";

export function requestAddPublicHoliday(archiveUser: Object) {
  return { type: ADD_PUBLIC_HOLIDAY_REQUEST, archiveUser };
}

export function successAddPublicHoliday(data: Object) {
  return { type: ADD_PUBLIC_HOLIDAY_SUCCESS, message: data.message };
}

export function failureAddPublicHoliday(data: Object) {
  return { type: ADD_PUBLIC_HOLIDAY_FAILURE, message: data.message };
}

export const clearpublicMessage = () => ({ type: CLEAR_ADD_PUBLIC_MESSAGE });

export function submitAddPublicHoliday(publicHolidayDate: Object) {
  return (dispatch: Function) => {
    dispatch(requestAddPublicHoliday(publicHolidayDate));
    axios
      .post("http://localhost:8080/addpublicholiday", {
        holidayDate: publicHolidayDate.holidayDate
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(failureAddPublicHoliday(response.data));
        } else {
          dispatch(successAddPublicHoliday(response.data));
          dispatch(fetchPublicHoliday());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
}
