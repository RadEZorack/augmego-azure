import uuid
import json

from decimal import Decimal
from django.contrib.auth import login
from django.conf import settings
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect
from django.db.models import Sum, Value, Max
from django.db.models.functions import Coalesce
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.contrib.auth import get_user_model, authenticate, login
from django.views.decorators.csrf import csrf_exempt

from allauth.account.models import EmailAddress
from allauth.account.utils import send_email_confirmation

from person.models import Person, FamilyConnection, Family
from texture.models import TextureAtlas
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

def people_list(request):
    people = list(Person.objects.exclude(user_id=request.user.id).filter(user__is_superuser=False, is_guest=False).values_list("user__username", flat=True))
    data = json.dumps({
        'people': people
    })
    return HttpResponse(data, content_type='application/json')

def family_list(request):
    data = {}
    # fetch my current families
    my_fcs = FamilyConnection.objects.filter(person_id=request.user.id)
    for fc in my_fcs:
        key = fc.family.name
        data[key] = {
            "is_active": fc.is_active,
            "people": []
        }
                 
    fcids = list(my_fcs.values_list("family_id", flat=True))
    # Get all connections of my families
    fcs = FamilyConnection.objects.filter(family_id__in=fcids)
    
    for fc in fcs:
        key = fc.family.name
        data[key]["people"].append(str(fc.person))
    
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')

def create_family(request):
    if not request.POST:
        return HttpResponseForbidden("You must post data.")
    
    name = request.POST.get("name")
    if not name:
        return HttpResponseForbidden("You must provide a name.")
    
    if Family.objects.filter(name=name).exists():
        return HttpResponseForbidden("A family already has this name.")
    
    password = request.POST.get("password", "")

    family = Family.objects.create(name=name, password=password)

    texture_atlas = TextureAtlas.objects.create(family=family)
    texture_atlas.update_atlas()
    texture_atlas.save()

    fcs = FamilyConnection.objects.filter(person_id=request.user.id)
    for fc in fcs:
        fc.is_active = False
        fc.save()

    fc = FamilyConnection.objects.create(person_id=request.user.id, family_id=family.id, is_owner=True)

    return HttpResponse("success")

def join_family(request):
    if not request.POST:
        return HttpResponseForbidden("You must post data.")
    
    name = request.POST.get("name")
    if not name:
        return HttpResponseForbidden("You must provide a name.")
    
    if not Family.objects.filter(name=name).exists():
        return HttpResponseForbidden("A family does not have this name.")
    
    password = request.POST.get("password", "")

    families = Family.objects.filter(name=name, password=password)
    if not families:
        return HttpResponseForbidden("Wrong password.")
    
    family = families.first()

    fc = FamilyConnection.objects.create(person_id=request.user.id, family_id=family.id)

    return HttpResponse("success")

def add_person(request):
    if not request.POST:
        return HttpResponseForbidden("You must post data.")
    
    family_name = request.POST.get("familyName")
    if not family_name:
        return HttpResponseForbidden("You must provide a family name.")
    
    person_name = request.POST.get("personName")
    if not person_name:
        return HttpResponseForbidden("You must provide a user's name.")
    
    if not Family.objects.filter(name=family_name).exists():
        return HttpResponseForbidden("No family has this name.")
    
    if not Person.objects.filter(user__username=person_name).exists():
        return HttpResponseForbidden("No user has this name.")

    family = Family.objects.get(name=family_name)
    person = Person.objects.get(user__username=person_name)

    fc = FamilyConnection.objects.create(person=person, family=family)

    return HttpResponse("success")

def set_active_family(request):
    if not request.POST:
        return HttpResponseForbidden("You must post data.")
    
    family_name = request.POST.get("familyName")
    if not family_name:
        return HttpResponseForbidden("You must provide a family name.")
    
    if not Family.objects.filter(name=family_name).exists():
        return HttpResponseForbidden("No family has this name.")

    family = Family.objects.get(name=family_name)
    person = Person.objects.get(user=request.user)

    FamilyConnection.objects.filter(person=person).update(is_active=False)

    fc = FamilyConnection.objects.get(person=person, family=family)
    fc.is_active = True
    fc.save()

    return HttpResponse("success")