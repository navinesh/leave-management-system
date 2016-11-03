import React, { Component, PropTypes }  from 'react'

export default class NewRecordForm extends Component {
  constructor() {
    super()
    this.state = {
      errorMessage: '',
      successMessage: ''
    }
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleOtherNamesChange = this.handleOtherNamesChange.bind(this);
    this.handleStaffEmailChange = this.handleStaffEmailChange.bind(this);
    this.handleDesignationChange = this.handleDesignationChange.bind(this);
    this.handleDOBChange = this.handleDOBChange.bind(this);
    this.handleAnnualLeaveChange = this.handleAnnualLeaveChange.bind(this);
    this.handleSickLeaveChange = this.handleSickLeaveChange.bind(this);
    this.handleChristmasLeaveChange = this.handleChristmasLeaveChange.bind(this);
    this.handleBereavementLeaveChange = this.handleBereavementLeaveChange.bind(this);
    this.handleMaternityLeaveChange = this.handleMaternityLeaveChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSurnameChange (e) {
    this.setState({surname: e.target.value});
  }

  handleOtherNamesChange (e) {
    this.setState({otherNames: e.target.value});
  }

  handleStaffEmailChange (e) {
     this.setState({staffEmail: e});
   }

   handleDesignationChange (e) {
     this.setState({designation: e});
   }

  handleDOBChange (e) {
    this.setState({dob: e.target.value});
  }

  handleAnnualLeaveChange (e) {
    this.setState({annualLeave: e.target.value});
  }

  handleSickLeaveChange (e) {
    this.setState({sickLeave: e.target.value});
  }

  handleChristmasLeaveChange (e) {
    this.setState({christmasLeave: e.target.files[0]});
  }

  handleBereavementLeaveChange (e) {
    this.setState({bereavementLeave: e.target.value});
  }

  handleMaternityLeaveChange (e) {
    this.setState({maternityLeave: e.target.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    const surname = this.state.leave;
    const othernames = this.state.otherNames;
    const staffEmail = this.state.staffEmail;
    const designation = this.state.designation;    
    const annualDays = this.state.annualLeave;
    const sickDays = this.state.sickLeave;
    const bereavmentDays = this.state.bereavementLeave;
    const christmasDays = this.state.christmasLeave;
    const dateOfBirth = this.state.dob;
    const maternityDays = this.state.maternityLeave;
    // verify data
    // disptach action to post data to database
  }

  render() {
    const { isFetching, message } = this.props
    return (
      <div className="NewRecordForm">
        <div className="col-xs-12 col-sm-4 offset-sm-4">
          <div className="card card-block">
            <form encType='multipart/form-data' onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="surName">Surname</label>
                <input type="text" className="form-control"
                  placeholder="Surname" id="surName"
                  onChange={this.handleSurnameChange} />
              </div>
              <div className="form-group">
                <label htmlFor="otherNames">Other Names</label>
                <input type="text" className="form-control"
                  placeholder="Other Names" id="otherNames"
                  onChange={this.handleOtherNamesChange} />
              </div>
              <div className="form-group">
                <label htmlFor="staffEmail">Staff email</label>
                <input type="email" className="form-control"
                  placeholder="Staff email" id="staffEmail"
                  onChange={this.handleStaffEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <select className="form-control" id="designation" onChange={this.handleDesignationChange}>
                <option></option>
                <option>
  								Admin
  							</option>
  							<option>
  								Level 3 Lawyer
  							</option>
  							<option>
  								Level 4 Lawyer
  							</option>
  							<option>
  								Level 3 Secretary
  							</option>
  							<option>
  								Level 4 Secretary
  							</option>
  							<option>
  								TM
  							</option>
  							<option>
  								Accounts
  							</option>
  							<option>
  								Library
  							</option>
  							<option>
  								IT
  							</option>
  							<option>
  								Search Clerk Level 3
  							</option>
  							<option>
  								Search Clerk Level 4
  							</option>
  							<option>
  								Legal Executive
  							</option>
  							<option>
  								Partner
  							</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of birth</label>
                <input type="date" className="form-control"
                  placeholder="Date of birth" id="dob"
                  onChange={this.handleDOBChange} />
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="annualLeave">Annual leave</label>
                    <input type="number" className="form-control"
                      placeholder="Annual leave" id="annualLeave"
                      onChange={this.handleAnnualLeaveChange} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="sickLeave">Sick leave</label>
                    <input type="number" className="form-control"
                      placeholder="Sick leave" id="sickLeave"
                      onChange={this.handleSickLeaveChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="christmasLeave">Christmas leave</label>
                    <input type="number" className="form-control"
                      placeholder="Christmas leave" id="christmasLeave"
                      onChange={this.handleChristmasLeaveChange} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="bereavementLeave">Bereavement leave</label>
                    <input type="number" className="form-control"
                      placeholder="Bereavement leave" id="bereavementLeave"
                      onChange={this.handleBereavementLeaveChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="Maternity leave">Maternity leave</label>
                    <input type="number" className="form-control"
                      placeholder="Maternity leave" id="maternityLeave"
                      onChange={this.handleMaternityLeaveChange} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary col-xs-12 col-sm-12">Submit</button>
              </div>
            </form>
            <div className="text-danger text-xs-center">
              {isFetching ?
                <div>Loading...</div>:
                message}
            </div>
            <div className="text-danger text-xs-center p-t-2">
              {this.state.errorMessage ?
                <div>{this.state.errorMessage}</div> :
                   ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

NewRecordForm.propTypes = {
  message: PropTypes.string,
  isFetching: PropTypes.bool.isRequired
}
