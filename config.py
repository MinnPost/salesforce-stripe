# from celery.schedules import crontab
from datetime import timedelta

import os


def bool_env(val):
    """Replaces string based environment values with Python booleans"""
    return True if os.environ.get(val, False) == 'True' else False

TIMEZONE = os.getenv('TIMEZONE', "US/Central")
IP_BAN_LIST = os.getenv('IP_BAN_LIST', '')
EMAIL_BAN_LIST = os.getenv('EMAIL_BAN_LIST', '')

#######
# Flask
#
FLASK_SECRET_KEY = os.getenv('FLASK_SECRET_KEY', '\xa5\xcc\xff\x8dT\xea%W\xdb\xdd\x85>\xdae\xd85D\xb7\xd2\x11(U\xac\x08')
ROOT_URL = os.getenv('ROOT_URL')

########
# Celery
#

# for texas default is 4am and 4pm:
#BATCH_HOURS = os.getenv('BATCH_HOURS', '4, 16')
#CELERY_TIMEZONE = TIMEZONE
CLOUDAMQP_URL = os.getenv('CLOUDAMQP_URL')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')
CELERY_ALWAYS_EAGER = bool_env('CELERY_ALWAYS_EAGER')
# for texas this is deprecated:
CHARGE_MINUTES_FREQUENCY = int(os.getenv('CHARGE_MINUTES_FREQUENCY', 1440))
# more of our stuff
ACH_MINUTES_FREQUENCY = int(os.getenv('ACH_MINUTES_FREQUENCY', 1440))
SHOW_ACH = os.getenv('SHOW_ACH', False)
SHOW_THANKYOU_LISTS = os.getenv('SHOW_THANKYOU_LISTS', False)
DEFAULT_FREQUENCY = os.getenv('DEFAULT_FREQUENCY', 'one-time')
CELERYBEAT_SCHEDULE = {
        'every-five-minutes': {
            'task': 'batch.charge_cards',
            'schedule': timedelta(minutes=CHARGE_MINUTES_FREQUENCY)
            # texas 'schedule': crontab(minute='0', hour=BATCH_HOURS)
            },
        'every-day': {
            'task': 'batch.update_ach_charges',
            'schedule': timedelta(minutes=ACH_MINUTES_FREQUENCY)
            },
        }
REDIS_URL = os.getenv('REDIS_URL')

######
# SMTP
#
MAIL_SERVER = os.getenv('MAIL_SERVER', 'localhost')
MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'user')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'pass')
MAIL_PORT = os.getenv('MAIL_PORT', '2525')
MAIL_USE_TLS = bool_env('MAIL_USE_TLS')
DEFAULT_MAIL_SENDER = os.getenv('DEFAULT_MAIL_SENDER', 'me@myplace.org')
MULTIPLE_ACCOUNT_WARNING_MAIL_RECIPIENT = os.getenv(
        'MULTIPLE_ACCOUNT_WARNING_MAIL_RECIPIENT', '')
ACCOUNTING_MAIL_RECIPIENT = os.getenv('ACCOUNTING_MAIL_RECIPIENT', '')

