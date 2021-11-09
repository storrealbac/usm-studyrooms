from database.database import db

from mongoengine.fields import StringField, ListField, IntField

class User(db.Document):

    # Información del usuario
    user_name = StringField()
    user_id = StringField()
    current_room = StringField()





    

