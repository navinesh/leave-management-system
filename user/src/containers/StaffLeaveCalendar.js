// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../spinners.css';

import { fetchLeaveIfNeeded } from '../actions/LeaveCalendar';
import Leaves from '../components/LeaveCalendar';

type Props = {
  dispatch: Function,
  records: Array<any>,
  isFetching: boolean
};

class LeaveCalendar extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(fetchLeaveIfNeeded());
  }

  render() {
    return (
      <div>
        {this.props.isFetching
          ? <div className="text-center">
              <div className="loader1" />
            </div>
          : <Leaves records={this.props.records} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { leaveRecords } = state;
  const { isFetching, items: records } = leaveRecords;

  return { records, isFetching };
};

export default connect(mapStateToProps)(LeaveCalendar);
