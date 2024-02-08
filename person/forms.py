import uuid

from django import forms

class NoSignUpForm(forms.Form):
    code = forms.UUIDField(initial=uuid.uuid4)