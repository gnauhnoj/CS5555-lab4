# CS5555 - Lab4 (jhh283 + jd837)

This directory assumes the following:
* data files are found in a data/ directory in root
* a config file which provide the following:
  - filemap - a dictionary mapping from fitbit datatype to file data/ filename (.json). For example:

  ```
    {
      'activity': 'activity.json',
      'steps': 'steps.json',
    }
  ```

  - dataloader - a dictionary mapping from various required fields in data.py to their corresponding requirements. For example:

  ```
    {
        'host': localhost for ohmage shimmer,
        'username': username,
        'shim': 'fitbit',
        'start': start date,
        'normalize': 'false',
        'endpoints': ['activity', 'steps']
    }
  ```

Fitbit data can be pulled using the script data.py script if the second config is provided.
