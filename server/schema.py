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
            'maternity', 'isArchived', 'archiveReason', 'userupdates',
            'leaverecord'
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

    def resolve_find_user_updates(self, args, context, info):
        """Returns user updates"""
        query = Userupdates.get_query(context)
        is_archived = args.get('is_archived')
        return query.join(UserModel).filter(
            UserModel.isArchived == is_archived)

    find_users = graphene.List(lambda: User, is_archived=graphene.String())

    def resolve_find_users(self, args, context, info):
        """Returns users"""
        query = User.get_query(context)
        is_archived = args.get('is_archived')
        return query.filter(UserModel.isArchived == is_archived)

    find_leave_updates = graphene.List(
        lambda: Leaveupdates, is_archived=graphene.String())

    def resolve_find_leave_updates(self, args, context, info):
        """Returns leave updates"""
        query = Leaveupdates.get_query(context)
        is_archived = args.get('is_archived')
        return query.join(LeaverecordModel).join(UserModel).filter(
            UserModel.isArchived == is_archived)

    find_leave_record = graphene.List(
        lambda: Leaverecord,
        leave_status=graphene.String(),
        is_archived=graphene.String())

    def resolve_find_leave_record(self, args, context, info):
        """Returns leave records"""
        query = Leaverecord.get_query(context)
        leave_status = args.get('leave_status')
        is_archived = args.get('is_archived')
        return query.filter(LeaverecordModel.leave_status ==
                            leave_status).join(UserModel).filter(
                                UserModel.isArchived == is_archived)

    find_sicksheet_record = graphene.List(lambda: Leaverecord)

    def resolve_find_sicksheet_record(self, args, context, info):
        """Returns sicksheet record"""
        query = Leaverecord.get_query(context)
        return query.filter(LeaverecordModel.file_name.isnot(None))


class AuthenticateUser(graphene.Mutation):
    """Authenticate user"""
    class Input:
        email = graphene.String()
        password = graphene.String()

    User = graphene.Field(User)
    token = graphene.String()
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        query = User.get_query(context)
        email = args.get('email')
        password = args.get('password')
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
    class Input:
        userToken = graphene.String()

    User = graphene.Field(User)
    token = graphene.String()
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        query = User.get_query(context)
        user_token = args.get('userToken')

        if not user_token or not UserModel.verify_auth_token(user_token):
            raise Exception('Your session has expired!')

        id = UserModel.verify_auth_token(user_token)
        user = query.filter(UserModel.id == id).first()

        ok = True
        return VerifyUserToken(User=user, token=user_token, ok=ok)


class AuthenticateAdmin(graphene.Mutation):
    """Authenticate admin"""
    class Input:
        email = graphene.String()
        password = graphene.String()

    token = graphene.String()
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        query = Adminuser.get_query(context)
        email = args.get('email')
        password = args.get('password')
        admin = query.filter(AdminuserModel.email == email).first()

        if not admin or not admin.verify_password(password):
            raise Exception(
                'The username and password you entered did not match our \
                records. Please double-check and try again.')

        auth_token = admin.generate_auth_token()
        ok = True
        return AuthenticateAdmin(token=auth_token, ok=ok)


class VerifyAdminToken(graphene.Mutation):
    """Verify admin token"""
    class Input:
        adminToken = graphene.String()

    token = graphene.String()
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        admin_token = args.get('adminToken')

        if not admin_token or \
                not AdminuserModel.verify_auth_token(admin_token):
            raise Exception('Your session has expired!')

        ok = True
        return VerifyAdminToken(token=admin_token, ok=ok)


class ArchiveUser(graphene.Mutation):
    """Archive user"""
    class Input:
        id = graphene.String()
        archiveReason = graphene.String()

    User = graphene.Field(User)
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        query = User.get_query(context)
        user_id = from_global_id(args.get('id'))[1]
        archive_reason = args.get('archiveReason')
        user = query.filter(UserModel.id == user_id).first()

        if user.isArchived is True:
            raise Exception('This user has an archived status!')

        user.isArchived = True
        user.archiveReason = archive_reason
        db_session.add(user)
        db_session.commit()
        ok = True
        return ArchiveUser(User=user, ok=ok)


class UnArchiveUser(graphene.Mutation):
    """Unarchive user"""
    class Input:
        id = graphene.String()

    User = graphene.Field(User)
    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, _, args, context, info):
        query = User.get_query(context)
        user_id = from_global_id(args.get('id'))[1]
        user = query.filter(UserModel.id == user_id).first()

        if user.isArchived is False:
            raise Exception('This user has an unarchived status!')

        user.isArchived = False
        user.archiveReason = None
        db_session.add(user)
        db_session.commit()
        ok = True
        return UnArchiveUser(User=user, ok=ok)


class AddPublicholiday(graphene.Mutation):
    """Create public holiday"""
    class Input:
        holiday_date = graphene.String()

    ok = graphene.Boolean()
    publicHoliday = graphene.Field(Publicholiday)

    @classmethod
    def mutate(cls, _, args, context, info):
        publicHoliday = PublicholidayModel(
            holiday_date=args.get('holiday_date'))
        db_session.add(publicHoliday)
        db_session.commit()
        ok = True
        return AddPublicholiday(publicHoliday=publicHoliday, ok=ok)


class DeletePublicholiday(graphene.Mutation):
    """Delete public holiday"""
    class Input:
        id = graphene.String()

    ok = graphene.Boolean()
    publicHoliday = graphene.Field(Publicholiday)

    @classmethod
    def mutate(cls, _, args, context, info):
        query = Publicholiday.get_query(context)
        holiday_id = from_global_id(args.get('id'))[1]
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
