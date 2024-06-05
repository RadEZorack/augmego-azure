import uuid
import json

from decimal import Decimal
from django.contrib.auth import login
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.db.models import Sum, Value, Max
from django.db.models.functions import Coalesce
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.contrib.auth import get_user_model, authenticate, login
from django.views.decorators.csrf import csrf_exempt

from allauth.account.models import EmailAddress
from allauth.account.utils import send_email_confirmation

from person.models import Person
from person.forms import NoSignUpForm

from game.views import main

User = get_user_model()

# Create your views here.
@xframe_options_sameorigin
def profile_wall(request):
    people = Person.objects.filter(user__is_superuser=False).annotate(total_payments=Coalesce(Sum("payment__amount"), Value(Decimal(0.00)))).annotate(most_recent_payment_date=Max('payment__created_at')).order_by("-total_payments")

    return render(request, "_profile_wall.html", {"people": people})

@xframe_options_sameorigin
def ready_player_me(request):
    return render(request, "ready_player_me.html")

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
                user = User.objects.create_user("Guest-"+str(code), str(uuid.uuid4())+'@example.com', str(uuid.uuid4()))
                person = user.person
                person.code = code
                person.is_guest = True
                person.save()

            # Log the user in
            user = person.user
            user.backend = settings.AUTHENTICATION_BACKENDS[0]
            login(request, person.user)  # Update request.user to the new user

            return redirect(main)
    
@csrf_exempt
def temp_login_for_mobile(request):
    code = str(uuid.uuid4())
    try:
        person = Person.objects.get(
            code=code
        )
    except Person.DoesNotExist:
        user = User.objects.create_user("Guest-"+str(code), str(uuid.uuid4())+'@example.com', str(uuid.uuid4()))
        person = user.person
        person.code = code
        person.save()

    # Log the user in
    user = person.user
    user.backend = settings.AUTHENTICATION_BACKENDS[0]
    login(request, person.user)  # Update request.user to the new user

    return HttpResponse("success")

def fetch_amica(request):
    data = json.dumps({
        'amica': str(request.user.person.amica)
    })
    return HttpResponse(data, content_type='application/json')

def change_name(request):
    rg = request.GET
    name = rg.get("name")
    
    user = request.user
    user.username = name
    user.save()

    # Re-authenticate the user and log them back in
    login(request, user)

    return HttpResponse(str(user.username), content_type='application/text')

def change_password(request):
    rg = request.GET
    password = rg.get("password")
    
    user = request.user
    user.set_password(password)
    user.save()

    # Re-authenticate the user and log them back in
    user = authenticate(username=user.username, password=password)
    if user is not None:
        login(request, user)

    return HttpResponse("success changing password", content_type='application/text')

def change_email(request):
    rg = request.GET
    email = rg.get("email")
    
    user = request.user
    # Create or update the email address in the EmailAddress model
    email_address, created = EmailAddress.objects.get_or_create(user=user, email=email)
    if not created:
        # Email address already exists, just send the verification email
        send_email_confirmation(request, user, email=email)
    else:
        # Save the new email address and send the verification email
        email_address.email = email
        email_address.verified = False
        email_address.primary = True
        email_address.save()
        send_email_confirmation(request, user, email=email)

    return HttpResponse("success changing email", content_type='application/text')

def update_avatar(request):
    person = request.user.person
    person.avatar = request.GET.get("avatar")
    person.save()
    return HttpResponse("success: updated avatar", content_type='application/json')