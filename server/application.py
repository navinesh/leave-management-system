import os
from flask import Flask, render_template, request, \
    jsonify, send_from_directory, abort, g

from werkzeug import secure_filename


import random
import json
from httplib2 import Http
import string
from models import Base, User, Userupdates, \
    Leaverecord, Leaveupdates, Adminuser, Publicholiday
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker, join
from sqlalchemy.ext.declarative import declarative_base

from datetime import datetime

from decimal import Decimal

# Import smtplib for the actual sending function
import smtplib
# Import email modules
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email import encoders

# graphql
from flask_graphql import GraphQLView
from schema import schema
from models import db_session

# https://pypi.python.org/pypi/Flask-Cors/1.10.3
from flask_cors import cross_origin, CORS

# from flask import session as login_session
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
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024

engine = create_engine('postgresql:///leavedb')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

cors = CORS(app, resources={r"/graphql*": {"origins": "*"}})

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


def format_number(i):
    """Remove trailing zeros from decimal"""
    return '%g' % (Decimal(str(i)))


def send_email(toaddr, ccaddr, subject, body, file):
    """Send email"""
    fromaddr = "FROM_EMAIL_ADDRESS"
    server = smtplib.SMTP('SERVER_IP', PORT_NUMBER)

    msg = MIMEMultipart()

    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = subject

    if ccaddr is not None:
        rcpt = ccaddr + [toaddr]
        msg['Cc'] = ", ".join(ccaddr)
    else:
        rcpt = toaddr

    html = """\
    <html>
      <font face="arial" size="2"> {body}
      </font>
    </html>""".format(body=body)

    msg.attach(MIMEText(html, 'html'))

    # attach file if available
    if file:
        attachment = open(
            os.path.join(app.config['UPLOAD_FOLDER'], file), "rb")
        part = MIMEBase('application', 'octet-stream')
        part.set_payload((attachment).read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition',
                        "attachment; filename= %s" % file)

        msg.attach(part)

    server.starttls()
    server.login(fromaddr, "PASSWORD")
    text = msg.as_string()
    server.sendmail(fromaddr, rcpt, text)
    server.quit()


# Helper functions
def get_user(user_id):
    """Retrieves user object associated with the user ID.
    Args:
        user_id (int): the user id to filter query
    """
    try:
        user = session.query(User).filter_by(id=user_id).one()
        return user
    except:
        None


@auth.verify_password
def verify_password(email_or_token, password):
    """Verify password or user token"""
    user_id = User.verify_auth_token(email_or_token)

    if user_id:
        user = get_user(user_id)
    else:
        user = session.query(User).filter_by(email=email_or_token).first()

        if not user or not user.verify_password(password):
            return False

    g.user = user

    return True


