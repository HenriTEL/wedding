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
./dl_wl_imgs.py
```

Set your secrets in `secrets.env` (use your [test apikeys](https://dashboard.stripe.com/test/apikeys)).  
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

### Testing

Use 4242 4242 4242 4242, any future date and any 3 digit CVC to test payments.  
In order to check the stripe webhook (items payments progress bar and contributions file), follow those steps:  

1. Install the [stripe cli](https://stripe.com/docs/stripe-cli).  
2. Run `stripe listen --skip-verify --forward-to localhost:8080/api/stripe-webhook` in a terminal.  
3. Set your `STRIPE_WEBHOOK_SECRET_KEY` in `secrets.env`.  
4. Reload the server (kill and re-run `docker-compose up`).  

Simulate an event `stripe trigger checkout.session.completed`, reload the weddinf list, check `backend/db/contributions.json`.

## Customize

Set general content is in `vars.pug`.  
Go to `templates/wedding.scss` to change the main color.  
Change images in `static/img/`.  
Images in about us must be named 1.jpg, 2.jpg, etc. and you must set the sum in `vars.pug`.  
Update the date in `templates/components/countdown.js` for an accurate countdown.  
Setup [payment branding](https://dashboard.stripe.com/settings/branding).

### Wedding list

:warning: Avoid deleting/renaming existing items as it will mess up the contributions count. Use image URLs in the form `http://xxx.com/xxx.jpg` as  much as possible.  
Make your wedding list spreadsheet at `backend/db/wedding-list.csv`. You can also download a Google Sheet.  
It must follow the format of `backend/db/wedding-list.example.csv`, the first line is ignored.  
Download your wedding list images by running `./dl_wl_imgs.py`.

## Deploy in production

Set you [stripe webhook](https://dashboard.stripe.com/webhooks).
