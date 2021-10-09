from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template(
        "room/home.html",
        title="USM Studyrooms",
        color_fondo="bg-red-500"
    )

@app.errorhandler(404)
def page_not_found(error):
    return render_template(
        "error/error.html", 
        title="Aquí no se estudia...", 
        color_fondo="bg-red-500",
        error_code="404",
        error_text="Esta página no existe"
    )

if __name__ == "__main__":
    app.debug = True
    app.run()