import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSickSheetRecord } from "../actions/SickSheetRecord";
import SickSheetList from "../components/SickSheetRecord";

const BeatLoader = require("halogen/BeatLoader");

class SickSheetRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSickSheetRecord());
  }

  render() {
    const { isFetching, sickSheet_items, isAuthenticated } = this.props;

    return (
      <div className="container">
        {isAuthenticated && (isFetching ? (
                <div className="text-center">
                  <BeatLoader color="#0275d8" size="12px" />
                </div>
              ) : <SickSheetList sickSheet_items={sickSheet_items} />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { sickSheet, adminAuth } = state;
  const { isFetching, sickSheet_items } = sickSheet;
  const { isAuthenticated } = adminAuth;

  return { isFetching, sickSheet_items, isAuthenticated };
};

export default connect(mapStateToProps)(SickSheetRecord)
