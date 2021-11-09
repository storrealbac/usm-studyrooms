from flask import request, jsonify, abort
from nanoid import generate

# Utils
from api.utils import alphabet_ids

# Room Schema
from database.models.room import Room
from database.models.user import User

# Crear una sala en la base de datos
def createRoom():

    # Parametro name
    if "name" not in request.args:
        return jsonify({ 
            "status_code": 400,
            "error": "El nombre de la sala no está definido"
        }), 400

    if not (3 <= len(request.args["name"]) <= 16):
        return jsonify({
            "status_code": 400,
            "error": "El nombre de la sala tiene que estar entre 3 y 16 caracteres"
        }), 400

    # Parametro owner
    if "owner" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "El nombre del creador de la sala no está definido"
        }), 400

    if not (3 <= len(request.args["owner"]) <= 16):
        return jsonify({
            "status_code": 400,
            "error": "El nombre del creador tiene que estar entre 3 y 16 caracteres"
        }), 400


    # Parametro password
    if "password" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "El contraseña de la sala no está definida"
        }), 400

    if not (3 <= len(request.args["password"]) <= 16):
        return jsonify({
            "status_code": 400,
            "error": "La contraseña de la sala tiene que estar entre 3 y 16 caracteres"
        }), 400

    # Parametro max_users
    if "max_users" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "La cantidad de personas maximas no está definida"
        }), 400

    if not request.args["max_users"].isnumeric():
        return jsonify({
            "status_code": 400,
            "error": "La cantidad maxima de personas no es numero"
        }), 400

    cantidad_maximas_permitidas: list = [3, 5, 7, 10]

    if int(request.args["max_users"]) not in cantidad_maximas_permitidas:
        return jsonify({
            "status_code": 400,
            "error": "La cantidad maxima tiene que estar entre 3, 5, 7 o 10"
        }), 400

    # Parametro room timeout
    if "room_timeout" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "La duración despues de desconexión no está definida"
        }), 400

    if not request.args["room_timeout"].isnumeric():
        return jsonify({
            "status_code": 400,
            "error": "La duración de la sala debe ser un numero"
        }), 400

    if not (3 <= int(request.args["room_timeout"]) <= 99):
        return jsonify({
            "status_code": 400,
            "error": "La duración despues de desconexión tiene que estar entre 0 y 99"
        }), 400

    # Asignamos los valores
    name, owner, password, max_users, room_timeout = request.args.values()
    room_id = generate(alphabet_ids, 5)
    owner_id = generate(alphabet_ids, 7)

    # Usuario actual
    owner_user = User(
        user_name=owner,
        user_id=owner_id,
        current_room=room_id
    )

    # Sala
    room = Room(
        room_id=room_id,
        room_name=name,
        password=password,
        max_users=max_users,
        room_timeout=room_timeout,

        owner_id=owner_id,

        all_usernames_id=[]
    )

    # Saving users & room
    owner_user.save()
    room.save()

    # Si está todo validado termina
    return jsonify({
        "status_code": 200,
        "msg": "Se ha creado la sala correctamente",
        "data": {
            "user_id": owner_id,
            "room_id": room_id,
            "password": password,
        }
    }), 200

# Unir una persona en la base de datos
def joinRoom():

    # Validar el nombre
    if "username" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "No está definido el nombre de usuario"
        }), 400
    if not (3 <= len(request.args["username"]) <= 16):
        return jsonify({
            "status_code": 400,
            "error": "El nombre debe estar entre 3 y 16 caracteres"
        }), 400

    # Validar la contraseña
    if "room_password" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "No está definido la contraseña de la sala"
        }), 400

    if not (3 <= len(request.args["room_password"]) <= 16):
        return jsonify({
            "status_code": 400,
            "error": "La contraseña debe estar entre 3 y 16 caracteres"
        })

    # Creamos la instancia de la sala
    join_room: Room = Room()

    # Buscar sala en la base de datos
    try:
        # Si la encontró
        join_room = Room.objects().get(room_id=request.args["room_id"])
    except:
        # Si no la encontró
        return jsonify({
            "status_code": 404,
            "error": "No se ha encontrado la sala"
        }), 404

    username, room_id, room_password = request.args.values()

    if join_room.password != room_password:
        return jsonify({
            "status_code": 401,
            "error": "Contraseña incorrecta"
        }), 401

    # Creando el usuario
    user_id = generate(alphabet_ids, 7)
    joined_user = User(
        user_name=username,
        user_id=user_id,
        current_room=room_id
    )

    # Guardamos al usuario como un usuario nuevo
    joined_user.save()

    # Agregar el usuario a la lista
    join_room.all_usernames_id.append(user_id)

    # Guardar al usuario
    join_room.save()

    # Si validó todos los datos, entonces
    return jsonify({
        "status": 200,
        "msg": "Validado correctamente",
        "data": {
            "user_id": user_id,
            "room_id": room_id,
            "room_password": room_password
        }
    })

def leaveRoom():

    if "user_id" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "No está definido el user_id"
        }), 400
    
    if "room_password" not in request.args:
        return jsonify({
            "status_code": 400,
            "error": "No está definida la room_password"
        }), 400

    # Asignar los valores de la request
    user_id, room_password = request.args.values()

    # Buscar el usuario
    current_user: User = User()
    try:
        # Si encontró el usuario
        current_user = User.objects().get(user_id=user_id)
    except:
        return jsonify({
            "status_code": 404,
            "error": "No se ha encontrado el usuario"
        }), 404


    # Buscar la sala
    current_room = Room()
    try:
        current_room = Room.objects().get(room_id=current_user.current_room)
    except:
        current_user.delete()
        return jsonify({
            "status_code": 404,
            "error": "No se ha encontrado con la sala del usuario, se borrará el usuario"
        }), 404

    # Sacar al usuario de la lista
    Room.all_usernames_id.remove(current_user.user_id)
    Room.save()

    return jsonify({
        "status_code": 200,
        "msg": "Se ha salido de la sala satisfactoriamente"
    })

def deleteRoom():
    return "Deleting"

