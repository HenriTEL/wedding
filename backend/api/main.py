import os
import logging
import json
import stripe
from fastapi import FastAPI, Request, Header, Body

from .models import WeddingList, Contributions

WEBSITE_HOST = os.getenv('WEBSITE_HOST')
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


@app.get('/wedding-list')
def wedding_list():
    return list(wl.values())


@app.post('/stripe-checkout-session')
def create_stripe_checkout_session(item_id: str = Body(...),
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
def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    try:
        event = stripe.Webhook.construct_event(
            payload=bytes.decode(await request.body()),
            sig_header=stripe_signature,
            secret=STRIPE_WEBHOOK_SECRET_KEY)
        bill = event.data.get('object')
    except Exception as e:
        logging.error(e)
        return {'error': str(e)}, 403

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
