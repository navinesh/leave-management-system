// @flow
export const REQUEST_PUBLIC_HOLIDAY = "REQUEST_PUBLIC_HOLIDAY";
export const RECEIVE_PUBLIC_HOLIDAY = "RECEIVE_PUBLIC_HOLIDAY";
export const ERROR_PUBLIC_HOLIDAY = "ERROR_PUBLIC_HOLIDAY";

export const requestPublicHoliday = () => ({
  type: REQUEST_PUBLIC_HOLIDAY
});

export const receivePublicHoliday = (json: Object) => ({
  type: RECEIVE_PUBLIC_HOLIDAY,
  public_holiday: json.public_holiday,
  receivedAt: Date.now()
});

export const errorPublicHoliday = () => ({
  type: ERROR_PUBLIC_HOLIDAY
});

export const fetchPublicHoliday = () => {
  return (dispatch: Function) => {
    dispatch(requestPublicHoliday());
    return fetch(`http://localhost:8080/public-holiday.api/`)
      .then(response => response.json())
      .then(json => dispatch(receivePublicHoliday(json)))
      .catch(error => {
        dispatch(errorPublicHoliday());
      });
  };
};
