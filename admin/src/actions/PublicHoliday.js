// @flow
export const REQUEST_PUBLIC_HOLIDAY = 'REQUEST_PUBLIC_HOLIDAY';
export const RECEIVE_PUBLIC_HOLIDAY = 'RECEIVE_PUBLIC_HOLIDAY';
export const ERROR_PUBLIC_HOLIDAY = 'ERROR_PUBLIC_HOLIDAY';

export const requestPublicHoliday = () => ({
  type: REQUEST_PUBLIC_HOLIDAY
});

export const receivePublicHoliday = (data: Object) => ({
  type: RECEIVE_PUBLIC_HOLIDAY,
  public_holiday: data.public_holiday,
  receivedAt: Date.now()
});

export const errorPublicHoliday = () => ({
  type: ERROR_PUBLIC_HOLIDAY
});

export const fetchPublicHoliday = () => async (dispatch: Function) => {
  try {
    dispatch(requestPublicHoliday());
    const response = await fetch(`http://localhost:8080/public-holiday.api/`);
    const data = await response.json();
    dispatch(receivePublicHoliday(data));
  } catch (error) {
    dispatch(errorPublicHoliday());
  }
};
