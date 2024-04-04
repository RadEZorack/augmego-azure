from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLogin(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(default=None, null=True)

    def __str__(self) -> str:
        return str(self.user)
    
    def total_time(self):
        try:
            return self.session_end - self.session_start
        except:
            return None