############
# Salesforce
#
MEMBERSHIP_RECORDTYPEID = '01216000001IhHp'
DONATION_RECORDTYPEID = '01216000001IhI9'
SALESFORCE = {
    "CLIENT_ID": os.getenv('SALESFORCE_CLIENT_ID'),
    "CLIENT_SECRET": os.getenv('SALESFORCE_CLIENT_SECRET'),
    "USERNAME": os.getenv('SALESFORCE_USERNAME'),
    "PASSWORD": os.getenv('SALESFORCE_PASSWORD'),
    "HOST": os.getenv("SALESFORCE_HOST"),
    "API_VERSION": os.getenv("SALESFORCE_API_VERSION")
}
COMBINED_EMAIL_FIELD = os.getenv('COMBINED_EMAIL_FIELD', 'Consolidated_EMail__c')
FORM_EMAIL_FIELD = os.getenv('FORM_EMAIL_FIELD', 'email')
DEFAULT_CAMPAIGN_ONETIME = os.getenv('DEFAULT_CAMPAIGN_ONETIME')
DEFAULT_CAMPAIGN_RECURRING = os.getenv('DEFAULT_CAMPAIGN_RECURRING')
MINNPOST_ROOT = os.getenv('MINNPOST_ROOT')
MINNROAST_CAMPAIGN_ID = os.getenv('MINNROAST_CAMPAIGN_ID')
ANNIVERSARY_PARTY_CAMPAIGN_ID = os.getenv('ANNIVERSARY_PARTY_CAMPAIGN_ID')
MINNROAST_OPPORTUNITY_SUBTYPE = os.getenv('MINNROAST_OPPORTUNITY_SUBTYPE')
ANNIVERSARY_PARTY_OPPORTUNITY_SUBTYPE = os.getenv('ANNIVERSARY_PARTY_OPPORTUNITY_SUBTYPE')
EVENT_1_USE_PROMO_CODE = os.getenv('EVENT_1_USE_PROMO_CODE')
EVENT_1_SINGLE_UNIT_PRICE = os.getenv('EVENT_1_SINGLE_UNIT_PRICE')
EVENT_1_SINGLE_UNIT_FAIR_MARKET_VALUE = os.getenv('EVENT_1_SINGLE_UNIT_FAIR_MARKET_VALUE')
EVENT_1_DISCOUNT_SINGLE_UNIT_PRICE = os.getenv('EVENT_1_DISCOUNT_SINGLE_UNIT_PRICE')
EVENT_1_PROMO_CODE = os.getenv('EVENT_1_PROMO_CODE')
EVENT_1_CAMPAIGN_ID = os.getenv('EVENT_1_CAMPAIGN_ID')
EVENT_2_USE_PROMO_CODE = os.getenv('EVENT_2_USE_PROMO_CODE')
EVENT_2_SINGLE_UNIT_PRICE = os.getenv('EVENT_2_SINGLE_UNIT_PRICE')
EVENT_2_SINGLE_UNIT_FAIR_MARKET_VALUE = os.getenv('EVENT_2_SINGLE_UNIT_FAIR_MARKET_VALUE')
EVENT_2_DISCOUNT_SINGLE_UNIT_PRICE = os.getenv('EVENT_2_DISCOUNT_SINGLE_UNIT_PRICE')
EVENT_2_PROMO_CODE = os.getenv('EVENT_2_PROMO_CODE')
EVENT_2_CAMPAIGN_ID = os.getenv('EVENT_2_CAMPAIGN_ID')
ADVERTISING_CAMPAIGN_ID = os.getenv('ADVERTISING_CAMPAIGN_ID')
SALESFORCE_CONTACT_ADVERTISING_EMAIL = os.getenv('SALESFORCE_CONTACT_ADVERTISING_EMAIL')
TOP_SWAG_MINIMUM_LEVEL = os.getenv('TOP_SWAG_MINIMUM_LEVEL')
SEPARATE_SWAG_MINIMUM_LEVEL = os.getenv('SEPARATE_SWAG_MINIMUM_LEVEL')
MAIN_SWAG_MINIMUM_LEVEL = os.getenv('MAIN_SWAG_MINIMUM_LEVEL')
MAXIMUM_CHOOSE_MULTIPLE_LEVEL_INT = {
    '1': os.getenv('MAXIMUM_CHOOSE_MULTIPLE_LEVEL_1_INT', 1),
    '2': os.getenv('MAXIMUM_CHOOSE_MULTIPLE_LEVEL_2_INT', 3),
    '3': os.getenv('MAXIMUM_CHOOSE_MULTIPLE_LEVEL_3_INT', 4),
    '4': os.getenv('MAXIMUM_CHOOSE_MULTIPLE_LEVEL_4_INT', 5)
}

SHOW_UPSELL = os.getenv('SHOW_UPSELL')
ALLOW_DONATION_NOTIFICATION = os.getenv('ALLOW_DONATION_NOTIFICATION')

REPORT_RUN_FREQUENCY = os.getenv('REPORT_RUN_FREQUENCY')
REPORT_INSTANCE_FALLBACK = os.getenv('REPORT_INSTANCE_FALLBACK')

########
# Stripe
#
STRIPE_KEYS = {
    'secret_key': os.getenv('SECRET_KEY'),
    'publishable_key': os.getenv('PUBLISHABLE_KEY')
}

########
# Plaid (for ACH)
#

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_PUBLIC_KEY = os.getenv('PLAID_PUBLIC_KEY')
PLAID_ENVIRONMENT = os.getenv('PLAID_ENVIRONMENT')

PROJECT_HONEYPOT_KEY = os.getenv('PROJECT_HONEYPOT_KEY')

############
# Postgres
#
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = False

########
# Recaptcha
#
USE_RECAPTCHA = os.getenv('USE_RECAPTCHA', False)
RECAPTCHA_KEYS = {
    "secret_key": os.getenv("RECAPTCHA_SECRET_KEY"),
    "site_key": os.getenv("RECAPTCHA_SITE_KEY"),
}

#######
# Slack
#
ENABLE_SLACK = bool_env('ENABLE_SLACK')
SLACK_CHANNEL = os.getenv('SLACK_CHANNEL', '#stripe')
SLACK_API_KEY = os.getenv('SLACK_API_KEY')

########
# Sentry
#
#ENABLE_SENTRY = bool_env('ENABLE_SENTRY')
#SENTRY_DSN = os.getenv('SENTRY_DSN')