def allowed_file(filename):
    """Check if an image extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# Change password
@app.route('/change-password', methods=['POST'])
@auth.login_required
@cross_origin()
def change_user_password():
    """Change password
    Args:
        old_password: old password
        new_password: new password
    """
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

    # Send email
    send_email(
        user.email, None,
        "Leave Management System update",
        ("Your password has been reset to: " + new_password),
        file=None)

    return jsonify({
        'message': 'Your password has been successfully changed.'
    }), 201


# User reset password
@app.route('/user-reset-password', methods=['POST'])
@cross_origin()
def user_reset_password():
    """Change password
    Args:
        email: email address
    """
    email = request.json.get('email')

    if email is None:
        return jsonify({'message': 'Missing argument!'})
        abort(400)

    user = session.query(User).filter_by(email=email).first()

    if not user:
        return jsonify({
            'message':
            'The email address you entered did not match our records. \
            Please double-check and try again.'
        })
        abort(401)

    password = ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.digits)
        for _ in range(8))

    user.hash_password(password)
    session.add(user)
    session.commit()

    # Send email
    send_email(
        user.email, None, "Leave Management System update",
        ("Your Leave Management System password has been reset to: " +
         password),
        file=None)

    return jsonify({
        'message':
        'Your password has been reset. \
        Check your mailbox for new login details.'
    }), 201


# Apply leave
@app.route('/applyforleave', methods=['POST'])
@cross_origin()
def apply_for_leave():
    """Apply for leave
    Args:
        user_id (int): the user id
        leave_name: name of leave
        leave_type: type of leave
        date_from: leave start date
        date_to: leave end date
        supervisor_email: supervisor email address
        secretary_email: secretary email address
        leave_reason: reason for leave
        leave_days: number of leave days
        application_days: leave balance
        deisgnation: staff designation
        leave_status: leave status
        sickSheet: sick sheet file
    """
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
    designation = request.form['designation']
    leave_status = 'pending'

    om_email = "om@example.com"
    pa_email = "pa@example.com"
    ceo_email = "ceo@example.com"

    user_record = get_user(user_id)

    if user_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    if leave_name == 'annual':
        current_leave_balance = user_record.annual
        new_leave_balance = application_days

    if leave_name == 'sick':
        current_leave_balance = user_record.sick
        new_leave_balance = application_days

    if leave_name == 'christmas':
        current_leave_balance = user_record.christmas
        new_leave_balance = application_days

    if leave_name == 'bereavement':
        current_leave_balance = user_record.bereavement
        new_leave_balance = application_days

    if leave_name == 'family care':
        current_leave_balance = user_record.family_care
        new_leave_balance = application_days

    if leave_name == 'maternity':
        current_leave_balance = user_record.maternity
        new_leave_balance = application_days

    if leave_name == 'paternity':
        current_leave_balance = user_record.paternity
        new_leave_balance = application_days

    # fetch sick sheet file
    if 'sickSheet' not in request.files:
        new_file_name = None

        # Send email
        if secretary_email == 'null' and designation != 'Partner':
            cc_address_list = [user_record.email, om_email, pa_email]

        if secretary_email == 'null' and designation == 'Partner':
            cc_address_list = [user_record.email, ceo_email, om_email,
                               pa_email]

        if secretary_email != 'null' and designation != 'Partner':
            cc_address_list = [user_record.email, secretary_email, om_email,
                               pa_email]

        if secretary_email != 'null' and designation == 'Partner':
            cc_address_list = [user_record.email, secretary_email, ceo_email,
                               om_email, pa_email]

        if leave_name == 'lwop' or leave_name == 'other' or \
                leave_name == 'birthday':
            send_email(
                supervisor_email, cc_address_list,
                ("Leave application: " + str(user_record.othernames +
                 " " + user_record.surname) + " - " + leave_name + " leave"),
                (user_record.othernames + " " + user_record.surname +
                 " applied for " + str(format_number(leave_days)) +
                 " day(s) of " + leave_name + " leave from " + date_from +
                 " to " + date_to + ". Reason: " + leave_reason), file=None)
        else:
            send_email(
                supervisor_email, cc_address_list,
                ("Leave application: " + str(user_record.othernames +
                 " " + user_record.surname) + " - " + leave_name + " leave"),
                (user_record.othernames + " " + user_record.surname +
                 " applied for " + str(format_number(leave_days)) +
                 " day(s) of " + leave_name + " leave from " +
                 date_from + " to " + date_to + ". Current " +
                 leave_name + " leave balance is " +
                 str(format_number(current_leave_balance)) +
                 " day(s) and upon approval new balance will be " +
                 str(new_leave_balance) + " day(s). Reason: " +
                 leave_reason), file=None)

        leave_record = Leaverecord(
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

        session.add(leave_record)
        session.commit()

    else:
        file = request.files['sickSheet']  # check if an image was posted
        if file and allowed_file(file.filename):  # check extension
            date_and_time_today = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
            filename = secure_filename(file.filename)  # return secure version
            new_file_name = date_and_time_today + '-' + filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_file_name))
 
            # Send email
            if secretary_email == 'null' and designation != 'Partner':
                cc_address_list = [user_record.email, om_email, pa_email]

            if secretary_email == 'null' and designation == 'Partner':
                cc_address_list = [user_record.email, ceo_email, om_email,
                                   pa_email]

            if secretary_email != 'null' and designation != 'Partner':
                cc_address_list = [user_record.email, secretary_email,
                                   om_email, pa_email]

            if secretary_email != 'null' and designation == 'Partner':
                cc_address_list = [user_record.email, secretary_email,
                                   ceo_email, om_email, pa_email]

            send_email(
                supervisor_email, cc_address_list,
                ("Leave application: " + str(user_record.othernames +
                 " " + user_record.surname) + " - " + leave_name + " leave"),
                (user_record.othernames + " " + user_record.surname +
                 " applied for " + str(format_number(leave_days)) +
                 " day(s) of " + leave_name + " leave from " + date_from +
                 " to " + date_to + ". Current " + leave_name +
                 " leave balance is " +
                 str(format_number(current_leave_balance)) +
                 " day(s) and upon approval new balance will be " +
                 str(new_leave_balance) + " day(s). Reason: " +
                 leave_reason), new_file_name)

            leave_record = Leaverecord(
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

            session.add(leave_record)
            session.commit()

    return jsonify({'message': 'Your application has been submitted.'}), 201


# Add admin user
@app.route('/addadminuser', methods=['POST'])
def new_admin_user():
    """Add admin user
    Args:
        email: email address of the user
        password: admin password
        surname: surname of the user
        othernames: othernames of the user
    """
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


# Admin reset password
@app.route('/admin-reset-password', methods=['POST'])
@cross_origin()
def change_admin_password():
    """Change password
    Args:
        email: email address
    """
    email = request.json.get('email')

    if email is None:
        return jsonify({'message': 'Missing argument!'})
        abort(400)

    admin = session.query(Adminuser).filter_by(email=email).first()

    if not admin:
        return jsonify({
            'message':
            'The email address you entered did not match our records. \
            Please double-check and try again.'
        })
        abort(401)

    password = ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.digits)
        for _ in range(8))

    admin.hash_password(password)
    session.add(admin)
    session.commit()

    # Send email
    send_email(
        email, None, "Leave Management System update",
        ("Your Leave Management System admin password has been reset to: " +
         password),
        file=None)

    return jsonify({
        'message':
        'Your password has been reset. \
        Check your mailbox for new login details.'
    }), 201


# Image function
@app.route('/<filename>')
@app.route('/sicksheetrecord/<filename>')
@cross_origin()
def show_image_home(filename):
    """Serves uploaded sick sheets for page view
    Args:
        filename (string): the file name to serve
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Add user
@app.route('/adduser', methods=['POST'])
@cross_origin()
def new_user():
    """Add new user
    Args:
        surname: surname of the user
        othernames: othernames of the user
        email: email address of the user
        designation: deisgnation of the user
        gender: gender of the user
        annual: annual leave days balance
        sick: sick leave days balance
        christmas: christmas leave days balance
        bereavement: bereavement leave days balance
        family_care: family_care leave days balance
        date_of_birth: date of birth of the user
        maternity: maternity leave days balance
        paternity: paternity leave days balance
        admin_user: admin user name
        employee_number: payroll emplyee number
        employee_start_date: employee start date
        """
    surname = request.json.get('surname')
    othernames = request.json.get('othernames')
    email = request.json.get('email')
    designation = request.json.get('designation')
    annual = request.json.get('annual')
    sick = request.json.get('sick')
    bereavement = request.json.get('bereavement')
    family_care = request.json.get('family_care')
    christmas = request.json.get('christmas')
    maternity = request.json.get('maternity')
    paternity = request.json.get('paternity')
    date_of_birth = request.json.get('date_of_birth')
    gender = request.json.get('gender')
    employee_number = request.json.get('employee_number')
    employee_start_date = request.json.get('employee_start_date')
    admin_user = request.json.get('admin_user')
    password = ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.digits)
        for _ in range(8))

    if session.query(User).filter_by(email=email).first() is not None:
        user = session.query(User).filter_by(email=email).first()
        return jsonify({'message': 'User already exists'}), 200

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
        family_care=family_care,
        christmas=christmas,
        maternity=maternity,
        paternity=paternity,
        employee_number=employee_number,
        employee_start_date=employee_start_date,
        is_archived=False)

    user.hash_password(password)
    session.add(user)
    session.commit()

    # update logs table
    user_updates = Userupdates(
        designation=designation,
        gender=gender,
        date_of_birth=date_of_birth,
        annual=annual,
        sick=sick,
        bereavement=bereavement,
        family_care=family_care,
        christmas=christmas,
        maternity=maternity,
        paternity=paternity,
        employee_number=employee_number,
        employee_start_date=employee_start_date,
        edit_reason='New record',
        user_id=user.id,
        reviewed_by=admin_user,
        date_posted=str(datetime.now().date()))

    session.add(user_updates)
    session.commit()

    # Send email
    send_email(
        email, None, "Leave Management System",
        ("Your Leave Management System account has been created. \
        Your password is: " + password + " Login at http://localhost"), file=None)

    return jsonify({'message': 'User has been successfully added.'}), 201


