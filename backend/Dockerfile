FROM python:3.8-alpine3.10

RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && pip install --no-cache-dir hypercorn \
    && apk del .build-deps gcc libc-dev make

RUN pip install --no-cache-dir fastapi requests sortedcollections stripe
COPY ./api /app/app
WORKDIR /app/

ENTRYPOINT ["hypercorn"]