from .settings import *
import os
import socket
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

# Configure the domain name using the environment variable
# that Azure automatically creates for us.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'augmego.com www.augmego.com').split()
ALLOWED_HOSTS += [os.environ['WEBSITE_HOSTNAME']] if 'WEBSITE_HOSTNAME' in os.environ else []
ALLOWED_HOSTS += [ip_address,]
# WhiteNoise configuration
MIDDLEWARE = [                                                                   
    'django.middleware.security.SecurityMiddleware',
# Add whitenoise middleware after the security middleware                             
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',                      
    'django.middleware.common.CommonMiddleware',                                 
    'django.middleware.csrf.CsrfViewMiddleware',                                 
    'django.contrib.auth.middleware.AuthenticationMiddleware',                   
    'django.contrib.messages.middleware.MessageMiddleware',                      
    'django.middleware.clickjacking.XFrameOptionsMiddleware',                    
]

# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEBUG = True
