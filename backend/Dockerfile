FROM python:3.8-alpine

ENV FLASK_APP /api/main.py
ENV FLASK_ENV development
ENV FLASK_DEBUG 1

RUN pip3 install flask==1.1.*
COPY api /

ENTRYPOINT ["flask", "run"]