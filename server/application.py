import os
from flask import Flask, render_template, redirect, url_for, request, \
    jsonify, send_from_directory, flash, abort, g
from flask import Response, make_response
from werkzeug import secure_filename
from functools import wraps

import random
import json
from httplib2 import Http
import string
# import requests
from database_setup import Base, User, Leaverecord, Adminuser, Publicholiday
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker, join
from sqlalchemy.ext.declarative import declarative_base

from datetime import datetime

# https://pypi.python.org/pypi/Flask-Cors/1.10.3
from flask_cors import cross_origin

# from flask import session as login_session - benefits?
from flask_seasurf import SeaSurf
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

app = Flask(__name__)
# csrf = SeaSurf(app)

# Directory to store sick sheets
UPLOAD_FOLDER = 'uploads/'

# Image extensions allowed to be uploaded
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'pdf'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Limit image upload payload to 4MB
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024

engine = create_engine('postgresql:///leavedb')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


# Helper functions
@auth.verify_password
def verify_password(email_or_token, password):
    # Try to see if it's a token first
    user_id = User.verify_auth_token(email_or_token)
    if user_id:
        user = session.query(User).filter_by(id=user_id).one()
    else:
        user = session.query(User).filter_by(email=email_or_token).first()

        if not user or not user.verify_password(password):
            return False

    g.user = user
    return True


# user
@app.route('/')
@app.route('/reset')
@app.route('/changepassword')
@app.route('/leaveapplication')
@app.route('/leavecalendar')
def show_user_home():
    """"""
    return render_template('userhome.html')


@app.route('/userlogin', methods=['POST'])
@cross_origin()
def validate_user():
    """ """
    email = request.json.get('email')
    password = request.json.get('password')

    if email is None or password is None:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)

    user = session.query(User).filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({
            'message':
            'The username and password you entered did not match our records. Please double-check and try again.'
        })
        abort(401)

    user_id = user.id
    auth_token = user.generate_auth_token()
    auth_info = {'auth_token': auth_token, 'user_id': user_id}
    return jsonify(auth_info), 201


@app.route('/usertoken', methods=['POST'])
@cross_origin()
def validate_user_token():
    """ """
    auth_token = request.json.get('auth_token')

    if auth_token is None:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)

    if auth_token:
        user_id = User.verify_auth_token(auth_token)
        if user_id:
            auth_info = {'auth_token': auth_token, 'user_id': user_id}
            return jsonify(auth_info), 201
        else:
            return jsonify({'message': 'Your session has expired!'})
            abort(401)


@app.route('/change-password.api', methods=['POST'])
@auth.login_required
@cross_origin()
def change_user_password():
    old_password = request.json.get('oldPassword')
    new_password = request.json.get('newPassword')

    if old_password is None or new_password is None:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)

    user = g.user

    if not user.verify_password(old_password):
        return jsonify({
            'message': 'We could not verify your current password!'
        })
        abort(401)

    user.password = user.hash_password(new_password)
    session.add(user)
    session.commit()

    return jsonify({
        'message': 'Your password has been successfully changed.'
    }), 201


@app.route('/applyforleave', methods=['POST'])
@cross_origin()
def apply_for_leave():
    """ """
    user_id = request.form['user_id']
    leave_name = request.form['leave']
    leave_type = request.form['leaveType']
    date_from = request.form['startDate']
    date_to = request.form['endDate']
    supervisor_email = request.form['supervisorEmail']
    secretary_email = request.form['secretaryEmail']
    leave_reason = request.form['reason']
    leave_days = request.form['leaveDays']
    application_days = request.form['applicationDays']
    leave_status = 'pending'

    # fetch sick sheet file
    file = request.files['sickSheet']  # check if an image was posted
    if file and allowed_file(file.filename):  # check extension
        date_today = str(datetime.now().date())
        filename = secure_filename(file.filename)  # return secure version
        new_file_name = date_today + '-' + filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_file_name))
    else:
        new_file_name = None
    print file
    print new_file_name
    leaverecord = Leaverecord(
        user_id=user_id,
        leave_name=leave_name,
        leave_type=leave_type,
        start_date=date_from,
        end_date=date_to,
        leave_reason=leave_reason,
        leave_days=leave_days,
        leave_status=leave_status,
        file_name=new_file_name,
        date_posted=str(datetime.now().date()))
    session.add(leaverecord)
    session.commit()
    return jsonify({'message': 'Your application has been submitted.'}), 201


