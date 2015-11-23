from datetime import datetime

# from angular_flask.core import db
from angular_flask import app


# models for which we want to create API endpoints
app.config['API_MODELS'] = {}

# models for which we want to create CRUD-style URL endpoints,
# and pass the routing onto our AngularJS application
app.config['CRUD_URL_MODELS'] = {}
