# config file for loading / saving fitbit files from mhealth shimmer
filemap = {
  0: 'activity-0.json',
  1: 'activity-1.json',
  2: 'activity-2.json',
  3: 'activity-3.json',
  4: 'activity-4.json',
  5: 'activity-5.json',
  6: 'activity-6.json',
  7: 'activity-7.json',
  8: 'activity-8.json',
  9: 'activity-9.json',
  10: 'activity-10.json',
  11: 'activity-11.json',
}
dataloader = {
  'host': '192.168.99.100',
  'username': 'gnauhnoj',
  'shim': 'fitbit',
  # change start/end to pull different data periods
  'start': '2014-11-01',
  'end': '2015-01-01',
  'normalize': 'false',
  'endpoints': ['activity']
}
