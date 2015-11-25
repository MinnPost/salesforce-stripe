from salesforce import SalesforceConnection
import stripe
from config import STRIPE_KEYS
import requests
import json
from datetime import datetime, timedelta
import celery
from time import sleep

stripe.api_key = STRIPE_KEYS['secret_key']

# TODO: send alert for failures
# TODO: send report at the end of each run?

@celery.task()
def charge_cards():

    sleep(10)
    three_days_ago = (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d')
    today = datetime.now().strftime('%Y-%m-%d')

    query = """
        SELECT Amount, Name, Stripe_Customer_Id__c
        FROM Opportunity
        WHERE CloseDate <= {}
        AND CloseDate >= {}
        AND StageName = 'Pledged'
        AND Stripe_Customer_Id__c != ''
        """.format(today, three_days_ago)

    print(query)
    sf = SalesforceConnection()

    response = sf.query(query)
    # TODO: check response code

    print ("---- Found {} opportunities available to process:".format(
        len(response)))

    for item in response:
        # print (item)
        try:
            print ("---- Charging ${} to {} ({})".format(item['Amount'],
                item['Stripe_Customer_ID__c'],
                item['Name']))
            charge = stripe.Charge.create(
                    customer=item['Stripe_Customer_ID__c'],
                    amount=int(item['Amount']) * 100,
                    currency='usd',
                    description='Change Me'  # TODO
                    )
        except stripe.error.CardError as e:
            print("The card has been declined: {}".format(e))
            raise Exception('problem')
            # TODO: send alert for failure
        # print ('Charge: {}'.format(charge))
        # TODO: check for success

        # print ("Charge id: {}".format(charge.id))
        update = {
                'Stripe_Card__c': charge.id,
                'StageName': 'Closed Won',
                }
        path = item['attributes']['url']
        url = '{}{}'.format(sf.instance_url, path)
        # print (url)
        resp = requests.patch(url, headers=sf.headers, data=json.dumps(update))
        # TODO: check 'errors' and 'success' too
        # print (resp)
        if resp.status_code == 204:
            print ("ok")
        else:
            raise Exception('problem')

if __name__ == '__main__':
    charge_cards()
