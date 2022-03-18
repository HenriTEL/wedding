# Wedding

A wedding website with a full-featured wedding list using [Stripe](stripe.com/) for payments.

## Dev Quickstart

Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose).  

### Setup

Clone this repo and `cd` into it.  
For a debian-like host:

```bash
# Install dependencies
sudo apt install -y nodejs npm wget unzip
sudo npm install -g pug-cli sass
wget --no-clobber -P static/ \
  https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js \
  https://code.jquery.com/jquery-3.4.1.slim.min.js \
  https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
wget https://github.com/twbs/bootstrap/archive/v4.4.1.zip \
  && unzip v4.4.1.zip \
  && rm v4.4.1.zip

# Populate custom content
cp vars.example.pug vars.pug
cp templates/about-us-content.example.pug templates/about-us-content.pug
cp backend/db/wedding-list.example.csv backend/db/wedding-list.csv
cp static/img/about-us.example.jpg static/img/about-us.jpg
cp static/img/about-us/1.example.jpg static/img/about-us/1.jpg
cp secrets.example.env secrets.env
```

Set your secrets in `secrets.env` (use your stripe test key).  
Also set `STRIPE_PUBLIC_KEY` in `vars.pug`.  
reCAPTCHA is used to avoid bot scrapping. You can leave it if you don't care.  

### Run the dev server

Run the 3 following commands in 3 different shells.

```bash
docker-compose up
pug --pretty --watch templates --out static
sass --watch --no-source-map templates:static 
```

Go to <http://localhost:8080/>

## Customize

General content is in `vars.pug`.  
Images are in `static/img/`.  
About us image names must be numbers (1.jpg, 2.jpg, etc.) and you must set the total number of images in `vars.pug`.  
Update `templates/components/countdown.js` for an accurate date.

### Wedding list

:warning: Avoid deleting/renaming existing items as it will mess up the contributions count.  
Make your wedding list spreadsheet at `backend/db/wedding-list.csv`. You can also download a Google Sheet.  
It must follow the format of `backend/db/wedding-list.example.csv`, the first line is ignored.  
Download your wedding list images by running `./dl_wl_imgs.py`.

## Deploy in production
