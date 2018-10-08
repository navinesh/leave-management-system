from sqlalchemy import Column, ForeignKey, Integer, String, Text, Date, \
    Numeric, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, sessionmaker, scoped_session
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
import random
import string
from itsdangerous import (TimedSerializer, SignatureExpired, BadSignature)

engine = create_engine('postgresql:///leavedb')

db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()

Base.query = db_session.query_property()

Base.metadata.create_all(engine)

# user
secret_key = 'secret_key'


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    password_hash = Column(String(128))
    surname = Column(String)
    othernames = Column(String)
    designation = Column(Text)
    gender = Column(Text)
    date_of_birth = Column(Date)
    annual = Column(Numeric)
    sick = Column(Numeric)
    bereavement = Column(Numeric)
    christmas = Column(Numeric)
    maternity = Column(Numeric)
    family_care = Column(Numeric)
    paternity = Column(Numeric)
    is_archived = Column(Boolean)
    archive_reason = Column(Text)
    employee_number = Column(Numeric)
    employee_start_date = Column(Date)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self):
        s = TimedSerializer(secret_key)
        return s.dumps(self.id)

    @staticmethod
    def verify_auth_token(token, max_age=3600):
        s = TimedSerializer(secret_key)
        try:
            data = s.loads(token, max_age=max_age)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        return data

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'email': self.email,
            'surname': self.surname,
            'othernames': self.othernames,
            'designation': self.designation,
            'gender': self.gender,
            'annual': self.annual,
            'sick': self.sick,
            'bereavement': self.bereavement,
            'christmas': self.christmas,
            'maternity': self.maternity,
            'family_care': self.family_care,
            'paternity': self.paternity,
            'date_of_birth': self.date_of_birth,
            'is_archived': self.is_archived,
            'archive_reason': self.archive_reason,
            'employee_number': self.employee_number,
            'employee_start_date': self.employee_start_date
        }


# user updates
class Userupdates(Base):
    __tablename__ = 'userupdates'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    annual = Column(Numeric)
    sick = Column(Numeric)
    bereavement = Column(Numeric)
    family_care = Column(Numeric)
    christmas = Column(Numeric)
    maternity = Column(Numeric)
    paternity = Column(Numeric)
    date_of_birth = Column(Date)
    designation = Column(Text)
    gender = Column(Text)
    employee_number = Column(Numeric)
    employee_start_date = Column(Date)
    edit_reason = Column(Text)
    date_posted = Column(String)
    reviewed_by = Column(String)
    user = relationship(
        User, backref=backref("userupdates", cascade="all, delete-orphan"))
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'annual': self.annual,
            'sick': self.sick,
            'bereavement': self.bereavement,
            'family_care': self.family_care,
            'christmas': self.christmas,
            'maternity': self.maternity,
            'paternity': self.paternity,
            'date_of_birth': self.date_of_birth,
            'designation': self.designation,
            'gender': self.gender,
            'employee_number': self.employee_number,
            'employee_start_date': self.employee_start_date,
            'edit_reason': self.edit_reason,
            'reviewed_by': self.reviewed_by,
            'user_id': self.user_id,
            'dated_posted': self.dated_posted
        }


# leave record
class Leaverecord(Base):
    __tablename__ = 'leaverecord'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    leave_name = Column(String)
    leave_type = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    leave_days = Column(Numeric)
    leave_reason = Column(String)
    leave_status = Column(String)
    date_posted = Column(String)
    cancelled_reason = Column(String)
    date_reviewed = Column(String)
    declined_reason = Column(String)
    reviewed_by = Column(String)
    file_name = Column(Text, nullable=True, unique=True)
    user = relationship(
        User, backref=backref("leaverecord", cascade="all, delete-orphan"))
    user_id = Column(Integer, ForeignKey('user.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'leave_name': self.leave_name,
            'leave_type': self.leave_type,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'leave_days': self.leave_days,
            'leave_reason': self.leave_reason,
            'leave_status': self.leave_status,
            'date_posted': self.date_posted,
            'cancelled_reason': self.cancelled_reason,
            'date_reviewed': self.date_reviewed,
            'reviewed_by': self.reviewed_by,
            'declined_reason': self.declined_reason,
            'file_name': self.file_name,
            'user_id': self.user_id
        }


# leave updates
class Leaveupdates(Base):
    __tablename__ = 'leaveupdates'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    updated_leave_name = Column(String)
    updated_leave_type = Column(String)
    updated_start_date = Column(String)
    updated_end_date = Column(String)
    updated_leave_days = Column(Numeric)
    leave_status = Column(String)
    date_posted = Column(String)
    edit_reason = Column(Text)
    previous_leave_days = Column(Numeric)
    previous_leave_name = Column(String)
    previous_leave_type = Column(String)
    previous_start_date = Column(String)
    previous_end_date = Column(String)
    reviewed_by = Column(String)
    user_id = Column(Integer)
    leaverecord = relationship(
        Leaverecord,
        backref=backref("leaveupdates", cascade="all, delete-orphan"))
    leave_id = Column(Integer, ForeignKey('leaverecord.id'))

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'updated_leave_name': self.updated_leave_name,
            'updated_leave_type': self.updated_leave_type,
            'updated_start_date': self.updated_start_date,
            'updated_end_date': self.updated_end_date,
            'updated_leave_days': self.updated_leave_days,
            'edit_reason': self.edit_reason,
            'previous_leave_days': self.previous_leave_days,
            'previous_leave_name': self.previous_leave_name,
            'previous_leave_type': self.previous_leave_type,
            'previous_start_date': self.previous_start_date,
            'previous_end_date': self.previous_end_date,
            'reviewed_by': self.reviewed_by,
            'date_posted': self.date_posted,
            'leave_id': self.leave_id,
            'user_id': self.user_id
        }


# admin
admin_secret_key = 'admin_secret_key'


class Adminuser(Base):
    __tablename__ = 'adminuser'
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    password_hash = Column(String(128))
    surname = Column(String)
    othernames = Column(String)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self):
        s = TimedSerializer(admin_secret_key)
        return s.dumps(self.id)

    @staticmethod
    def verify_auth_token(token, max_age=86400):
        s = TimedSerializer(admin_secret_key)
        try:
            data = s.loads(token, max_age=max_age)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        return data

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {
            'id': self.id,
            'email': self.email,
            'surname': self.surname,
            'othernames': self.othernames,
        }


# public holiday
class Publicholiday(Base):
    __tablename__ = 'publicholiday'  # representation of table inside database

    id = Column(Integer, primary_key=True)
    holiday_date = Column(Date)

    @property
    def serialize(self):
        """Return data in serializeable format"""
        return {'id': self.id, 'holiday_date': self.holiday_date}
