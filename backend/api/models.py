import csv
import json
import logging
import os
import unicodedata
from pathlib import Path

from sortedcollections import ValueSortedDict

from .config import CONTRIBUTIONS_PATH, WL_PATH


class Contributions(dict):
    def __init__(self):
        if os.path.isfile(CONTRIBUTIONS_PATH):
            with open(CONTRIBUTIONS_PATH) as cont_fd:
                for line in cont_fd:
                    contribution = json.loads(line)
                    payment_id = contribution.pop('payment_id')
                    self[payment_id] = contribution

    def add(self, payment_id: str, contribution: dict):
        contribution['item_id'] = to_id(contribution['item_id'])
        self[payment_id] = contribution
        self._write_contribution({
            **contribution,
            **{
                'payment_id': payment_id
            }
        })

    def _write_contribution(self, contribution: dict):
        with open(CONTRIBUTIONS_PATH, 'a') as cont_fd:
            print(json.dumps(contribution), file=cont_fd)


class WeddingList(ValueSortedDict):
    def __init__(self, contributions={}):
        super().__init__(lambda v: v['price_cent'] - v['contribution_amount'])
        if os.path.isfile(WL_PATH):
            for fields in get_csv_fields(WL_PATH):
                item_name = fields[0]
                item_id = to_id(item_name)
                self[item_id] = {
                    'name': item_name,
                    'category': fields[1].rstrip() if fields[1] else 'Autre',
                    'price_cent': to_cent(fields[2]),
                    'contribution_amount': 0,
                    'image': fields[3].split('/')[-1].rstrip()
                }
            self._init_contributions(contributions)
        else:
            raise FileNotFoundError(
                f'{WL_PATH} not found, did you set the right DB_PATH ?')

    def add_contribution(self, item_name: str, amount: int):
        self[to_id(item_name)]['contribution_amount'] += amount

    def _init_contributions(self, contributions):
        for _, contribution in contributions.items():
            item_id = contribution['item_id']
            self[item_id] += contribution['amount']


def get_csv_fields(path):
    with open(path) as csv_fd:
        reader = csv.reader(csv_fd, quotechar='"')
        next(reader)
        for row in reader:
            yield row


def to_cent(price: str):
    return int(round(float(price.rstrip()), 2) * 100)


def to_id(item_name: str):
    res = ''
    nfd_form = unicodedata.normalize('NFD', item_name)
    for c in nfd_form:
        if c == ' ':
            res += '_'
        elif not unicodedata.combining(c):
            res += c
    return res
