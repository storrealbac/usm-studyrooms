from flask import Blueprint

# Routes
from api.routes.rooms import leaveRoom, createRoom, deleteRoom, joinRoom, roomExist


api = Blueprint("api", __name__)

# Routes rules
api.add_url_rule("/leave", view_func=leaveRoom)
api.add_url_rule("/create", view_func=createRoom, methods=["POST"])
api.add_url_rule("/join", view_func=joinRoom, methods=["POST"])
api.add_url_rule("/exist", view_func=roomExist, methods=["GET"])
api.add_url_rule("/delete", view_func=deleteRoom, methods=["POST"])