# admin
@app.route('/admin')
@app.route('/adminreset')
@app.route('/staffrecord')
@app.route('/approvedleave')
@app.route('/leavereport')
@app.route('/sicksheetrecord/')
@app.route('/newrecord')
@app.route('/archivedstaffrecord')
@app.route('/publicholiday')
def show_admin_home():
    return render_template('index.html')


# add admin user
@app.route('/addadminuser', methods=['POST'])
def new_admin_user():
    email = request.json.get('email')
    password = request.json.get('password')
    surname = request.json.get('surname')
    othernames = request.json.get('othernames')

    if email is None or password is None:
        abort(400)

    if session.query(Adminuser).filter_by(email=email).first() is not None:
        admin = session.query(Adminuser).filter_by(email=email).first()
        return jsonify({'message': 'user already exists'}), 200

    admin = Adminuser(email=email, surname=surname, othernames=othernames)
    admin.hash_password(password)
    session.add(admin)
    session.commit()
    return jsonify({'email': admin.email}), 201


# admin login
@app.route('/adminlogin', methods=['POST'])
@cross_origin()  # allow all origins all methods.
def validate_admin():
    """ """
    email = request.json.get('email')
    password = request.json.get('password')

    if email is None or password is None:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)

    admin = session.query(Adminuser).filter_by(email=email).first()

    if not admin or not admin.verify_password(password):
        return jsonify({
            'message':
            'The username and password you entered did not match our records. \
             Please double-check and try again.'
        })
        abort(401)

    auth_token = admin.generate_auth_token()

    auth_info = {'admin_token': auth_token}

    return jsonify(auth_info), 201


# admin token
@app.route('/admintoken', methods=['POST'])
@cross_origin()  # allow all origins all methods.
def validate_admin_token():
    """ """
    auth_token = request.json.get('admin_token')
    if auth_token is None:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)
    if auth_token:
        admin_id = Adminuser.verify_auth_token(auth_token)
        if admin_id:
            auth_info = {'admin_token': auth_token}
            return jsonify(auth_info), 201
        else:
            return jsonify({'message': 'Your session has expired!'})
            abort(401)


# Views
def allowed_file(filename):
    """Check if an image extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/<filename>/')
@app.route('/sicksheetrecord/<filename>/')
@cross_origin()
def show_image_home(filename):
    """Serves uploaded sick sheets for page view.
    Args:
        filename (string): the file name to serve
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/adduser', methods=['POST'])
@cross_origin()
def new_user():
    surname = request.json.get('surname')
    othernames = request.json.get('othernames')
    email = request.json.get('email')
    designation = request.json.get('designation')
    annual = request.json.get('annual')
    sick = request.json.get('sick')
    bereavement = request.json.get('bereavement')
    christmas = request.json.get('christmas')
    date_of_birth = request.json.get('date_of_birth')
    maternity = request.json.get('maternity')
    gender = request.json.get('gender')
    password = ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.digits)
        for _ in range(8))

    if session.query(User).filter_by(email=email).first() is not None:
        user = session.query(User).filter_by(email=email).first()
        return jsonify({'message': 'user already exists'}), 200

    user = User(
        email=email,
        surname=surname,
        othernames=othernames,
        designation=designation,
        gender=gender,
        date_of_birth=date_of_birth,
        annual=annual,
        sick=sick,
        bereavement=bereavement,
        christmas=christmas,
        maternity=maternity,
        isArchived=False)

    user.hash_password(password)
    session.add(user)
    session.commit()
    return jsonify({'message': 'User has been successfully added.'}), 201


@app.route('/modifyuser', methods=['POST'])
@cross_origin()
def modify_user():
    "modify user record"

    user_id = request.json.get('user_id')
    surname = request.json.get('surname')
    othernames = request.json.get('othernames')
    email = request.json.get('email')
    designation = request.json.get('designation')
    gender = request.json.get('gender')
    annual = request.json.get('annual')
    sick = request.json.get('sick')
    christmas = request.json.get('christmas')
    bereavement = request.json.get('bereavement')
    date_of_birth = request.json.get('date_of_birth')
    maternity = request.json.get('maternity')

    userRecord = session.query(User).filter_by(id=user_id).one()

    userRecord.surname = surname
    userRecord.othernames = othernames
    userRecord.email = email
    userRecord.designation = designation
    userRecord.gender = gender
    userRecord.annual = annual
    userRecord.sick = sick
    userRecord.christmas = christmas
    userRecord.bereavement = bereavement
    userRecord.date_of_birth = date_of_birth
    userRecord.maternity = maternity

    session.add(userRecord)
    session.commit()
    return jsonify({'message': 'User record has been updated.'}), 201