# Modify user
@app.route('/modifyuser', methods=['POST'])
@cross_origin()
def modify_user():
    """Modify user leave records
    Args:
        user_id (int): the user id to edit
        surname: surname of the user
        othernames: othernames of the user
        email: email address of the user
        designation: deisgnation of the user
        gender: gender of the user
        annual: annual leave days balance
        sick: sick leave days balance
        bereavement: bereavement leave days balance
        family_care: family_care leave days balance
        christmas: christmas leave days balance
        date_of_birth: date of birth of the user
        maternity: maternity leave days balance
        paternity: paternity leave days balance
        employee_number: payroll employee number
        employee_start_date: employee start date
        edit_reason: reason for editing leave record
        admin_user: admin user name
        """
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
    family_care = request.json.get('family_care')
    maternity = request.json.get('maternity')
    paternity = request.json.get('paternity')
    employee_number = request.json.get('employee_number')
    employee_start_date = request.json.get('employee_start_date')
    edit_reason = request.json.get('editReason')
    admin_user = request.json.get('admin_user')

    user_record = get_user(user_id)

    if user_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200    

    # Email message
    if gender.lower() == 'male':
        if (float(paternity) <= 0 and user_record.paternity <= 0):
            send_email(
                email, None, "Leave record update",
                ("Your leave records have been updated. \
                Your previous leave records were: " +
                 str(user_record.annual) + " annual day(s), " +
                 str(user_record.sick) + " sick day(s), " +
                 str(user_record.bereavement) + " bereavement day(s), " +
                 str(user_record.family_care) + " family care day(s) and " +
                 str(user_record.christmas) +
                 " christmas day(s). Your updated leave records are: " +
                 annual + " annual day(s), " + sick + " sick day(s), " +
                 bereavement + " bereavement day(s), " + family_care +
                 " family care day(s) and " + christmas + " christmas day(s). \
                 Reason for update: " + edit_reason), file=None)

        else:
            send_email(
                email, None, "Leave record update",
                ("Your leave records have been updated. \
                Your previous leave records were: " +
                 str(user_record.annual) + " annual day(s), " +
                 str(user_record.sick) + " sick day(s), " +
                 str(user_record.bereavement) + " bereavement day(s), " +
                 str(user_record.family_care) + " family care day(s), " +
                 str(user_record.christmas) + " christmas day(s) and " +
                 str(user_record.paternity) + " paternity day(s). " +
                 "Your updated leave records are: " +
                 annual + " annual day(s), " + sick + " sick day(s), " +
                 bereavement + " bereavement day(s), " + family_care +
                 " family care day(s), " + christmas + " christmas day(s) and \
                 " + paternity + " paternity day(s). Reason for update: " +
                 edit_reason), file=None)

    if gender.lower() == 'female':
        if (float(maternity) <= 0 and user_record.maternity <= 0):
            send_email(
                email, None, "Leave record update",
                ("Your leave records have been updated. \
                Your previous leave records were: " +
                 str(user_record.annual) + " annual day(s), " +
                 str(user_record.sick) + " sick day(s), " +
                 str(user_record.bereavement) + " bereavement day(s), " +
                 str(user_record.family_care) + " family care day(s) and " +
                 str(user_record.christmas) + " christmas day(s). " +
                 "Your updated leave records are: " +
                 annual + " annual day(s), " + sick + " sick day(s), " +
                 bereavement + " bereavement day(s), " + family_care +
                 " family care day(s) and " + christmas + " christmas day(s). \
                 Reason for update: " + edit_reason), file=None)

        else:
            send_email(
                email, None, "Leave record update",
                ("Your leave records have been updated. \
                Your previous leave records were: " +
                 str(user_record.annual) + " annual day(s), " +
                 str(user_record.sick) + " sick day(s), " +
                 str(user_record.bereavement) + " bereavement day(s), " +
                 str(user_record.family_care) + " family care day(s), " +
                 str(user_record.christmas) + " christmas day(s) and " +
                 str(user_record.maternity) +
                 " maternity day(s). Your updated leave records are: " +
                 annual + " annual day(s), " + sick + " sick day(s), " +
                 bereavement + " bereavement day(s), " + family_care +
                 " family care day(s), " + christmas + " christmas day(s) and \
                 " + maternity + " maternity day(s). Reason for update: " +
                 edit_reason), file=None)

    user_record.surname = surname
    user_record.othernames = othernames
    user_record.email = email
    user_record.designation = designation
    user_record.gender = gender
    user_record.annual = annual
    user_record.sick = sick
    user_record.bereavement = bereavement
    user_record.family_care = family_care
    user_record.christmas = christmas
    user_record.date_of_birth = date_of_birth
    user_record.maternity = maternity
    user_record.paternity = paternity
    user_record.employee_number = employee_number
    user_record.employee_start_date = employee_start_date

    session.add(user_record)
    session.commit()

    # update logs table
    user_updates = Userupdates(
        designation=designation,
        gender=gender,
        date_of_birth=date_of_birth,
        annual=annual,
        sick=sick,
        bereavement=bereavement,
        family_care=family_care,
        christmas=christmas,
        maternity=maternity,
        paternity=paternity,
        edit_reason=edit_reason,
        employee_number=employee_number,
        employee_start_date=employee_start_date,
        user_id=user_record.id,
        reviewed_by=admin_user,
        date_posted=str(datetime.now().date()))

    session.add(user_updates)
    session.commit()

    return jsonify({'message': 'User record has been updated.'}), 201


