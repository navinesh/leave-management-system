import graphene
from graphene import relay, String, Int
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from models import db_session, User as UserModel, \
    Userupdates as UserupdatesModel, Leaverecord as LeaverecordModel, \
    Leaveupdates as LeaveupdatesModel, \
    Adminuser as AdminuserModel, Publicholiday as PublicholidayModel
from graphql_relay import from_global_id


class DatabaseId(graphene.Interface):
    db_id = Int()


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, DatabaseId)
        model.db_id = model.id
        only_fields = [
            'id', 'othernames', 'surname', 'email', 'designation', 'gender',
            'date_of_birth', 'annual', 'sick', 'bereavement', 'christmas',
            'maternity', 'is_archived', 'family_care', 'paternity',
            'archive_reason', 'employee_number', 'employee_start_date',
            'userupdates', 'leaverecord'
        ]


class Userupdates(SQLAlchemyObjectType):
    class Meta:
        model = UserupdatesModel
        interfaces = (relay.Node, DatabaseId)
        model.db_id = model.id


class Leaverecord(SQLAlchemyObjectType):
    class Meta:
        model = LeaverecordModel
        interfaces = (relay.Node, DatabaseId)
        model.db_id = model.id


class Leaveupdates(SQLAlchemyObjectType):
    class Meta:
        model = LeaveupdatesModel
        interfaces = (relay.Node, DatabaseId)
        model.db_id = model.id


class Publicholiday(SQLAlchemyObjectType):
    class Meta:
        model = (PublicholidayModel)
        interfaces = (relay.Node,)


class Adminuser(SQLAlchemyObjectType):
    class Meta:
        model = AdminuserModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    user = relay.Node.Field(User)
    users = SQLAlchemyConnectionField(User)
    user_update = SQLAlchemyConnectionField(Userupdates)
    leave_update = SQLAlchemyConnectionField(Leaveupdates)
    public_holiday = SQLAlchemyConnectionField(Publicholiday)
    leave_record = SQLAlchemyConnectionField(Leaverecord)

    find_user_updates = graphene.List(
        lambda: Userupdates, is_archived=graphene.String())

    def resolve_find_user_updates(self, info, is_archived):
        """Returns user updates"""
        query = Userupdates.get_query(info)

        return query.join(UserModel).filter(
            UserModel.is_archived == is_archived)

    find_users = graphene.List(lambda: User, is_archived=graphene.String())

    def resolve_find_users(self, info, is_archived):
        """Returns users"""
        query = User.get_query(info)

        return query.filter(UserModel.is_archived == is_archived)

    find_leave_updates = graphene.List(
        lambda: Leaveupdates, is_archived=graphene.String())

    def resolve_find_leave_updates(self, info, is_archived):
        """Returns leave updates"""
        query = Leaveupdates.get_query(info)

        return query.join(LeaverecordModel).join(UserModel).filter(
            UserModel.is_archived == is_archived)

    find_leave_record = graphene.List(
        lambda: Leaverecord,
        leave_status=graphene.String(),
        is_archived=graphene.String())

    def resolve_find_leave_record(self, info, leave_status, is_archived):
        """Returns leave records"""
        query = Leaverecord.get_query(info)

        return query.filter(LeaverecordModel.leave_status ==
                            leave_status).join(UserModel).filter(
                                UserModel.is_archived == is_archived)

    find_sicksheet_record = graphene.List(lambda: Leaverecord)

    def resolve_find_sicksheet_record(self, info):
        """Returns sicksheet record"""
        query = Leaverecord.get_query(info)
        return query.filter(LeaverecordModel.file_name.isnot(None))


class AuthenticateUser(graphene.Mutation):
    """Authenticate user"""
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    User = graphene.Field(User)
    token = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, email, password):
        query = User.get_query(info)

        user = query.filter(UserModel.email == email).first()

        if not user or not user.verify_password(password):
            raise Exception(
                'The username and password you entered did not match our \
                records. Please double-check and try again.')

        auth_token = user.generate_auth_token()
        ok = True
        return AuthenticateUser(User=user, token=auth_token, ok=ok)


class VerifyUserToken(graphene.Mutation):
    """Verify user token"""
    class Arguments:
        userToken = graphene.String()

    User = graphene.Field(User)
    token = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, userToken):
        query = User.get_query(info)

        if not userToken or not UserModel.verify_auth_token(userToken):
            raise Exception('Your session has expired!')

        id = UserModel.verify_auth_token(userToken)
        user = query.filter(UserModel.id == id).first()

        ok = True
        return VerifyUserToken(User=user, token=userToken, ok=ok)


