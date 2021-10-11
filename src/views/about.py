from flask import render_template

def project_license():
    return render_template(
        "about/licencia.html",
        title="Licencia",
        color_fondo="bg-color-champagnepink"
    ).replace("&quot;", "\"")

def usage_guide():
    return render_template(
        "about/guia.html",
        title="Guia de uso",
        color_fondo="bg-color-champagnepink"
    )

def project_developers():
    return render_template(
        "about/desarrolladores.html",
        title="Desarrolladores",
        color_fondo="bg-color-champagnepink"
    )