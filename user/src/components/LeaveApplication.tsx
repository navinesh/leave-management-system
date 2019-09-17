import React, { useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, FocusedInputShape } from 'react-dates';

import axios from 'axios';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const USER_DETAIL = gql`
  query($id: ID!) {
    user(id: $id) {
      dbId
      othernames
      surname
      annual
      sick
      bereavement
      christmas
      maternity
      familyCare
      paternity
      gender
      designation
      dateOfBirth
    }
  }
`;

const USER_RECORD = gql`
  query($id: ID!) {
    user(id: $id) {
      leaverecord {
        edges {
          node {
            id
            leaveName
            leaveDays
            startDate
            endDate
            leaveReason
            leaveStatus
          }
        }
      }
    }
  }
`;

const PUBLIC_HOLIDAY = gql`
  {
    publicHoliday {
      edges {
        node {
          holidayDate
        }
      }
    }
  }
`;

interface UserProps {
  user_detail: User;
}

interface User {
  othernames: string;
  surname: string;
  annual: number;
  sick: number;
  bereavement: number;
  christmas: number;
  familyCare: number;
  maternity: number;
  paternity: number;
  designation: string;
  gender: string;
}

function UserName(props: UserProps): JSX.Element {
  return (
    <p>
      {props.user_detail.othernames} {props.user_detail.surname}
    </p>
  );
}

function UserRecord(props: UserProps): JSX.Element {
  const { user_detail } = props;

  let gender = user_detail.gender ? user_detail.gender.toLowerCase() : null;

  return (
    <ul className="list-group shadow bg-white rounded">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Annual
        <span className="badge badge-primary badge-pill">
          {user_detail.annual}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Sick
        <span className="badge badge-primary badge-pill">
          {user_detail.sick}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Bereavement
        <span className="badge badge-primary badge-pill">
          {user_detail.bereavement}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Family care
        <span className="badge badge-primary badge-pill">
          {user_detail.familyCare}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Christmas
        <span className="badge badge-primary badge-pill">
          {user_detail.christmas}
        </span>
      </li>
      {gender === 'female' && user_detail.maternity > 0 && (
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Maternity
          <span className="badge badge-primary badge-pill">
            {user_detail.maternity}
          </span>
        </li>
      )}
      {gender === 'male' && user_detail.paternity > 0 && (
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Paternity
          <span className="badge badge-primary badge-pill">
            {user_detail.paternity}
          </span>
        </li>
      )}
    </ul>
  );
}

interface UserDetailType extends User {
  dbId: number;
  dateOfBirth: Date;
}

interface UserRecordType {
  leaverecord: LeaveRecord;
}

interface LeaveRecord {
  edges: Array<Edge>;
}

interface Edge {
  node: LeaveDataType;
}

interface LeaveDataType {
  leaveStatus: string;
  leaveName: string;
  fileName: string;
  leaveDays: number;
}

interface PublicHolidayType {
  edges: Array<Holiday>;
}

interface Holiday {
  node: HolidayData;
}

interface HolidayData {
  holidayDate: string;
}

interface LeaveApplicationProps {
  user_detail: UserDetailType;
  user_record: UserRecordType;
  public_holiday: PublicHolidayType;
  refetch: Function;
}

interface ApplicationDetailProps {
  user_id: any;
  leave: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  supervisorEmail: string;
  secretaryEmail: string;
  reason: string;
  leaveDays: any;
  applicationDays: string;
  sickSheet: any;
  designation: string;
}

type TotalDaysType = {
  [key: string]: any;
};