# Approve leave
@app.route('/approveleave', methods=['POST'])
@cross_origin()
def approve_leave():
    """Approve leave
    Args:
        leave_id (int): the leave id to approve
        leave_status: status of leave
        leave_days: number of leave days
        leave_name: name of the leave
        admin_user: admin user name
    """
    leave_id = request.json.get('leave_id')
    leave_status = request.json.get('leaveStatus')
    leave_days = float(request.json.get('leaveDays'))
    leave_name = request.json.get('leaveName')
    admin_user = request.json.get('admin_user')

    leave_record = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leave_record is None or leave_record.leave_status != 'pending':
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    user_record = session.query(User).filter_by(id=leave_record.user_id).one()

    if leave_name == 'annual':
        annual = float(user_record.annual) - leave_days
        if annual < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.annual = annual
            session.add(user_record)
            session.commit()
            leave_balance = annual

    if leave_name == 'sick':
        sick = float(user_record.sick) - leave_days
        if sick < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.sick = sick
            session.add(user_record)
            session.commit()
            leave_balance = sick

    if leave_name == 'bereavement':
        bereavement = float(user_record.bereavement) - leave_days
        if bereavement < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.bereavement = bereavement
            session.add(user_record)
            session.commit()
            leave_balance = bereavement

    if leave_name == 'family care':
        family_care = float(user_record.family_care) - leave_days
        if family_care < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.family_care = family_care
            session.add(user_record)
            session.commit()
            leave_balance = family_care

    if leave_name == 'christmas':
        christmas = float(user_record.christmas) - leave_days
        if christmas < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.christmas = christmas
            session.add(user_record)
            session.commit()
            leave_balance = christmas

    if leave_name == 'maternity':
        maternity = float(user_record.maternity) - leave_days
        if maternity < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.maternity = maternity
            session.add(user_record)
            session.commit()
            leave_balance = maternity

    if leave_name == 'paternity':
        paternity = float(user_record.paternity) - leave_days
        if paternity < 0:
            return jsonify({'message': 'Leave balance cannot be negative!'})
            abort(400)
        else:
            user_record.paternity = paternity
            session.add(user_record)
            session.commit()
            leave_balance = paternity

    if leave_name == 'lwop' or leave_name == 'other':
        leave_balance = 0

    leave_record.leave_status = leave_status
    leave_record.date_reviewed = str(datetime.now().date())
    leave_record.reviewed_by = admin_user
    session.add(leave_record)
    session.commit()

    # Send email
    if leave_name == 'lwop' or leave_name == 'other' or \
            leave_name == 'birthday':
        send_email(
            user_record.email, None, "Leave application approved",
            ("Your " + leave_name + " leave application for " +
             str(format_number(leave_days)) + " day(s) from " +
             leave_record.start_date + " to " + leave_record.end_date +
             " has been approved."), file=None)
    else:
        send_email(
            user_record.email, None, "Leave application approved",
            ("Your " + leave_name + " leave application for " + str(
                format_number(leave_days)) + " day(s) from " +
             leave_record.start_date + " to " + leave_record.end_date +
             " has been approved. " + "Your new " +
             leave_name + " leave balance is " + str(
                 format_number(leave_balance)) + " day(s)."),
            file=None)

    return jsonify({'message': 'Leave has been approved.'}), 201


