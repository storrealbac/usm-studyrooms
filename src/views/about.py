from flask import render_template

def proyect_license():
    return render_template(
        "about/license.html",
        title="Licencia",
        color_fondo="bg-red-400"
    )