from flask import render_template

def rooms_creating():
    return render_template(
        "room/create.html",
        title="Creando sala",
        color_fondo="bg-color-champagnepink"
    )