@app.route('/archiveuser', methods=['POST'])
@cross_origin()
def archive_user():
    "archive user record"

    user_id = request.json.get('user_id')
    isArchived = request.json.get('isArchived')
    archiveReason = request.json.get('archiveReason')

    userRecord = session.query(User).filter_by(id=user_id).one()

    userRecord.isArchived = isArchived
    userRecord.archiveReason = archiveReason

    session.add(userRecord)
    session.commit()
    return jsonify({'message': 'User record has been archived.'}), 201


@app.route('/unarchiveuser', methods=['POST'])
@cross_origin()
def un_archive_user():
    "unarchive user record"

    user_id = request.json.get('user_id')
    isArchived = request.json.get('isArchived')

    userRecord = session.query(User).filter_by(id=user_id).one()

    userRecord.isArchived = isArchived

    session.add(userRecord)
    session.commit()
    return jsonify({'message': 'User record has been unarchived.'}), 201


@app.route('/public-holiday.api/')
@cross_origin()
def public_holiday_JSON():
    '''view public holidays'''

    public_holiday_record = session.query(Publicholiday).all()

    return jsonify(
        public_holiday=[record.serialize for record in public_holiday_record])


@app.route('/addpublicholiday', methods=['POST'])
@cross_origin()
def add_public_holiday():
    "add public holidays"

    holiday_date = request.json.get('holidayDate')

    if session.query(Publicholiday).filter_by(
            holiday_date=holiday_date).first() is not None:
        return jsonify({
            'message': 'This record is already in the database.'
        }), 200

    public_holiday = session.query(Publicholiday).all()
    holiday_record = Publicholiday(holiday_date=holiday_date)
    session.add(holiday_record)
    session.commit()

    return jsonify({'message': 'Public holiday date has been added.'}), 201


@app.route('/deletepublicholiday', methods=['POST'])
@cross_origin()
def delete_public_holiday():
    """Deletes public holiday.
    Args:
        id (int): the public holiday id to delete
    """
    id = request.json.get('id')

    deletePublicholiday = session.query(Publicholiday).filter_by(id=id).one()

    if deletePublicholiday is None:
        return jsonify({
            'message':
            'This record could not be found in the database.'
        }), 200

    session.delete(deletePublicholiday)
    session.commit()

    return jsonify({'message': 'Public holiday date has been deleted.'}), 201


# approve leave
@app.route('/approveleave', methods=['POST'])
@cross_origin()
def approve_leave():
    "approve leave"
    leave_id = request.json.get('leave_id')
    leave_status = request.json.get('LeaveStatus')

    leaveRecord = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leaveRecord is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leaveRecord.leave_status = leave_status
    leaveRecord.date_reviewed = str(datetime.now().date())

    session.add(leaveRecord)
    session.commit()
    return jsonify({'message': 'Leave has been approved.'}), 201


# decline leave
@app.route('/declineleave', methods=['POST'])
@cross_origin()
def decline_leave():
    "decline leave"
    leave_id = request.json.get('leave_id')
    leave_status = request.json.get('LeaveStatus')
    decline_reason = request.json.get('DeclineReason')

    leaveRecord = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leaveRecord is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leaveRecord.leave_status = leave_status
    leaveRecord.declined_reason = decline_reason
    leaveRecord.date_reviewed = str(datetime.now().date())

    session.add(leaveRecord)
    session.commit()
    return jsonify({'message': 'Leave has been declined.'}), 201


# edit leave
@app.route('/editleave', methods=['POST'])
@cross_origin()
def edit_leave():
    "edit leave"
    leave_id = request.json.get('leave_id')
    leave_name = request.json.get('leave')
    leave_type = request.json.get('leaveType')
    date_from = request.json.get('startDate')
    date_to = request.json.get('endDate')
    leave_reason = request.json.get('reason')
    leave_days = request.json.get('leaveDays')
    application_days = request.json.get('applicationDays')

    leaveRecord = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leaveRecord is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leaveRecord.id = leave_id
    leaveRecord.leave_name = leave_name
    leaveRecord.leave_type = leave_type
    leaveRecord.start_date = date_from
    leaveRecord.end_date = date_to
    leaveRecord.leave_reason = leave_reason
    leaveRecord.leave_days = leave_days

    session.add(leaveRecord)
    session.commit()
    return jsonify({'message': 'Leave record has been modified.'}), 201


