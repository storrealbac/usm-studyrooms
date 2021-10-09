from flask import render_template

def page_not_found(error):
    return render_template(
        "error/error.html", 
        title="Aquí no se estudia...", 
        color_fondo="bg-red-600",
        error_code="404",
        error_text="Esta página no existe"
    )


def internal_server_error(error):
    return render_template(
        "error/error.html", 
        title="Ups, hubo un error...", 
        color_fondo="bg-red-600",
        error_code="500",
        error_text="Error interno del servidor"
    )