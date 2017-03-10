import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchSickSheetRecord } from "../actions/SickSheetRecord";
import SickSheetList from "../components/SickSheetRecord";

const BeatLoader = require("halogen/BeatLoader");

class SickSheetRecord extends Component {
  componentDidMount() {
    this.props.dispatch(fetchSickSheetRecord());
  }

  render() {
    const { isAuthenticated, isFetching, sickSheet_items } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              : <SickSheetList sickSheet_items={sickSheet_items} />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, sickSheet } = state;
  const { isAuthenticated } = adminAuth;
  const { isFetching, sickSheet_items } = sickSheet;

  return { isAuthenticated, isFetching, sickSheet_items };
};

export default connect(mapStateToProps)(SickSheetRecord);
