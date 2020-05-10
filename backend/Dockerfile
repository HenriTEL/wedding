FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-alpine3.10

RUN pip install --no-cache-dir sortedcollections stripe
COPY ./api /app/app