# JSON API to view user detail
@app.route('/user-detail.api')
@cross_origin()
@auth.login_required
def user_detail_JSON():
    user = g.user
    '''if not user.user_id:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)'''
    '''user = session.query(User).filter_by(id=user_id).first()'''
    if not user:
        return jsonify({'message': 'User not found!'})
        abort(401)

    return jsonify(user_detail=user.serialize), 201


# JSON API to view user record (detail and record)
@app.route('/user-record.api')
@cross_origin()
@auth.login_required
def user_record_JSON():
    user = g.user
    '''user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({'message': 'Missing arguments!'})
        abort(400)

    user = session.query(User).filter_by(id=user_id).first()'''

    if not user:
        return jsonify({'message': 'User not found!'})
        abort(401)

    leaveRecord = session.query(Leaverecord).filter_by(user_id=user.id).all()

    return jsonify(user_record=[x.serialize for x in leaveRecord]), 201


@app.route('/leave.api')
@cross_origin()
def leaveJSON():
    """API to provide leave calendar"""
    leave_records = session.query(Leaverecord).filter_by(
        leave_status='approved')
    leave_list = []
    for x in leave_records:
        leave_record = x.serialize
        user = session.query(User).filter_by(id=x.user_id).one()
        leave_record['user'] = user.serialize
        leave_list.append(leave_record)
    return jsonify(leave_records=leave_list)


# JSON API to view pending leaves
@app.route('/pending-leave.api')
@cross_origin()
def pending_leave_record_JSON():
    """API to pending leave"""

    leave_records = session.query(Leaverecord).filter_by(
        leave_status='pending')
    leave_list = []
    for x in leave_records:
        leave_record = x.serialize
        user = session.query(User).filter_by(id=x.user_id).one()
        leave_record['user'] = user.serialize
        leave_list.append(leave_record)

    return jsonify(pending_leave_records=leave_list)


@app.route('/approved-leave.api')
@cross_origin()
def approved_leave_record_JSON():
    """API to approved leave"""
    leave_records = session.query(Leaverecord).filter_by(
        leave_status='approved')
    leave_list = []
    for x in leave_records:
        leave_record = x.serialize
        user = session.query(User).filter_by(id=x.user_id).one()
        leave_record['user'] = user.serialize
        leave_list.append(leave_record)

    return jsonify(approved_leave_records=leave_list)


@app.route('/staff-record.api')
@cross_origin()
def staff__record_JSON():
    user = session.query(User).filter_by(
        isArchived="False").order_by(User.othernames).all()
    return jsonify(staff_record=[u.serialize for u in user])


@app.route('/archived-staff-record.api')
@cross_origin()
def archived_staff__record_JSON():
    user = session.query(User).filter_by(
        isArchived="True").order_by(User.othernames).all()
    return jsonify(archived_staff_record=[u.serialize for u in user])


# JSON API to leave record
@app.route('/leave-record.api')
@cross_origin()
def leaverecordJSON():
    leave_records = session.query(Leaverecord).all()
    leave_list = []
    for x in leave_records:
        leave_record = x.serialize
        user = session.query(User).filter_by(id=x.user_id).one()
        leave_record['user'] = user.serialize
        leave_list.append(leave_record)

    return jsonify(leave_record=leave_list)


@app.route('/sicksheet-record.api')
@cross_origin()
def sick_sheet_record_JSON():
    """API to sick sheet record"""

    leave_records = session.query(Leaverecord).filter(
        Leaverecord.file_name is not None)
    sick_sheet_list = []
    for x in leave_records:
        leave_record = x.serialize
        user = session.query(User).filter_by(id=x.user_id).one()
        leave_record['user'] = user.serialize
        sick_sheet_list.append(leave_record)

    return jsonify(sick_sheet_records=sick_sheet_list)


'''@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def show_home(path):
    """"""
    return render_template('userhome.html')'''


@app.errorhandler(404)
def page_not_found(error):
    """Redirect user to error page if requested
    page does not exist."""
    return render_template('error.html'), 404


if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.debug = True  # disabe in production environment
    app.run(host='0.0.0.0', port=8080)
