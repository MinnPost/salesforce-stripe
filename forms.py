from flask_wtf import Form

from wtforms.fields import StringField, IntegerField, HiddenField, BooleanField
from wtforms import validators

from flask import request

class DonateForm(Form):
    first_name = StringField(u'First',
        [validators.required(message="Your first name is required.")])
    last_name = StringField(u'Last',
        [validators.required(message="Your last name is required.")])
    amount = IntegerField(u'Amount',
        [validators.required(message="Please choose a donation amount.")])
    reason = StringField(u'Encouraged to contribute by')
    installment_period = HiddenField(u'Installment Period')
    installments = HiddenField(u'Installments')
    openended_status = HiddenField(u'Openended Status')
    description = HiddenField(u'Description')
    pay_fees = BooleanField(u'Agree to pay fees')
    pay_fees_value = HiddenField(u'Pay Fees Value')