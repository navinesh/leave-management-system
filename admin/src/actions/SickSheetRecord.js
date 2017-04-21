// @flow
export const REQUEST_SICKSHEET_RECORD = 'REQUEST_SICKSHEET_RECORD';
export const RECEIVE_SICKSHEET_RECORD = 'RECEIVE_SICKSHEET_RECORD';
export const ERROR_SICKSHEET_RECORD = 'ERROR_SICKSHEET_RECORD';

export const requestSickSheetRecord = () => ({
  type: REQUEST_SICKSHEET_RECORD
});

export const receiveSickSheetRecord = (json: Object) => ({
  type: RECEIVE_SICKSHEET_RECORD,
  sickSheet_records: json.sick_sheet_records,
  receivedAt: Date.now()
});

export const errorSickSheetRecord = () => ({
  type: ERROR_SICKSHEET_RECORD
});

export const fetchSickSheetRecord = () => {
  return (dispatch: Function) => {
    dispatch(requestSickSheetRecord());
    return fetch(`http://localhost:8080/sicksheet-record.api`)
      .then(response => response.json())
      .then(json => dispatch(receiveSickSheetRecord(json)))
      .catch(error => {
        dispatch(errorSickSheetRecord());
      });
  };
};
