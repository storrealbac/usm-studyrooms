from flask import render_template

def home():
    return render_template(
        "home/inicio.html",
        title="USM Studyrooms",
        color_fondo="bg-red-400"
    )