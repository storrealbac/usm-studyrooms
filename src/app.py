from flask import Flask, render_template

# Views
from views.home import home
from views.error import page_not_found
from views.about import proyect_license

app = Flask(__name__)

app.add_url_rule("/", view_func=home)
app.add_url_rule("/licencia", view_func=proyect_license)
app.register_error_handler(404, page_not_found)

if __name__ == "__main__":
    app.debug = True
    app.run()