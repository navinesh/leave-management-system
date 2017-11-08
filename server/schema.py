import graphene
from graphene import relay, String, Int
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from models import db_session, User as UserModel, \
    Userupdates as UserupdatesModel, Leaverecord as LeaverecordModel, \
    Leaveupdates as LeaveupdatesModel, \
    Adminuser as AdminuserModel, Publicholiday as PublicholidayModel


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
        interfaces = (relay.Node, DatabaseId)
        model.db_id = model.id


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

    find_user = graphene.Field(lambda: User, id=graphene.Int())

    def resolve_find_user(self, args, context, info):
        query = User.get_query(context)
        id = args.get('id')
        return query.filter(UserModel.id == id).first()

    find_user_updates = graphene.List(
        lambda: Userupdates, is_archived=graphene.String())

    def resolve_find_user_updates(self, args, context, info):
        query = Userupdates.get_query(context)
        is_archived = args.get('is_archived')
        return query.join(UserModel).filter(
            UserModel.isArchived == is_archived)

    find_users = graphene.List(lambda: User, is_archived=graphene.String())

    def resolve_find_users(self, args, context, info):
        query = User.get_query(context)
        is_archived = args.get('is_archived')
        return query.filter(UserModel.isArchived == is_archived)

    find_leave_record = graphene.List(
        lambda: Leaverecord,
        leave_status=graphene.String(),
        is_archived=graphene.String())

    def resolve_find_leave_record(self, args, context, info):
        query = Leaverecord.get_query(context)
        leave_status = args.get('leave_status')
        is_archived = args.get('is_archived')
        return query.filter(LeaverecordModel.leave_status ==
                            leave_status).join(UserModel).filter(
                                UserModel.isArchived == is_archived)


# Authenticate user
class authenticateUser(graphene.Mutation):
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
            raise Exception('Invalid username or password!')

        auth_token = user.generate_auth_token()
        ok = True
        return authenticateUser(User=user, token=auth_token, ok=ok)


# Create public holiday
class addPublicholiday(graphene.Mutation):
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
        return addPublicholiday(publicHoliday=publicHoliday, ok=ok)


# Delete public holiday
class deletePublicholiday(graphene.Mutation):
    class Input:
        holiday_date = graphene.String()

    ok = graphene.Boolean()
    publicHoliday = graphene.Field(Publicholiday)

    @classmethod
    def mutate(cls, _, args, context, info):
        query = Publicholiday.get_query(context)
        holiday_date = args.get('holiday_date')
        publicHoliday = query.filter(
            PublicholidayModel.holiday_date == holiday_date).first()
        db_session.delete(publicHoliday)
        db_session.commit()
        ok = True
        return addPublicholiday(publicHoliday=publicHoliday, ok=ok)


class Mutations(graphene.ObjectType):
    add_publicholiday = addPublicholiday.Field()
    delete_publicholiday = deletePublicholiday.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
