import os
import json

from flask import Flask, request, Response
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort
from data_processing.analysis import get_data_over_period, get_last_year_data

from angular_flask import app, data

# routing for API endpoints, generated from the models designated as API_MODELS
from angular_flask.core import api_manager
from angular_flask.models import *

from sqlalchemy.sql import exists


for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

session = api_manager.session


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/graphs')
@app.route('/analysis')
@app.route('/recommendations')
def basic_pages(**kwargs):
    return make_response(open('angular_flask/templates/index.html').read())


# routing for CRUD-style endpoints
# passes routing onto the angular frontend if the requested resource exists
crud_url_models = app.config['CRUD_URL_MODELS']


@app.route('/api/graphdata', methods=['GET'])
def graph_data():
    out = {}
    out['x'], out['y_steps'], out['y_sed_act'], out['y_med_act'] = get_data_over_period(data, serialize_dates=True)
    out['last_steps'], out['last_sed_act'], out['last_med_act'] = get_last_year_data(data)
    return json.dumps(out)


@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
def rest_pages(model_name, item_id=None):
    if model_name in crud_url_models:
        model_class = crud_url_models[model_name]
        if item_id is None or session.query(exists().where(
                model_class.id == item_id)).scalar():
            return make_response(open(
                'angular_flask/templates/index.html').read())
    abort(404)


# special file handlers and error handlers
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'img/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
