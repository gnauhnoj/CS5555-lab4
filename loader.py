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


def load_json(filename, rows, label):
    with open(filename, 'rb') as f:
        data = json.load(f)
        data = data['body']
        # i hate these if statements...
        if label == 'weight':
            data = data['weight']
        for datum in data:
            if label != 'weight':
                datum = datum['result']
            date = datum['date']
            if label != 'weight':
                datum = datum['content']
            for key in datum:
                if rows[date].date is None:
                    rows[date].date = convert_dt(date)
                rows[date][label][key] = datum[key]


# THIS NEEDS TO CHANGE FOR NEW MONTHLY FILES
def load_files():
    rows = defaultdict(Stats)
    for label, filename in filemap.iteritems():
        fn = 'data/{filename}'.format(filename=filename)
        load_json(fn, rows, label)
    return rows

if __name__ == '__main__':
    out = load_files()
    print out['2015-10-16'].activity
