from flask import render_template, request, jsonify, session, redirect

from database.models.room import Room
from database.models.user import User

def rooms_creating():
    return render_template(
        "room/create.html",
        title="Creando sala",
        color_fondo="bg-color-champagnepink"
    )

def room_screen():

    # room-id, room-password, user-id
    if "room-id" not in session:
        return "No está definido room-id en tu sesión", 400

    if "room-password" not in session:
        return "No está definido room-password en tu sesión", 400
    
    if "user-id" not in session:
        return "No está definido user-id en tu sesión", 400

    # Get username
    user = User.objects.get(user_id=session["user-id"])

    # Get room_data
    room = Room.objects.get(room_id=session["room-id"])

    return render_template(
        "room/room_screen.html",
        title="Room",
        color_fondo="bg-color-champagnepink",

        room_id=session["room-id"],
        room_password=session["room-password"],
        room_name=room.room_name,
        user_id=session["user-id"],
        username=user.user_name
    )