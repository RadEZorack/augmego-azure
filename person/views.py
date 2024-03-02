import uuid

from decimal import Decimal
from django.contrib.auth import login
from django.conf import settings
from django.shortcuts import render, redirect
from django.db.models import Sum, Value, Max
from django.db.models.functions import Coalesce
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.contrib.auth import get_user_model

from person.models import Person
from person.forms import NoSignUpForm

from game.views import main

User = get_user_model()

# Create your views here.
@xframe_options_sameorigin
def profile_wall(request):
    people = Person.objects.filter(user__is_superuser=False).annotate(total_payments=Coalesce(Sum("payment__amount"), Value(Decimal(0.00)))).annotate(most_recent_payment_date=Max('payment__created_at')).order_by("-total_payments")

    return render(request, "_profile_wall.html", {"people": people})

def nosignup(request):
    if True: #request.POST:
        # form = NoSignUpForm(request.POST)
        if True: #form.is_valid():
            # code = form.cleaned_data.get('code')
            code = str(uuid.uuid4())
            try:
                person = Person.objects.get(
                    code=code
                )
            except Person.DoesNotExist:
                user = User.objects.create_user(str(code), str(uuid.uuid4())+'@example.com', str(uuid.uuid4()))
                person = user.person
                person.code = code
                person.save()

            # Log the user in
            user = person.user
            user.backend = settings.AUTHENTICATION_BACKENDS[0]
            login(request, person.user)  # Update request.user to the new user

            return redirect(main)
    
    # form = NoSignUpForm()

    # return render(request, 'account/nosignup.html', {'form': form})