class AuthenticateAdmin(graphene.Mutation):
    """Authenticate admin"""
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    Admin = graphene.Field(Adminuser)
    token = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, email, password):
        query = Adminuser.get_query(info)

        admin = query.filter(AdminuserModel.email == email).first()

        if not admin or not admin.verify_password(password):
            raise Exception(
                'The username and password you entered did not match our \
                records. Please double-check and try again.')

        auth_token = admin.generate_auth_token()
        ok = True
        return AuthenticateAdmin(Admin=admin, token=auth_token, ok=ok)


class VerifyAdminToken(graphene.Mutation):
    """Verify admin token"""
    class Arguments:
        adminToken = graphene.String()

    Admin = graphene.Field(Adminuser)
    token = graphene.String()
    ok = graphene.Boolean()

    def mutate(self, info, adminToken):
        query = Adminuser.get_query(info)

        if not adminToken or \
                not AdminuserModel.verify_auth_token(adminToken):
            raise Exception('Your session has expired!')

        id = AdminuserModel.verify_auth_token(adminToken)
        admin = query.filter(AdminuserModel.id == id).first()

        ok = True
        return VerifyAdminToken(Admin=admin, token=adminToken, ok=ok)


class ArchiveUser(graphene.Mutation):
    """Archive user"""
    class Arguments:
        id = graphene.String()
        archiveReason = graphene.String()

    User = graphene.Field(User)
    ok = graphene.Boolean()

    def mutate(self, info, id, archiveReason):
        query = User.get_query(info)
        user_id = from_global_id(id)[1]

        user = query.filter(UserModel.id == user_id).first()

        if user.is_archived is True:
            raise Exception('This user has an archived status!')

        user.is_archived = True
        user.archive_reason = archiveReason
        db_session.add(user)
        db_session.commit()
        ok = True
        return ArchiveUser(User=user, ok=ok)


class UnArchiveUser(graphene.Mutation):
    """Unarchive user"""
    class Arguments:
        id = graphene.String()

    User = graphene.Field(User)
    ok = graphene.Boolean()

    def mutate(self, info, id):
        query = User.get_query(info)
        user_id = from_global_id(id)[1]
        user = query.filter(UserModel.id == user_id).first()

        if user.is_archived is False:
            raise Exception('This user has an unarchived status!')

        user.is_archived = False
        user.archive_reason = None
        db_session.add(user)
        db_session.commit()
        ok = True
        return UnArchiveUser(User=user, ok=ok)


class AddPublicholiday(graphene.Mutation):
    """Create public holiday"""
    class Arguments:
        holiday_date = graphene.String()

    ok = graphene.Boolean()
    publicHoliday = graphene.Field(Publicholiday)

    def mutate(self, info, holiday_date):
        query = Publicholiday.get_query(info)
        date = query.filter(
            PublicholidayModel.holiday_date == holiday_date).first()
        if date:
            raise Exception('The date you selected already exists!')

        publicHoliday = PublicholidayModel(
            holiday_date=holiday_date)
        db_session.add(publicHoliday)
        db_session.commit()
        ok = True
        return AddPublicholiday(publicHoliday=publicHoliday, ok=ok)


class DeletePublicholiday(graphene.Mutation):
    """Delete public holiday"""
    class Arguments:
        id = graphene.String()

    ok = graphene.Boolean()
    publicHoliday = graphene.Field(Publicholiday)

    def mutate(self, info, id):
        query = Publicholiday.get_query(info)
        holiday_id = from_global_id(id)[1]
        publicHoliday = query.filter(
            PublicholidayModel.id == holiday_id).first()
        db_session.delete(publicHoliday)
        db_session.commit()
        ok = True
        return DeletePublicholiday(publicHoliday=publicHoliday, ok=ok)


class Mutations(graphene.ObjectType):
    authenticate_user = AuthenticateUser.Field()
    verify_user_token = VerifyUserToken.Field()
    authenticate_admin = AuthenticateAdmin.Field()
    verify_admin_token = VerifyAdminToken.Field()
    archive_user = ArchiveUser.Field()
    unArchive_user = UnArchiveUser.Field()
    add_publicholiday = AddPublicholiday.Field()
    delete_publicholiday = DeletePublicholiday.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
