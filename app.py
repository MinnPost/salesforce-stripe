import os

import stripe
from flask import Flask, render_template, request
from sassutils.wsgi import SassMiddleware
from salesforce import add_opportunity
from salesforce import add_recurring_donation
from salesforce import upsert_customer

from app_celery import make_celery

import batch

from pprint import pprint

app = Flask(__name__)
app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'app': ('static/sass', 'static/css', 'static/css')
        })

app.config.from_pyfile('config.py')
app.config.update(
        CELERY_ALWAYS_EAGER=False,
        CELERY_TASK_SERIALIZER="pickle",
        CELERY_IMPORTS=('app', 'salesforce', 'batch'),
        )
stripe.api_key = app.config['STRIPE_KEYS']['secret_key']

celery = make_celery(app)


@app.route('/memberform')
def checkout_form():
    return render_template('member-form.html',
            key=app.config['STRIPE_KEYS']['publishable_key'])


@app.route('/donateform')
def donate_renew_form():
    return render_template('donate-form.html',
            key=app.config['STRIPE_KEYS']['publishable_key'])


@app.route('/circleform')
def circle_form():
    return render_template('circle-form.html',
            key=app.config['STRIPE_KEYS']['publishable_key'])


@app.route('/error')
def error():
    message = "Something went wrong!"
    return render_template('error.html', message=message)


@celery.task(name='app.add_customer_and_charge')
def add_customer_and_charge(form=None, customer=None):
    upsert_customer(form=form, customer=customer)

    if (form['InstallmentPeriod'] == 'None'):
        print("----One time payment...")
        add_opportunity(form=form, customer=customer)
    else:
        print("----Recurring payment...")
        add_recurring_donation(form=form, customer=customer)
    return True


@app.route('/charge', methods=['POST'])
def charge():

    pprint('Request: {}'.format(request))

    customer = stripe.Customer.create(
        email=request.form['stripeEmail'],
        card=request.form['stripeToken']
    )

    result = add_customer_and_charge.delay(form=request.form,
            customer=customer)
    pprint(result)

    return render_template('charge.html',
            amount=request.form['Opportunity.Amount'])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
