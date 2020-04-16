import os
import json
from flask import Flask, request

from models import Contributors, WeddingList


app = Flask(__name__)
wl = WeddingList()


@app.route('/', methods=['GET'])
def root():
    return "Hello, I'm running!"

@app.route('/wedding-list', methods=['GET', 'PUT'])
def wedding_list():
    if request.method == 'POST':
        pass
    elif request.method == 'GET':
        return wl.items