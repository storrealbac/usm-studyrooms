from flask import Flask, render_template

# Views
from views.home import home
from views.error import page_not_found, internal_server_error
from views.about import project_license, usage_guide, project_developers

app = Flask(__name__)

app.add_url_rule("/", view_func=home)
app.add_url_rule("/licencia", view_func=project_license)
app.add_url_rule("/guia", view_func=usage_guide)
app.add_url_rule("/desarrolladores", view_func=project_developers)

# HTTP Error View Handlers
app.register_error_handler(404, page_not_found)
app.register_error_handler(500, internal_server_error)

if __name__ == "__main__":
    app.debug = True
    app.run()