# Decline leave
@app.route('/declineleave', methods=['POST'])
@cross_origin()
def decline_leave():
    """Decline leave
    Args:
        leave_id (int): the leave id to decline
        leave_status: status of leave
        decline_reason: reason for declining leave
        admin_user: admin user name
    """
    leave_id = request.json.get('leave_id')
    leave_status = request.json.get('LeaveStatus')
    decline_reason = request.json.get('DeclineReason')
    admin_user = request.json.get('admin_user')

    leave_record = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leave_record is None or leave_record.leave_status != 'pending':
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leave_record.leave_status = leave_status
    leave_record.declined_reason = decline_reason
    leave_record.date_reviewed = str(datetime.now().date())
    leave_record.reviewed_by = admin_user
    session.add(leave_record)
    session.commit()

    # Send email
    send_email(
        leave_record.user.email, None, "Leave application declined",
        ("Your " + leave_record.leave_name + " leave application for " + str(
            leave_record.leave_days) + " day(s) from " +
         leave_record.start_date + " to " + leave_record.end_date +
         " has been declined. Reason for decline: " + decline_reason),
        file=None)

    return jsonify({'message': 'Leave has been declined.'}), 201


# Edit leave
@app.route('/editleave', methods=['POST'])
@cross_origin()
def edit_leave():
    """Edit leave
    Args:
        leave_id (int): the leave id to edit
        leave_name: name of leave
        leave_type: type of leave
        date_from: leave start date
        date_to: leave end date
        leave_reason: reason for editing leave
        leave_days: number of leave days
        previous_leave_days: number of previous leave days
        previous_leave_name: name of previous leave
        previous_leave_type: type pf previous leave
        previous_start_date: previous leave start date
        previous_end_date: previous leave end date
        admin_user: admin user name
    """
    leave_id = request.json.get('leave_id')
    leave_name = request.json.get('leave')
    leave_type = request.json.get('leaveType')
    date_from = request.json.get('startDate')
    date_to = request.json.get('endDate')
    leave_reason = request.json.get('reason')
    leave_days = request.json.get('leaveDays')
    previous_leave_days = request.json.get('previousLeaveDays')
    previous_leave_name = request.json.get('previousLeaveName')
    previous_leave_type = request.json.get('previousLeaveType')
    previous_start_date = request.json.get('previousStartDate')
    previous_end_date = request.json.get('previousEndDate')
    admin_user = request.json.get('admin_user')

    leave_record = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leave_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leave_record.id = leave_id
    leave_record.leave_name = leave_name
    leave_record.leave_type = leave_type
    leave_record.start_date = date_from
    leave_record.end_date = date_to
    leave_record.leave_reason = leave_reason
    leave_record.leave_days = leave_days
    leave_record.date_reviewed = str(datetime.now().date())
    session.add(leave_record)
    session.commit()

    user_id = leave_record.user_id
    leave_status = leave_record.leave_status

    update_log = Leaveupdates(
        updated_leave_name=leave_name,
        updated_leave_type=leave_type,
        updated_start_date=date_from,
        updated_end_date=date_to,
        updated_leave_days=leave_days,
        leave_status=leave_status,
        previous_leave_days=previous_leave_days,
        previous_leave_name=previous_leave_name,
        previous_leave_type=previous_leave_type,
        previous_start_date=previous_start_date,
        previous_end_date=previous_end_date,
        date_posted=str(datetime.now().date()),
        edit_reason=leave_reason,
        reviewed_by=admin_user,
        leave_id=leave_id,
        user_id=user_id)
    session.add(update_log)
    session.commit()

    # Send email
    send_email(
        leave_record.user.email, None, "Leave application edited",
        ("Your " + previous_leave_name + " leave application for " +
         str(previous_leave_days) + " day(s) from " + previous_start_date +
         " to " + previous_end_date +
         " has been modified. Your updated leave application is for " +
         leave_name + " leave for " + str(leave_days) + " day(s) from " +
         date_from + " to " + date_to + ". Reason for update: " +
         leave_reason), file=None)

    return jsonify({'message': 'Leave record has been modified.'}), 201


