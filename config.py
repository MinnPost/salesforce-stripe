import os

from celery.schedules import crontab

# from datetime import timedelta


def bool_env(val):
    """Replaces string based environment values with Python booleans"""
    return True if os.environ.get(val, False) == "True" else False


TIMEZONE = os.getenv("TIMEZONE", "US/Central")

########
# Amazon
#
MWS_ACCESS_KEY = os.getenv("MWS_ACCESS_KEY", "")
MWS_SECRET_KEY = os.getenv("MWS_SECRET_KEY", "")
AMAZON_MERCHANT_ID = os.getenv("AMAZON_MERCHANT_ID", "")
AMAZON_SANDBOX = bool_env("AMAZON_SANDBOX")
AMAZON_CAMPAIGN_ID = os.getenv("AMAZON_CAMPAIGN_ID", "")


########
# Celery
#

# default is 4am and 4pm:
BATCH_HOURS = os.getenv("BATCH_HOURS", "4, 16")
CELERY_TIMEZONE = TIMEZONE
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND")
CELERY_ALWAYS_EAGER = bool_env("CELERY_ALWAYS_EAGER")
# deprecated:
CELERYBEAT_SCHEDULE = {
    "every-day": {
        "task": "batch.charge_cards",
        "schedule": crontab(minute="0", hour=BATCH_HOURS),
    }
}
REDIS_URL = os.getenv("REDIS_URL")


#######
# Flask
#
FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", 0)
WTF_CSRF_ENABLED = False
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


########
# Plaid (for ACH)
#

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_PUBLIC_KEY = os.getenv('PLAID_PUBLIC_KEY')
PLAID_ENVIRONMENT = os.getenv('PLAID_ENVIRONMENT')


#######
# Portal
#
ENABLE_PORTAL = bool_env("ENABLE_PORTAL")


########
# Salesforce
#
ADVERTISING_CAMPAIGN_ID = os.getenv('ADVERTISING_CAMPAIGN_ID')
ANNIVERSARY_PARTY_CAMPAIGN_ID = os.getenv('ANNIVERSARY_PARTY_CAMPAIGN_ID')
COMBINED_EMAIL_FIELD = os.getenv('COMBINED_EMAIL_FIELD', 'Consolidated_EMail__c')
DEFAULT_CAMPAIGN_ONETIME = os.getenv('DEFAULT_CAMPAIGN_ONETIME')
DEFAULT_CAMPAIGN_RECURRING = os.getenv('DEFAULT_CAMPAIGN_RECURRING')
MINNROAST_CAMPAIGN_ID = os.getenv('MINNROAST_CAMPAIGN_ID')
SALESFORCE_CONTACT_ADVERTISING_EMAIL = os.getenv('SALESFORCE_CONTACT_ADVERTISING_EMAIL')


########
# Sentry
#
ENABLE_SENTRY = bool_env("ENABLE_SENTRY")
SENTRY_DSN = os.getenv("SENTRY_DSN")
SENTRY_ENVIRONMENT = os.getenv("SENTRY_ENVIRONMENT", "unknown")
REPORT_URI = os.getenv("REPORT_URI")


#######
# Slack
#
ENABLE_SLACK = bool_env("ENABLE_SLACK")
SLACK_CHANNEL = os.getenv("SLACK_CHANNEL", "#stripe")
SLACK_API_KEY = os.getenv("SLACK_API_KEY")


######
# SMTP
#
MAIL_SERVER = os.getenv("MAIL_SERVER", "localhost")
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "user")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "pass")
MAIL_PORT = os.getenv("MAIL_PORT", "2525")
MAIL_USE_TLS = bool_env("MAIL_USE_TLS")
DEFAULT_MAIL_SENDER = os.getenv("DEFAULT_MAIL_SENDER", "me@myplace.org")
MULTIPLE_ACCOUNT_WARNING_MAIL_RECIPIENT = os.getenv(
    "MULTIPLE_ACCOUNT_WARNING_MAIL_RECIPIENT", ""
)
ACCOUNTING_MAIL_RECIPIENT = os.getenv("ACCOUNTING_MAIL_RECIPIENT", "")
BUSINESS_MEMBER_RECIPIENT = os.getenv("BUSINESS_MEMBER_RECIPIENT", "")


########
# Stripe
#
STRIPE_KEYS = {
    "secret_key": os.getenv("SECRET_KEY"),
    "publishable_key": os.getenv("PUBLISHABLE_KEY"),
}
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")


#######
# Tasks
#


########
# User Interface options
#
DEFAULT_FREQUENCY = os.getenv('DEFAULT_FREQUENCY', 'one-time')
FORM_EMAIL_FIELD = os.getenv('FORM_EMAIL_FIELD', 'email')
MINNPOST_ROOT = os.getenv('MINNPOST_ROOT')
SHOW_ACH = os.getenv('SHOW_ACH', False)

