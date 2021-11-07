from flask import request, jsonify, abort


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

    if not (0 <= int(request.args["room_timeout"]) <= 99):
        return jsonify({
            "status_code": 400,
            "error": "La duración despues de desconexión tiene que estar entre 0 y 99"
        }), 400

    # Si está todo validado termina
    return jsonify({
        "status_code": 200,
        "msg": "Se ha creado la sala correctamente"
    }), 200

def leaveRoom():
    return "Leaving"

def deleteRoom():
    return "Deleting"

