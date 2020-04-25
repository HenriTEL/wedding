import logging
import os
import json

from config import CONTRIBUTORS_PATH, WL_PATH


class Contributors:
    def __init__(self):
        if os.path.isfile(CONTRIBUTORS_PATH):
            with open(CONTRIBUTORS_PATH) as wl_fd:
                self.items = json.load(wl_fd)
        else:
            self.items = {}
    
    def add_contribution(self, name, email, item, amount):
        if email in self.items:
            self.items[email]['contributions'].append((item, amount))
        else:
            self.items[email]['contributions'] = [(item, amount)]

        if name not in self.items[email]['names']:
            self.items[email]['names'].append(name)

        self._save()

    def _save(self):
        with open(CONTRIBUTORS_PATH, 'w') as cont_fd:
            json.dump(self.items, cont_fd)


class WeddingList(dict):
    def __init__(self):
        if os.path.isfile(WL_PATH):
            for fields in get_csv_fields(WL_PATH):
                name = fields[0]
                category = fields[1].rstrip() if fields[1] else 'Autre'
                self[name] = {'category': category,
                              'price': fields[2].rstrip(),
                              'contribution_amount': 0,
                              'image': fields[3].split('/')[-1].rstrip()}
        else:
            raise FileNotFoundError(f'{WL_PATH} not found, did you set the right DB_PATH ?')

    def set_contribution_amounts(self, contributions):
        for key, amount in contributions:
            self[key]['contribution_amount'] += amount

    def sorted(self):
        res = [{**v , 'name': k} for k, v in self.items()]
        return sorted(res, key = lambda i: i['price'])


def get_csv_fields(path):
    with open(path) as csv_fd:
        next(csv_fd)
        for l in csv_fd:
            yield l.split(',')