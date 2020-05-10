#!/usr/bin/env python3
"""Download images provided in wedding-list.csv"""

import csv
import subprocess

WEDDING_LIST_IMG_DIR = "static/img/wedding-list/"
WEDDING_LIST_CSV = "backend/db/wedding-list.csv"

with open(WEDDING_LIST_CSV) as csvfile:
    reader = csv.reader(csvfile, quotechar='"')
    next(reader)
    images_urls = {row[3] for row in reader}
cmd = ['wget', '--no-clobber', '-P', WEDDING_LIST_IMG_DIR] + list(images_urls)
subprocess.run(cmd)
