import json
import logging
import os

from fastapi import FastAPI, Request, Header, Body
from fastapi.responses import PlainTextResponse
import requests
import stripe

from .models import WeddingList, Contributions

WEBSITE_HOST = os.getenv('WEBSITE_HOST')
CARPOOLING_URL = os.getenv('CARPOOLING_URL')
RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET_KEY = os.getenv('STRIPE_WEBHOOK_SECRET_KEY')
CURRENCY = os.getenv('CURRENCY')

stripe.api_key = STRIPE_SECRET_KEY
stripe.api_version = os.getenv('STRIPE_API_VERSION')
contributions = Contributions()

app = FastAPI()
wl = WeddingList(contributions)


@app.get('/')
async def hello():
    return "Hello, I'm the wedding API."


@app.get('/carpooling-url/{reCAPTCHA_token}', response_class=PlainTextResponse)
async def carpooling_url(reCAPTCHA_token):
    res = requests.post('https://www.google.com/recaptcha/api/siteverify',
                        data={'secret': RECAPTCHA_SECRET_KEY,
                              'response': reCAPTCHA_token}).json()
    if res['success']:
        return CARPOOLING_URL
    return 'The reCAPTCHA verification failed.', 403


@app.get('/wedding-list')
async def wedding_list():
    return list(wl.values())


@app.post('/stripe-checkout-session')
async def create_stripe_checkout_session(item_id: str = Body(...),
                                   amount_cent: int = Body(...),
                                   contributor_name: str = Body(...),
                                   message: str = Body(...)):
    # For full details see https:stripe.com/docs/api/checkout/sessions/create
    item = {
                "name": wl[item_id]['name'],
                "images": [f"{WEBSITE_HOST}/img/wedding-list/{wl[item_id]['image']}"],
                "quantity": 1,
                "currency": CURRENCY,
                "amount": amount_cent
            }
    if message:
        item["description"] = message
    try:
        checkout_session = stripe.checkout.Session.create(
            success_url=f'{WEBSITE_HOST}/liste?checkout_status=success',
            cancel_url=f'{WEBSITE_HOST}/liste?checkout_status=cancel',
            submit_type='donate',
            metadata={'contributor_name': contributor_name},
            payment_method_types=["card"],
            line_items=[item])
    except Exception as e:
        return {'error': str(e)}, 403
    return {'sessionId': checkout_session['id']}


@app.post('/stripe-webhook')
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    try:
        event = stripe.Webhook.construct_event(
            payload=await request.body(),
            sig_header=stripe_signature,
            secret=STRIPE_WEBHOOK_SECRET_KEY)
        bill = event.data.get('object')
    except Exception as e:
        logging.error(e)
        return {'error': str(e)}, 403

    logging.info("Received Stripe webhook event: id=%s, type=%s", event.id, event.type)
    if event.type == 'checkout.session.completed' and event.id not in contributions:
        # See https://stripe.com/docs/api/checkout/sessions/object
        customer = stripe.Customer.retrieve(bill['customer'])
        contribution = {
            'amount': bill['display_items'][0]['amount'],
            'contributor_email': customer['email'],
            'contributor_name': bill['metadata']['contributor_name'],
            'item_id': bill['display_items'][0]['custom']['name'],
            'message': bill['display_items'][0]['custom']['description'],
        }
        wl.add_contribution(contribution['item_id'], contribution['amount'])
        contributions.add(event.id, contribution)

    return {'status': 'success'}
