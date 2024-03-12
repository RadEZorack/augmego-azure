from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from paypal.standard.models import ST_PP_COMPLETED

from quickstartproject import settings
from person.models import Person

def show_me_the_money(sender, **kwargs):
    ipn_obj = sender
    if ipn_obj.payment_status == ST_PP_COMPLETED:
        # WARNING !
        # Check that the receiver email is the same we previously
        # set on the `business` field. (The user could tamper with
        # that fields on the payment form before it goes to PayPal)
        if ipn_obj.receiver_email != settings.PAYPAL_BUSINESS:
            # Not a valid payment
            return

        # ALSO: for the same reason, you need to check the amount
        # received, `custom` etc. are all what you expect or what
        # is allowed.

        # Undertake some action depending upon `ipn_obj`.
        custom = ipn_obj.custom.split(":")
        if custom[0] == "Amica":
            price = Decimal(custom[1])
        else:
            return

        if ipn_obj.mc_gross == price and ipn_obj.mc_currency == 'USD':
            try:
                person = Person.objects.get(user=custom[2])
                # Process payment, e.g., activate subscription, etc.
            except Person.DoesNotExist:
                # Handle error: user not found
                return
            except Exception as e:
                # Handle general error
                return
            person.amica += price
            person.save()
            return
    return

