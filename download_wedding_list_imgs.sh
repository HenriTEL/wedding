#!/bin/sh

readonly WEDDING_LIST_IMG_DIR="static/img/wedding-list/"
readonly IMG_URLS="$(tail +2 backend/db/wedding-list.csv | awk -F , '{print $NF}' | tr -d '\r' | sort -u)"

mkdir -p "${WEDDING_LIST_IMG_DIR}"
wget --no-clobber -P "${WEDDING_LIST_IMG_DIR}" ${IMG_URLS}