function LeaveApplication(props: LeaveApplicationProps): JSX.Element {
  const [leave, setLeave] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [supervisorEmail, setSupervisorEmail] = useState<string>('');
  const [secretaryEmail, setSecretaryEmail] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const fileInput = useRef<any>(null);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleLeaveChange({
    target
  }: React.ChangeEvent<HTMLSelectElement>): void {
    setLeave(target.value);
  }

  function handleLeaveTypeChange({
    target
  }: React.ChangeEvent<HTMLSelectElement>): void {
    setLeaveType(target.value);
  }

  function handleSupervisorEmailChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSupervisorEmail(target.value);
  }

  function handleSecretaryEmailChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setSecretaryEmail(target.value);
  }

  function handleReasonChange({
    target
  }: React.ChangeEvent<HTMLInputElement>): void {
    setReason(target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const { user_detail, user_record, refetch } = props;

    const user_id = user_detail.dbId;
    const annualDays = user_detail.annual;
    const sickDays = user_detail.sick;
    const bereavementDays = user_detail.bereavement;
    const christmasDays = user_detail.christmas;
    const dateOfBirth = user_detail.dateOfBirth;
    const familyCareDays = user_detail.familyCare;
    const maternityDays = user_detail.maternity ? user_detail.maternity : null;
    const paternityDays = user_detail.paternity ? user_detail.paternity : null;
    const designation = user_detail.designation;

    const sickSheet = fileInput.current.files && fileInput.current.files[0];

    if (
      !user_id ||
      !leave ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !supervisorEmail ||
      !reason
    ) {
      setErrorMessage('One or more required fields are missing!');
      return;
    }

    // get date range from user selection
    const leaveRangeDays = endDate.diff(startDate, 'days') + 1;

    // check user data range selection
    if (leaveRangeDays <= 0) {
      setErrorMessage('The dates you selected are invalid!');
      return;
    }

    // create date range
    const range = moment.range(startDate, endDate);

    const dateRange: Array<any> = [];
    for (let numDays of range.by('days')) {
      dateRange.push(numDays.format('DD, MM, YYYY'));
    }

    const weekend: Array<any> = [];
    for (let numWeekends of range.by('days')) {
      if (numWeekends.isoWeekday() === 6 || numWeekends.isoWeekday() === 7) {
        weekend.push(numWeekends.format('DD, MM, YYYY'));
      }
    }

    // exclude weekends
    const dateRangeSet = new Set(dateRange);
    const weekendSet = new Set(weekend);
    const daysExcludingWeekendSet = new Set(
      [...dateRangeSet].filter(x => !weekendSet.has(x))
    );

    // exclude public holidays
    const publicHolidays = props.public_holiday.edges.map(item => {
      let hDate = new Date(item.node.holidayDate);
      let holiday_date = moment(hDate).format('DD, MM, YYYY');
      return holiday_date;
    });

    const publicHolidaysSet = new Set(publicHolidays);
    const daysExcludingHolidaysSet = new Set(
      [...daysExcludingWeekendSet].filter(x => !publicHolidaysSet.has(x))
    );
    const leaveDays = daysExcludingHolidaysSet.size;

    if (leaveDays === 0) {
      setErrorMessage(
        'The dates you selected either fall on weekend or public holiday!'
      );
      return;
    }

    // if half day then subtract 0.5
    const myLeaveDays =
      leaveType === 'half day am' || leaveType === 'half day pm'
        ? leaveDays - 0.5
        : leaveDays;

    // since maternity leave is for consecutive days, do not exclude weekends
    // or public holidays
    const myMaternityDays =
      leaveType === 'half day am' || leaveType === 'half day pm'
        ? leaveRangeDays - 0.5
        : leaveRangeDays;

    // get total of approved single sick leave days
    const approvedSingleSickLeaves = user_record.leaverecord.edges.filter(
      e =>
        e.node.leaveStatus === 'approved' &&
        e.node.leaveName === 'sick' &&
        e.node.fileName === null &&
        e.node.leaveDays === 1
    );

    // calculate total leave days
    function getLeaveDays(type: string) {
      const totalDays: TotalDaysType = {
        annual: function() {
          return annualDays - myLeaveDays;
        },
        sick: function() {
          return (myLeaveDays >= 2 || approvedSingleSickLeaves.length >= 4) &&
            !sickSheet
            ? null
            : sickDays - myLeaveDays;
        },
        bereavement: function() {
          return bereavementDays - myLeaveDays;
        },
        christmas: function() {
          return christmasDays - myLeaveDays;
        },
        birthday: function() {
          return moment(startDate).format('DD-MM') ===
            moment(dateOfBirth).format('DD-MM') &&
            moment(endDate).format('DD-MM') ===
              moment(dateOfBirth).format('DD-MM')
            ? 'myLeaveDays'
            : undefined;
        },
        'family care': function() {
          return familyCareDays - myLeaveDays;
        },
        maternity: function() {
          if (!sickSheet) {
            return false;
          } else {
            if (maternityDays) {
              return maternityDays - myMaternityDays;
            }
          }
        },
        paternity: function() {
          if (paternityDays) {
            return paternityDays - myLeaveDays;
          }
        },
        lwop: function() {
          return myLeaveDays;
        },
        other: function() {
          return myLeaveDays;
        }
      };
      return totalDays[type]();
    }

    const applicationDays: any = getLeaveDays(leave);

    if (applicationDays < 0) {
      setErrorMessage('Your leave balance cannot be negative!');
      return;
    }

    if (applicationDays === false) {
      setErrorMessage('A medical certificate is required for maternity leave!');
      return;
    }

    if (applicationDays === null) {
      setErrorMessage(
        'A medical certificate is required for absence of two consecutive days or more and after four single day absences!'
      );
      return;
    }

    if (applicationDays === undefined) {
      setErrorMessage(
        'The date you selected as your date of birth does not match our record!'
      );
      return;
    }

    const sDate = moment(startDate).format('DD/MM/YYYY');
    const eDate = moment(endDate).format('DD/MM/YYYY');

    setErrorMessage('');
    setServerMessage('');

    const applicationDetails = {
      user_id: user_id,
      leave: leave,
      leaveType: leaveType,
      startDate: sDate,
      endDate: eDate,
      supervisorEmail: supervisorEmail,
      secretaryEmail: secretaryEmail,
      reason: reason,
      leaveDays: myLeaveDays,
      applicationDays: applicationDays,
      sickSheet: sickSheet,
      designation: designation
    };

    submitLeaveApplication(applicationDetails);

    refetch();
  }

  async function submitLeaveApplication(
    applicationDetails: ApplicationDetailProps
  ): Promise<any> {
    setLoading(true);

    try {
      let data = new FormData();
      data.append('user_id', applicationDetails.user_id);
      data.append('leave', applicationDetails.leave);
      data.append('leaveType', applicationDetails.leaveType);
      data.append('startDate', applicationDetails.startDate);
      data.append('endDate', applicationDetails.endDate);
      data.append('supervisorEmail', applicationDetails.supervisorEmail);
      data.append('secretaryEmail', applicationDetails.secretaryEmail);
      data.append('leaveDays', applicationDetails.leaveDays);
      data.append('applicationDays', applicationDetails.applicationDays);
      data.append('reason', applicationDetails.reason);
      data.append('sickSheet', applicationDetails.sickSheet);
      data.append('designation', applicationDetails.designation);

      const response = await axios.post(
        'http://localhost:8080/applyforleave',
        data
      );

      setLoading(false);

      if (response.status !== 201) {
        setErrorMessage(response.data.message);
      } else {
        setServerMessage(response.data.message);
        setLeave('');
        setLeaveType('');
        setStartDate(null);
        setEndDate(null);
        setSupervisorEmail('');
        setSecretaryEmail('');
        setReason('');
        fileInput.current.value = null;
        setFocusedInput(null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  const { user_detail } = props;
  let gender = user_detail.gender ? user_detail.gender.toLowerCase() : null;

  return (
    <div className="card card-body shadow p-3 mb-5 bg-white rounded">
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="leave">Leave</label>
              <select
                className="form-control"
                id="leave"
                value={leave}
                onChange={handleLeaveChange}
              >
                <option />
                <option>annual</option>
                <option>sick</option>
                <option>bereavement</option>
                <option>family care</option>
                <option>christmas</option>
                <option>birthday</option>
                {gender === 'female' && user_detail.maternity > 0 && (
                  <option>maternity</option>
                )}
                {gender === 'male' && user_detail.paternity > 0 && (
                  <option>paternity</option>
                )}
                <option>lwop</option>
                <option>other</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="leaveType">Leave type</label>
              <select
                className="form-control"
                id="leaveType"
                value={leaveType}
                onChange={handleLeaveTypeChange}
              >
                <option />
                <option>full</option>
                <option>half day am</option>
                <option>half day pm</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="startDate-endDate">Start date - End date</label>
              <DateRangePicker
                startDateId="startDate"
                endDateId="endDate"
                startDate={startDate}
                endDate={endDate}
                onDatesChange={({ startDate, endDate }) => {
                  setStartDate(startDate);
                  setEndDate(endDate);
                }}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                isOutsideRange={() => false}
                minimumNights={0}
                showDefaultInputIcon
                showClearDates
                withPortal
                displayFormat="DD/MM/YYYY"
                hideKeyboardShortcutsPanel
                renderCalendarInfo={() => (
                  <p className="text-center font-italic">
                    To select a single day click the date twice.
                  </p>
                )}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="supervisorEmail">Supervisor email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Supervisor email"
            id="supervisorEmail"
            value={supervisorEmail}
            onChange={handleSupervisorEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="secretaryEmail">
            Second supervisor / secretary email
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Second supervisor / secretary email"
            id="secretaryEmail"
            value={secretaryEmail}
            onChange={handleSecretaryEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <input
            type="text"
            className="form-control"
            placeholder="Reason for leave"
            id="reason"
            value={reason}
            onChange={handleReasonChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sicksheet">Sick sheet</label>
          <input
            type="file"
            className="form-control-file"
            id="sicksheet"
            ref={fileInput}
          />
          <small className="form-text text-muted">
            A medical certificate is required for absence of two consecutive
            days or more and after four single day absences.
          </small>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary col">
            Submit
          </button>
        </div>
      </form>
      <div className="text-primary text-center">
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          serverMessage
        )}
      </div>
      <div className="text-danger text-center pt-2">
        <div>{errorMessage}</div>
      </div>
    </div>
  );
}

interface Props {
  id: string;
}

export default function Application(props: Props): JSX.Element {
  const { loading, error, data: userDetailData }: any = useQuery(USER_DETAIL, {
    variables: { id: props.id },
    pollInterval: 60000
  });

  const {
    loading: recordLoading,
    error: recordError,
    data: userRecordData,
    refetch
  }: any = useQuery(USER_RECORD, {
    variables: { id: props.id },
    pollInterval: 60000
  });

  const {
    loading: holidayLoading,
    error: holidayError,
    data: publicHolidayData
  }: any = useQuery(PUBLIC_HOLIDAY);

  if (loading || recordLoading || holidayLoading) {
    return (
      <div className="container text-center" style={{ paddingTop: '80px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || recordError || holidayError) {
    console.log(error, recordError, holidayError);
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <div className="col-md-8 ml-auto mr-auto">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 ml-auto mr-auto">
          <UserName user_detail={userDetailData.user} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 ml-auto">
          <UserRecord user_detail={userDetailData.user} />
        </div>
        <div className="col-md-6 mr-auto mb-2">
          <LeaveApplication
            user_detail={userDetailData.user}
            user_record={userRecordData.user}
            public_holiday={publicHolidayData.publicHoliday}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}
