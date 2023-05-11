# Wedding

I archived this project as I don't plan to update it anymore. It should still work until the stripe API it relies on gets deprecated.

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

### Run the dev server

Run the 3 following commands in 3 different shells.

```bash
docker-compose up
pug --pretty --watch templates --out static
sass --watch --no-source-map templates:static 
```

Go to <http://localhost:8080/>

### Testing

In order to check the stripe webhook (contributions progress bar), follow those steps:  

1. Install the [stripe cli](https://stripe.com/docs/stripe-cli).  
2. Run `stripe listen --skip-verify --forward-to localhost:8080/api/stripe-webhook` in a terminal.  
3. Set your `STRIPE_WEBHOOK_SECRET_KEY` in `secrets.env`.  
4. Reload the server (kill and re-run `docker-compose up`).  

Simulate an event `stripe trigger checkout.session.completed`, reload the weddinf list, check `backend/db/contributions.json`.
You can also use the credit card 4242 4242 4242 4242, any future date and any 3 digit CVC.  

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

You can access contributor names, amount and associated messages in the payment tab of your stripe dashboard.

## Deploy in production

You can deploy on a bare server from any provider (OVH, Hetzner, scaleway, etc.) or deploy containers on fly.io directly (free and setup TLS for you).  
If you feel adventurous you can also deploy on your home server. In any case, set your [stripe webhook](https://dashboard.stripe.com/webhooks).  
:bulb: Advice: make regular backups the `/db/` of API.  

### On a bare server

Update `secrets.env` with your live keys.  
On your server, copy `backend/` and `static/`.  
Setup TLS (you can use Let's Encrypt cets) and https in nginx conf.  
See `docker-compose.prod.yml` for a prod-ready example.

### Using fly.io

1. Create an account, launch 2 apps, one from the root, one from `backend/`.  
2. Update `proxy_pass` for the API with your app name in `nginx.conf`.  
3. In the backend app, avoid exposing the API directly by removing the `services.ports` sections in your `fly.toml`.  
4. Add secrets to the fly app corresponding to the API `cat secrets.env | flyctl secrets import`.  
5. Set custom envs for the API (see `docker-compose.yml`), update `WEBSITE_HOST`, add `SKIP_WL_CHECK` (needed before we copy the wedding list on the volume in the next step).  
6. Make a volume the `/db/` volume for the API, mount it and copy `wedding-list.csv` to it as necessary.  
7. Remove `SKIP_WL_CHECK` and restart the API.  
As the wedding list gets updated, don't forget to run `./dl_wl_imgs.py` and to `fly deploy` the nginx proxy.  

:warning: Always copy `wedding-list.csv` only as you may lose `contributions.json` if you copy `db/` entirely.  
