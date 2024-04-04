# middleware.py
from django.utils.deprecation import MiddlewareMixin
import datetime

# This variable will store the server start time
server_start_time = datetime.datetime.now()

class ServerStartTimeMiddleware(MiddlewareMixin):
    """Should we use from django.utils import timezone.now() ?
    """
    def __init__(self, get_response):
        super().__init__(get_response)
        # When the middleware is loaded, the server is considered started
        global server_start_time
        server_start_time = datetime.datetime.now()
