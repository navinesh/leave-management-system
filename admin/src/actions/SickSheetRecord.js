// @flow
export const REQUEST_SICKSHEET_RECORD = 'REQUEST_SICKSHEET_RECORD';
export const RECEIVE_SICKSHEET_RECORD = 'RECEIVE_SICKSHEET_RECORD';
export const ERROR_SICKSHEET_RECORD = 'ERROR_SICKSHEET_RECORD';

export const requestSickSheetRecord = () => ({
  type: REQUEST_SICKSHEET_RECORD
});

export const receiveSickSheetRecord = (data: Object) => ({
  type: RECEIVE_SICKSHEET_RECORD,
  sickSheet_records: data.sick_sheet_records,
  receivedAt: Date.now()
});

export const errorSickSheetRecord = () => ({
  type: ERROR_SICKSHEET_RECORD
});

export const fetchSickSheetRecord = () => {
  return async (dispatch: Function) => {
    try {
      dispatch(requestSickSheetRecord());
      const response = await fetch(
        `http://localhost:8080/sicksheet-record.api`
      );
      const data = await response.json();
      dispatch(receiveSickSheetRecord(data));
    } catch (error) {
      dispatch(errorSickSheetRecord());
    }
  };
};
