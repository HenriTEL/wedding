# TODO
* Add ci + tests

**Improvements**  
* Refactor js components
* Rewrite js in typescript

# Wedding
A static wedding website and a **wedding list** app based on [bootstrap](https://getbootstrap.com/).  
Most content take the form of `html` and `css` files generated using [pug](https://pugjs.org) and [sass](https://sass-lang.com) for simplicity.  
The wedding list app is based on [FastAPI](https://fastapi.tiangolo.com/).

## Dev Quickstart
**Prerequisites**  
Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose).  

**Installation**
```bash
# From the root dir of this repo, run
sudo apt install -y nodejs npm wget unzip
sudo npm install -g pug-cli sass
cp vars.example.pug vars.pug
wget --no-clobber -P static/ \
  https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js \
  https://code.jquery.com/jquery-3.4.1.slim.min.js \
  https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
wget https://github.com/twbs/bootstrap/archive/v4.4.1.zip \
  && unzip v4.4.1.zip \
  && rm v4.4.1.zip
```

**Start developping**
```bash
# Run the following 3 processes (web server, pug and sass compilers) in different shells
docker-compose up
pug --pretty --watch templates --out static
sass --watch --no-source-map templates:static 
```
Go to http://localhost:8080/


## Customize
**Content**  
Most content can be customized by setting values in `vars.pug`.

**Wedding list**  
Make your wedding list spreadsheet at `backend/db/wedding-list.csv`.  
It must follow the format of `backend/db/wedding-list.example.csv`, the first line is ignored.  
Download your wedding list images by running `./dl_wl_imgs.py`.

## Deploy in production
