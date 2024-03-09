from django.apps import AppConfig
from paypal.standard.ipn.signals import valid_ipn_received

class PaymentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payment'

    def ready(self) -> None:
        from payment.hooks import show_me_the_money
        valid_ipn_received.connect(show_me_the_money)
