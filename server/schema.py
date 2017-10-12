import graphene
from graphene import relay, String, Int
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from models import db_session, User as UserModel, Userupdates as UserupdatesModel, \
Leaverecord as LeaverecordModel, Leaveupdates as LeaveupdatesModel, \
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


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    user = relay.Node.Field(User)
    users = SQLAlchemyConnectionField(User)
    user_updates = SQLAlchemyConnectionField(Userupdates)
    leave_updates = SQLAlchemyConnectionField(Leaveupdates)
    public_holiday = SQLAlchemyConnectionField(Publicholiday)
    leave_record = SQLAlchemyConnectionField(Leaverecord)

    find_user = graphene.Field(lambda: User, id=graphene.Int())

    def resolve_find_user(self, args, context, info):
        query = User.get_query(context)
        id = args.get('id')
        return query.filter(UserModel.id == id).first()

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
