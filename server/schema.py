import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from models import db_session, User as UserModel, Userupdates as UserupdatesModel, \
Leaverecord as LeaverecordModel, Leaveupdates as LeaveupdatesModel, \
Adminuser as AdminuserModel, Publicholiday as PublicholidayModel


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )


class Userupdates(SQLAlchemyObjectType):
    class Meta:
        model = UserupdatesModel
        interfaces = (relay.Node, )


class Leaverecord(SQLAlchemyObjectType):
    class Meta:
        model = LeaverecordModel
        interfaces = (relay.Node, )


class Leaveupdates(SQLAlchemyObjectType):
    class Meta:
        model = LeaveupdatesModel
        interfaces = (relay.Node, )


class Adminuser(SQLAlchemyObjectType):
    class Meta:
        model = AdminuserModel
        interfaces = (relay.Node, )


class Publicholiday(SQLAlchemyObjectType):
    class Meta:
        model = PublicholidayModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    users = SQLAlchemyConnectionField(User)
    user = relay.Node.Field(User)
    admin_user = relay.Node.Field(Adminuser)
    user_updates = SQLAlchemyConnectionField(Userupdates)
    leave_updates = SQLAlchemyConnectionField(Leaveupdates)
    public_holiday = SQLAlchemyConnectionField(Publicholiday)
    leave_record = SQLAlchemyConnectionField(Leaverecord)

    find_leave_record = graphene.List(
        lambda: Leaverecord, leave_status=graphene.String())

    def resolve_find_leave_record(self, args, context, info):
        query = Leaverecord.get_query(context)
        leave_status = args.get('leave_status')
        return query.filter(LeaverecordModel.leave_status == leave_status)


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
