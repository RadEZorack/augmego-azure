import paypalrestsdk
from django.conf import settings
from django.http import JsonResponse

def process_payment(request):
    paypalrestsdk.configure({
        "mode": settings.PAYPAL_MODE,  # sandbox or live
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    })

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal",
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/payment/execute",
            "cancel_url": "http://localhost:8000/payment/cancel",
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1,
                }]
            },
            "amount": {
                "total": "5.00",
                "currency": "USD",
            },
            "description": "This is the payment transaction description.",
        }]
    })

    if payment.create():
        print("Payment created successfully")
        for link in payment.links:
            if link.rel == "approval_url":
                # Capture the url to which the user must be redirected to complete the payment
                approval_url = str(link.href)
                print("Redirect for approval: %s" % (approval_url))
                return JsonResponse({"approval_url": approval_url})
    else:
        print(payment.error)
        return JsonResponse({"error": "Payment creation failed"})

    return JsonResponse({"error": "Unknown error occurred"})
