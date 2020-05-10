import os

DB_PATH = os.environ.get('DB_PATH', '/db')
WL_PATH = os.path.join(DB_PATH, 'wedding-list.csv')
CONTRIBUTIONS_PATH = os.path.join(DB_PATH, 'contributions.json')