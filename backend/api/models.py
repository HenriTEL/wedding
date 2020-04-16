import os
import json

from config import CONTRIBUTORS_PATH, WL_PATH_JSON, WL_PATH_CSV


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


class WeddingList:
    def __init__(self):
        def _load_csv(path):
            res = {}
            with open(path) as csv_fd:
                next(csv_fd)
                for l in csv_fd:
                    fields = l.split(',')
                    title = fields[0]
                    res[title] = {'category': fields[1].rstrip(),
                                'price': fields[2].rstrip(),
                                'image': fields[3].rstrip()}
            return res

        if os.path.isfile(WL_PATH_JSON):
            with open(WL_PATH_JSON) as wl_fd:
                self.items = json.load(wl_fd)
        elif os.path.isfile(WL_PATH_CSV):
            self.items = _load_csv(WL_PATH_CSV)
        else:
            raise OSError(f'Neither {WL_PATH_JSON} nor {WL_PATH_CSV} were found, '
                           'did you set the right DB_PATH ?')

    def add_contributions(self, contributions):
        for key, amount in contributions:
            self._add_contribution(key, amount)
        self._save()

    def _add_contribution(self, key, amount):
        if 'contributions' in self.items[key]:
            self.items[key]['contributions'].append(amount)
        else:
            self.items[key]['contributions'] = [amount]

    def _save(self):
        with open(WL_PATH_JSON, 'w') as wl_fd:
            json.dump(self.items, wl_fd)