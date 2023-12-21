from django.db import models

# Create your models here.
class Payment(models.Model):
    person = models.ForeignKey("person.Person", on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=9, decimal_places=2, help_text="The amount in USD.")
    created_at = models.DateTimeField(auto_now_add=True)