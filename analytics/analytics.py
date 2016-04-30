import json
import os
import io

path_to_data = os.getcwd()[:-9] + 'data/'

with open(path_to_data + 'skill-map.json') as data_file:
	data = json.load(data_file)

keys = data.keys()