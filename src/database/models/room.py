from database.database import db

from mongoengine.fields import StringField, ListField, IntField

class Room(db.Document):

    # Información de la sala
    room_id = StringField()
    room_name = StringField()
    password = StringField()
    max_users = IntField()
    room_timeout = IntField()

    # Información del creador de la sala
    owner_name = StringField()
    owner_id = StringField()

    # ID de las personas detro de la sala
    all_usernames_id = ListField(StringField())


    

