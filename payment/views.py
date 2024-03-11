
import uuid
from django.urls import reverse
from django.shortcuts import render
from paypal.standard.forms import PayPalPaymentsForm

from quickstartproject import settings

def process_payment(request):

    # What you want the button to do.
    paypal_dict = {
        "business": settings.PAYPAL_BUSINESS,
        "amount": "10.00",
        "item_name": "Amica",
        "invoice": str(uuid.uuid4()),
        "notify_url": request.build_absolute_uri(reverse('paypal-ipn')),
        "return": request.build_absolute_uri(reverse('process_payment')),
        "cancel_return": request.build_absolute_uri(reverse('process_payment')),
        "custom": "Amica:10.00:"+str(request.user.id),  # Custom command to correlate to some function later (optional)
    }

    # Create the instance.
    form = PayPalPaymentsForm(initial=paypal_dict)
    context = {"form": form}
    return render(request, "payment/payment.html", context)