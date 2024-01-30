from django.db import models

class UserLogin(models.Model):
    hashed_ip = models.CharField(max_length=64)  # Length of a SHA-256 hash in hexadecimal
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.hashed_ip[0:6]
    
    def total_time(self):
        return self.session_end - self.session_start