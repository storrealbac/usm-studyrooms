from flask import render_template

def home():
    return render_template(
        "home/inicio.html",
        title="USM Studyrooms",
        color_fondo="bg-color-champagnepink",
        imagen_fondo="url_for('static',filename='img/cafesketch.png')"
    )