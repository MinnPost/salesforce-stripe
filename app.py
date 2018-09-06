import os
import sys
import json

from flask import Flask, redirect, render_template, request, send_from_directory, jsonify
from forms import DonateForm, BlastForm
from raven.contrib.flask import Sentry
from sassutils.wsgi import SassMiddleware
import stripe
from validate_email import validate_email

from config import FLASK_SECRET_KEY, FLASK_DEBUG
from salesforce import add_customer_and_charge
from salesforce import add_blast_customer_and_charge
from app_celery import make_celery

from pprint import pprint

app = Flask(__name__)

app.secret_key = FLASK_SECRET_KEY

app.wsgi_app = SassMiddleware(app.wsgi_app, {
        'app': ('static/sass', 'static/css', 'static/css')
        })

app.config.from_pyfile('config.py')
app.config.update(
        CELERY_ACCEPT_CONTENT=['pickle', 'json'],
        CELERY_ALWAYS_EAGER=False,
        CELERY_IMPORTS=('app', 'salesforce', 'batch'),
        )
stripe.api_key = app.config['STRIPE_KEYS']['secret_key']

celery = make_celery(app)

# Set up to send logging to stdout and Heroku forwards to Papertrail
LOGGING = {
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'strm': sys.stdout
        },
    }
}

if app.config['ENABLE_SENTRY']:
    sentry = Sentry(app, dsn=app.config['SENTRY_DSN'])

"""
Redirects, including for URLs that used to be
part of the old donations app that lived at
support.texastribune.org.
"""
@app.route('/blast-vip')
def the_blastvip_form():
    return redirect('/blastform', code=302)

@app.route('/')
def root_route():
    return redirect('/donate', code=302)

@app.route('/index.html')
def index_html_route():
    return redirect('/donate', code=302)

@app.route('/faq.html')
def faq_html_route():
    return redirect('/donate', code=302)

@app.route('/levels.html')
def levels_html_route():
    return redirect('/donate', code=302)

@app.route('/memberform')
def member_form_route():
    return redirect('/donate', code=302)

@app.route('/donateform')
def donate_form_route():
    return redirect('/donate', code=302)

@app.route('/circle.html')
def circle_html_route():
    return redirect('/circleform', code=302)

"""
Read the Webpack assets manifest and then provide the
scripts, including cache-busting hache, as template context.

For Heroku to compile assets on deploy, the directory it
builds to needs to already exist. Hence /static/js/prod/.gitkeep.
We don't want to version control development builds, which is
why they're compiled to /static/js/build/ instead.
"""
def get_bundles(entry):
    root_dir = os.path.dirname(os.getcwd())
    if FLASK_DEBUG:
        build_dir = os.path.join('static', 'build')
        asset_path = '/static/build/'
    else:
        build_dir = os.path.join(root_dir, 'app', 'static', 'prod')
        asset_path = '/static/prod/'
    bundles = {'css': [], 'js': []}
    manifest_path = os.path.join(build_dir, 'assets.json')
    with open(manifest_path) as manifest:
        assets = json.load(manifest)
    entrypoint = assets['entrypoints'][entry]
    for bundle in entrypoint['js']:
        bundles['js'].append(asset_path + bundle)
    for bundle in entrypoint['css']:
        bundles['css'].append(asset_path + bundle)
    return bundles

@app.route('/donate')
def member2_form():
    bundles = get_bundles('donate')
    return render_template('member-form2.html',
        bundles=bundles,
        key=app.config['STRIPE_KEYS']['publishable_key']
    )

@app.route('/circleform')
def circle_form():
    bundles = get_bundles('circle')
    return render_template('circle-form.html',
        bundles=bundles,
        key=app.config['STRIPE_KEYS']['publishable_key']
    )

@app.route('/blastform')
def the_blast_form():
    form = BlastForm()
    if request.args.get('amount'):
        amount = request.args.get('amount')
    else:
        amount = 349
    installment_period = request.args.get('installmentPeriod')

    campaign_id = request.args.get('campaignId', default='')
    referral_id = request.args.get('referralId', default='')

    return render_template('blast-form.html',
        form=form,
        campaign_id=campaign_id,
        referral_id=referral_id,
        installment_period=installment_period,
        openended_status='Open',
        amount=amount,
        key=app.config['STRIPE_KEYS']['publishable_key']
    )

@app.route('/submit-blast', methods=['POST'])
def submit_blast():
    form = BlastForm(request.form)

    email_is_valid = validate_email(request.form['stripeEmail'])

    if email_is_valid:
        customer = stripe.Customer.create(
            email=request.form['stripeEmail'],
            card=request.form['stripeToken']
        )
    else:
        message = "There was an issue saving your email address."
        return render_template('error.html', message=message)

    if form.validate():
        print("----Adding Blast subscription...")
        add_blast_customer_and_charge.delay(form=request.form,
                customer=customer)
        return render_template('blast-charge.html')
    else:
        message = "There was an issue saving your donation information."
        return render_template('error.html', message=message)

@app.route('/error')
def error():
    message = "Something went wrong!"
    return render_template('error.html', message=message)


@app.errorhandler(404)
def page_not_found(error):
    message = "The page you requested can't be found."
    return render_template('error.html', message=message), 404


@app.route('/create-customer', methods=['POST'])
def create_customer():
    stripe_email = request.json['stripeEmail']
    email_is_valid = validate_email(stripe_email)

    if email_is_valid:
        try:
            customer = stripe.Customer.create(
                email=stripe_email,
                card=request.json['stripeToken']
            )
            return jsonify({'customer_id': customer.id})
        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return jsonify({
                'expected': True,
                'type': 'card',
                'message': err.get('message', '')
            }), 400
    else:
        message = """Our servers had an issue saving your email address.
                    Please make sure it's properly formatted. If the problem
                    persists, please contact inquiries@texastribune.org."""
        return jsonify({
            'expected': True,
            'type': 'email',
            'message': message
        }), 400


@app.route('/charge', methods=['POST'])
def charge():
    error_message = "There was an issue saving your donation information."
    gtm = {}
    form = DonateForm(request.form)
    pprint('Request: {}'.format(request))

    customer_email = request.form['stripeEmail']
    customer_first = request.form['first_name']
    customer_last = request.form['last_name']

    bundles = get_bundles('charge')

    if form.validate():
        try:
            customer = stripe.Customer.retrieve(request.form['customerId'])
            add_customer_and_charge.delay(form=request.form, customer=customer)
            print('Validated form of customer {} {} {}'.format(customer_email,
                customer_first, customer_last))
            if request.form['installment_period'] == 'None':
                gtm['event_label'] = 'once'
            else:
                gtm['event_label'] = request.form['installment_period']
            gtm['event_value'] = request.form['amount']
            return render_template('charge.html',
                    amount=request.form['amount'], gtm=gtm, bundles=bundles)
        except stripe.error.InvalidRequestError as e:
            body = e.json_body
            err = body.get('error', {})
            message = err.get('message', '')
            if 'No such customer:' not in message:
                raise e
            else:
                print(message)
                return render_template('error.html', message=error_message)
    else:
        print('Form validation errors: {}'.format(form.errors))
        print('Did not validate form of customer {} {} {}'.format(
            customer_email, customer_first, customer_last))
        return render_template('error.html', message=error_message)


@app.route('/.well-known/apple-developer-merchantid-domain-association')
def merchantid():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'app'),
            'apple-developer-merchantid-domain-association')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
