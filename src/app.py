from flask import Flask, render_template, session
from flask_socketio import SocketIO, join_room, leave_room, emit

# Views
from views.home import home
from views.error import page_not_found, internal_server_error
from views.about import project_license, usage_guide, project_developers
from views.rooms import rooms_creating, room_screen

# API Blueport
from api.api import api

# MongoDB
from database.database import db

app = Flask(__name__)
app.secret_key = "RANDOMSECRETKEY"
app.config["SECRET_KEY"] = "RANDOMSECRETKEY_SOCKETIO"

# SocketIO Server
socketio = SocketIO(app)


# API Blueprint
app.register_blueprint(api, url_prefix="/api")


# Main routes
app.add_url_rule("/", view_func=home, methods=["GET"])
app.add_url_rule("/licencia", view_func=project_license, methods=["GET"])
app.add_url_rule("/guia", view_func=usage_guide, methods=["GET"])
app.add_url_rule("/desarrolladores", view_func=project_developers, methods=["GET"])

# Rooms
app.add_url_rule("/room/create", view_func=rooms_creating, methods=["GET"])
app.add_url_rule("/room", view_func=room_screen, methods=["GET"])

# HTTP Error View Handlers
app.register_error_handler(404, page_not_found)
app.register_error_handler(500, internal_server_error)

# MongoDB
db.init_app(app)


# SocketIO
@socketio.on("connect")
def on_connect(auth):
    room_id = session["room-id"]
    join_room(room_id)

@socketio.on("video-create")
def on_video_create(data):
    room_id = session["room-id"]
    emit("video-create", data, room=room_id)

@socketio.on("video-manager")
def on_video_manager(data):
    room_id = session["room-id"]
    
    video_id = data["id"]
    emit(f"video-manager-{video_id}", data, room=room_id)

@socketio.on("video-delete")
def on_video_create(data):
    room_id = session["room-id"]
    emit("video-delete", data, room=room_id)


@socketio.on("chat")
def on_chat(data):
    room_id = session["room-id"]
    emit("chat", data, room=room_id)
    #print(data)

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0")
    socketio.run(app)