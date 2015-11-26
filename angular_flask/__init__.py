import os
import json
import datetime
from flask import Flask, request, Response
from flask import render_template, send_from_directory, url_for
from data_processing.loader import load_files

app = Flask(__name__)
data, FIRST_DATE, LAST_DATE = load_files()

FIRST_DATE = datetime.date(FIRST_DATE.year, FIRST_DATE.month, FIRST_DATE.day)
LAST_DATE = datetime.date(LAST_DATE.year, LAST_DATE.month, LAST_DATE.day)

app.config.from_object('angular_flask.settings')

app.url_map.strict_slashes = False

import angular_flask.core
import angular_flask.models
import angular_flask.controllers
