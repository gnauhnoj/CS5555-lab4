import requests
import datetime
import json
from config import dataloader

# this code assumes that docker instance of mhealth shimmer is running
# assumes fitbit credentials have been set up
# also assumes that the user specified below has authorized
# pulls in fitbit data and saves into json files in the /data directory
host = dataloader['host']
username = dataloader['username']
shim = dataloader['shim']
start = dataloader['start']
end = datetime.datetime.today().strftime('%Y-%m-%d')
normalize = dataloader['normalize']
endpoints = dataloader['endpoints']

for measure in endpoints:
    url = 'http://{host}:8083/data/{shim}/{endpoint}?username={username}&dateStart={start}&dateEnd={end}&normalize={normalize}'

    url = url.format(host=host, shim=shim, username=username, start=start, end=end, normalize=normalize, endpoint=measure)

    r = requests.get(url)
    if r.status_code == 200:
        fname = 'data/{filename}.json'.format(filename=measure)
        data = r.json()
        with open(fname, 'w') as outfile:
            json.dump(data, outfile)
    else:
        print measure, 'resulted in non-200 response'
