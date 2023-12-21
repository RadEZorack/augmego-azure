from decimal import Decimal
from django.shortcuts import render
from django.db.models import Sum, Value, Max
from django.db.models.functions import Coalesce
from django.views.decorators.clickjacking import xframe_options_sameorigin

from person.models import Person

# Create your views here.
@xframe_options_sameorigin
def profile_wall(request):
    people = Person.objects.filter(user__is_superuser=False).annotate(total_payments=Coalesce(Sum("payment__amount"), Value(Decimal(0.00)))).annotate(most_recent_payment_date=Max('payment__created_at')).order_by("-total_payments")

    return render(request, "_profile_wall.html", {"people": people})