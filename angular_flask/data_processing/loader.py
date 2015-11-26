import csv
import json
import logging
import datetime
from collections import defaultdict
from config import filemap
__author__ = 'jhh283'

# script that loads data from files into a class structure called Stats

logging.basicConfig(filename='loader.log', level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


def convert_dt(dt_str):
    dt = datetime.datetime.strptime(dt_str, '%Y-%m-%d')
    return dt


class Stats(object):
    def __init__(self):
        self.date = None
        self.activity = {}
        # need map for getitem...
        self.map = {
            'date': self.date,
            'activity': self.activity,
        }

    def __getitem__(self, key):
        return self.map[key]


def load_json(filename, rows, label, start_date, end_date):
    label = 'activity'
    # earliest,
    with open(filename, 'rb') as f:
        data = json.load(f)
        data = data['body']
        for datum in data:
            datum = datum['result']
            date = datum['date']
            parsed_date = datetime.datetime.strptime(date, '%Y-%m-%d')
            if start_date is None or parsed_date < start_date:
                start_date = parsed_date
            if end_date is None or parsed_date > end_date:
                end_date = parsed_date
            datum = datum['content']
            for key in datum:
                if rows[date].date is None:
                    rows[date].date = convert_dt(date)
                rows[date][label][key] = datum[key]
    return start_date, end_date


def load_files(folder_name=None):
    start_date, end_date = None, None
    if not folder_name:
        folder_name = 'angular_flask/data_processing/data'
    folder_name += '/{filename}'
    rows = defaultdict(Stats)
    for label, filename in filemap.iteritems():
        fn = folder_name.format(filename=filename)
        start_date, end_date = load_json(fn, rows, label, start_date, end_date)
    return rows, start_date, end_date

if __name__ == '__main__':
    out, start_date, end_date = load_files()
    print out['2015-01-08'].activity
    print start_date, end_date