# Edit approved leave
@app.route('/editapprovedleave', methods=['POST'])
@cross_origin()
def edit_approved_leave():
    """Edit approved leave
    Args:
        leave_id (int): the leave id to edit
        leave_name: name of leave
        leave_type: type of leave
        date_from: leave start date
        date_to: leave end date
        leave_reason: reason for editing leave
        leave_days: number of leave days
        previous_leave_days: number of previous leave days
        previous_leave_name: name of previous leave
        previous_leave_type: type pf previous leave
        previous_start_date: previous leave start date
        previous_end_date: previous leave end date
        admin_user: admin user name
    """
    leave_id = request.json.get('leave_id')
    leave_name = request.json.get('leave')
    leave_type = request.json.get('leaveType')
    date_from = request.json.get('startDate')
    date_to = request.json.get('endDate')
    leave_reason = request.json.get('reason')
    leave_days = float(request.json.get('leaveDays'))
    previous_leave_days = float(request.json.get('previousLeaveDays'))
    previous_leave_name = request.json.get('previousLeaveName')
    previous_leave_type = request.json.get('previousLeaveType')
    previous_start_date = request.json.get('previousStartDate')
    previous_end_date = request.json.get('previousEndDate')
    new_leave_balance = request.json.get('newLeaveBalance')
    admin_user = request.json.get('admin_user')

    leave_record = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leave_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    leave_record.id = leave_id
    leave_record.leave_name = leave_name
    leave_record.leave_type = leave_type
    leave_record.start_date = date_from
    leave_record.end_date = date_to
    leave_record.leave_reason = leave_reason
    leave_record.leave_days = leave_days
    leave_record.date_reviewed = str(datetime.now().date())
    session.add(leave_record)
    session.commit()

    user_id = leave_record.user_id
    leave_status = leave_record.leave_status

    update_log = Leaveupdates(
        updated_leave_name=leave_name,
        updated_leave_type=leave_type,
        updated_start_date=date_from,
        updated_end_date=date_to,
        updated_leave_days=leave_days,
        leave_status=leave_status,
        previous_leave_days=previous_leave_days,
        previous_leave_name=previous_leave_name,
        previous_leave_type=previous_leave_type,
        previous_start_date=previous_start_date,
        previous_end_date=previous_end_date,
        date_posted=str(datetime.now().date()),
        edit_reason=leave_reason,
        reviewed_by=admin_user,
        leave_id=leave_id,
        user_id=user_id)
    session.add(update_log)
    session.commit()

    user_record = session.query(User).filter_by(id=leave_record.user_id).one()

    if leave_name != previous_leave_name:
        if previous_leave_name == 'annual':
            previous_leave_balance = user_record.annual
            previous_updated_leave_balance = new_leave_balance

            user_record.annual = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'sick':
            previous_leave_balance = user_record.sick
            previous_updated_leave_balance = new_leave_balance

            user_record.sick = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'bereavement':
            previous_leave_balance = user_record.bereavement
            previous_updated_leave_balance = new_leave_balance

            user_record.bereavement = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'family care':
            previous_leave_balance = user_record.family_care
            previous_updated_leave_balance = new_leave_balance

            user_record.family_care = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'christmas':
            previous_leave_balance = user_record.christmas
            previous_updated_leave_balance = new_leave_balance

            user_record.christmas = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'maternity':
            previous_leave_balance = user_record.maternity
            previous_updated_leave_balance = new_leave_balance

            user_record.maternity = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'paternity':
            previous_leave_balance = user_record.paternity
            previous_updated_leave_balance = new_leave_balance

            user_record.paternity = new_leave_balance
            session.add(user_record)
            session.commit()

        if previous_leave_name == 'lwop' or previous_leave_name == 'other':
            previous_leave_balance = 0
            previous_updated_leave_balance = 0

        if leave_name == 'annual':
            previous_new_leave_balance = user_record.annual
            updated_leave_balance = float(user_record.annual) - leave_days

            user_record.annual = float(user_record.annual) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'sick':
            previous_new_leave_balance = user_record.sick
            updated_leave_balance = float(user_record.sick) - leave_days

            user_record.sick = float(user_record.sick) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'bereavement':
            previous_new_leave_balance = user_record.bereavement
            updated_leave_balance = float(user_record.bereavement) - leave_days

            user_record.bereavement = float(
                user_record.bereavement) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'family care':
            previous_new_leave_balance = user_record.family_care
            updated_leave_balance = float(user_record.family_care) - leave_days

            user_record.family_care = float(
                user_record.family_care) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'christmas':
            previous_new_leave_balance = user_record.christmas
            updated_leave_balance = float(user_record.christmas) - leave_days

            user_record.christmas = float(user_record.christmas) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'maternity':
            previous_new_leave_balance = user_record.maternity
            updated_leave_balance = float(user_record.maternity) - leave_days

            user_record.maternity = float(user_record.maternity) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'paternity':
            previous_new_leave_balance = user_record.paternity
            updated_leave_balance = float(user_record.paternity) - leave_days

            user_record.paternity = float(user_record.paternity) - leave_days
            session.add(user_record)
            session.commit()

        if leave_name == 'lwop' or leave_name == 'other':
            previous_new_leave_balance = 0
            updated_leave_balance = 0

        # Send email
        send_email(
            user_record.email, None, "Leave application update",
            ("Your " + previous_leave_name + " leave application for " + str(
                format_number(previous_leave_days)) + " day(s) from " +
             previous_start_date + " to " + previous_end_date +
             " has been modified. Your updated leave application is for " +
             leave_name + " leave for " + str(format_number(leave_days)) +
             " day(s) from " + date_from + " to " + date_to + ". " +
             "Your previous " + previous_leave_name + " leave balance was " +
             str(format_number(previous_leave_balance)) +
             " day(s). Your updated " + previous_leave_name +
             " leave balance is " + str(
                 format_number(previous_updated_leave_balance)) + " day(s). " +
             "Your previous " + leave_name + " leave balance was " + str(
                 format_number(previous_new_leave_balance)) +
             " day(s). Your updated " + leave_name + " leave balance is " +
             str(format_number(updated_leave_balance)) + " day(s)." +
             " Reason for update: " + leave_reason),
            file=None)

    if leave_name == previous_leave_name:
        if leave_days != previous_leave_days:
            if leave_days > previous_leave_days:
                num_days_difference = leave_days - previous_leave_days
                if leave_name == 'annual':
                    previous_leave_balance = user_record.annual
                    updated_leave_balance = float(
                        user_record.annual) - num_days_difference

                    user_record.annual = float(
                        user_record.annual) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'sick':
                    previous_leave_balance = user_record.sick
                    updated_leave_balance = float(
                        user_record.sick) - num_days_difference

                    user_record.sick = float(
                        user_record.sick) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'bereavement':
                    previous_leave_balance = user_record.bereavement
                    updated_leave_balance = float(
                        user_record.bereavement) - num_days_difference

                    user_record.bereavement = float(
                        user_record.bereavement) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'family care':
                    previous_leave_balance = user_record.family_care
                    updated_leave_balance = float(
                        user_record.family_care) - num_days_difference

                    user_record.family_care = float(
                        user_record.family_care) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'christmas':
                    previous_leave_balance = user_record.christmas
                    updated_leave_balance = float(
                        user_record.christmas) - num_days_difference

                    user_record.christmas = float(
                        user_record.christmas) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'maternity':
                    previous_leave_balance = user_record.maternity
                    updated_leave_balance = float(
                        user_record.maternity) - num_days_difference

                    user_record.maternity = float(
                        user_record.maternity) - num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'paternity':
                    previous_leave_balance = user_record.paternity
                    updated_leave_balance = float(
                        user_record.paternity) - num_days_difference

                    user_record.paternity = float(
                        user_record.paternity) - num_days_difference
                    session.add(user_record)
                    session.commit()

            if leave_days < previous_leave_days:
                num_days_difference = previous_leave_days - leave_days
                if leave_name == 'annual':
                    previous_leave_balance = user_record.annual
                    updated_leave_balance = float(
                        user_record.annual) + num_days_difference

                    user_record.annual = float(
                        user_record.annual) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'sick':
                    previous_leave_balance = user_record.sick
                    updated_leave_balance = float(
                        user_record.sick) + num_days_difference

                    user_record.sick = float(
                        user_record.sick) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'bereavement':
                    previous_leave_balance = user_record.bereavement
                    updated_leave_balance = float(
                        user_record.bereavement) + num_days_difference

                    user_record.bereavement = float(
                        user_record.bereavement) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'family care':
                    previous_leave_balance = user_record.family_care
                    updated_leave_balance = float(
                        user_record.family_care) + num_days_difference

                    user_record.family_care = float(
                        user_record.family_care) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'christmas':
                    previous_leave_balance = user_record.christmas
                    updated_leave_balance = float(
                        user_record.christmas) + num_days_difference

                    user_record.christmas = float(
                        user_record.christmas) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'maternity':
                    previous_leave_balance = user_record.maternity
                    updated_leave_balance = float(
                        user_record.maternity) + num_days_difference

                    user_record.maternity = float(
                        user_record.maternity) + num_days_difference
                    session.add(user_record)
                    session.commit()

                if leave_name == 'paternity':
                    previous_leave_balance = user_record.paternity
                    updated_leave_balance = float(
                        user_record.paternity) + num_days_difference

                    user_record.paternity = float(
                        user_record.paternity) + num_days_difference
                    session.add(user_record)
                    session.commit()

        if leave_days == previous_leave_days:
            if leave_name == 'annual':
                previous_leave_balance = user_record.annual
                updated_leave_balance = user_record.annual

            if leave_name == 'sick':
                previous_leave_balance = user_record.sick
                updated_leave_balance = user_record.sick

            if leave_name == 'bereavement':
                previous_leave_balance = user_record.bereavement
                updated_leave_balance = user_record.bereavement

            if leave_name == 'family care':
                previous_leave_balance = user_record.family_care
                updated_leave_balance = user_record.family_care

            if leave_name == 'christmas':
                previous_leave_balance = user_record.christmas
                updated_leave_balance = user_record.christmas

            if leave_name == 'maternity':
                previous_leave_balance = user_record.maternity
                updated_leave_balance = user_record.maternity

            if leave_name == 'paternity':
                previous_leave_balance = user_record.paternity
                updated_leave_balance = user_record.paternity

        # Send email
        if leave_name == 'lwop' or leave_name == 'other':
            send_email(
                user_record.email, None, "Leave application update",
                ("Your " + previous_leave_name + " leave application for " +
                 str(format_number(previous_leave_days)) + " day(s) from " +
                 previous_start_date + " to " + previous_end_date +
                 " has been modified. Your updated leave application is for " +
                 leave_name + " leave for " + str(
                     format_number(leave_days)) + " day(s) from " + date_from +
                 " to " + date_to + ". Reason for update: " + leave_reason),
                file=None)
        else:
            send_email(
                user_record.email, None, "Leave application update",
                ("Your " + previous_leave_name + " leave application for " +
                 str(format_number(previous_leave_days)) + " day(s) from " +
                 previous_start_date + " to " + previous_end_date +
                 " has been modified. Your updated leave application is for " +
                 leave_name + " leave for " + str(
                     format_number(leave_days)) + " day(s) from " + date_from +
                 " to " + date_to + ". Your previous " + previous_leave_name +
                 " leave balance was " + str(
                     format_number(previous_leave_balance)) +
                 " day(s). Your updated " + leave_name + " leave balance is " +
                 str(format_number(updated_leave_balance)) +
                 " day(s). Reason for update: " + leave_reason),
                file=None)

    return jsonify({'message': 'Leave record has been modified.'}), 201


