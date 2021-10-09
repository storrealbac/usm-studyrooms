from flask import render_template


def home():
    return render_template(
        "room/home.html",
        title="USM Studyrooms",
        color_fondo="bg-red-400"
    )
