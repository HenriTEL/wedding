import os

DB_PATH = os.environ.get('DB_PATH', '/db')
WL_PATH_JSON = os.path.join(DB_PATH, 'wedding-list.json')
WL_PATH_CSV = os.path.join(DB_PATH, 'wedding-list.csv')
CONTRIBUTORS_PATH = os.path.join(DB_PATH, 'contributors.json')