# Cancel approved leave
@app.route('/cancelleave', methods=['POST'])
@cross_origin()
def cancel_approved_leave():
    """Cancels approved leave.
    Args:
        leave_id (int): the approved leave id to cancel
        admin_user: admin user name
    """
    leave_id = request.json.get('leaveID')
    cancel_reason = request.json.get('cancelReason')
    user_id = request.json.get('userID')
    leave_days = float(request.json.get('leaveDays'))
    leave_name = request.json.get('leaveName')
    leave_status = request.json.get('leaveStatus')
    admin_user = request.json.get('admin_user')

    leave_record = session.query(Leaverecord).filter_by(id=leave_id).one()

    if leave_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    user_record = get_user(user_id)

    if user_record is None:
        return jsonify({
            'message': 'Cannot find this record in the database.'
        }), 200

    start_date = leave_record.start_date
    end_date = leave_record.end_date

    leave_record.leave_status = leave_status
    leave_record.cancelled_reason = cancel_reason
    leave_record.date_reviewed = str(datetime.now().date())
    leave_record.reviewed_by = admin_user
    session.add(leave_record)
    session.commit()

    if leave_name == 'annual':
        previous_leave_balance = user_record.annual
        updated_leave_balance = float(user_record.annual) + leave_days

        user_record.annual = float(user_record.annual) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'sick':
        previous_leave_balance = user_record.sick
        updated_leave_balance = float(user_record.sick) + leave_days

        user_record.sick = float(user_record.sick) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'bereavement':
        previous_leave_balance = user_record.bereavement
        updated_leave_balance = float(user_record.bereavement) + leave_days

        user_record.bereavement = float(user_record.bereavement) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'family care':
        previous_leave_balance = user_record.family_care
        updated_leave_balance = float(user_record.family_care) + leave_days

        user_record.family_care = float(user_record.family_care) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'christmas':
        previous_leave_balance = user_record.christmas
        updated_leave_balance = float(user_record.christmas) + leave_days

        user_record.christmas = float(user_record.christmas) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'maternity':
        previous_leave_balance = user_record.maternity
        updated_leave_balance = float(user_record.maternity) + leave_days

        user_record.maternity = float(user_record.maternity) + leave_days
        session.add(user_record)
        session.commit()

    if leave_name == 'paternity':
        previous_leave_balance = user_record.paternity
        updated_leave_balance = float(user_record.paternity) + leave_days

        user_record.paternity = float(user_record.paternity) + leave_days
        session.add(user_record)
        session.commit()

    # Send email
    if leave_name == 'lwop' or leave_name == 'other' or \
            leave_name == 'birthday':
        send_email(
            user_record.email, None, "Leave application cancelled",
            ("Your " + leave_name + " leave application for " + str(
                format_number(leave_days)) + " day(s) from " + start_date +
             " to " + end_date + " has been cancelled. Reason for update: " +
             cancel_reason),
            file=None)
    else:
        send_email(
            user_record.email, None, "Leave application cancelled",
            ("Your " + leave_name + " leave application for " + str(
                format_number(leave_days)) + " day(s) from " + start_date +
             " to " + end_date + " has been cancelled. Your previous " +
             leave_name + " leave balance was " + str(
                 format_number(previous_leave_balance)) +
             " day(s). Your updated " + leave_name + " leave balance is " +
             str(format_number(updated_leave_balance)) +
             " day(s). Reason for update: " + cancel_reason),
            file=None)

    return jsonify({'message': 'Leave has been cancelled.'}), 201


@app.errorhandler(404)
def page_not_found(error):
    """Redirect user to error page if requested
    page does not exist"""
    return render_template('error.html'), 404


if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.debug = True  # disabe in production environment
    app.run(host='0.0.0.0', port=8080)
