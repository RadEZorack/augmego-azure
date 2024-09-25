"""
Django settings for quickstartproject project.

Generated by 'django-admin startproject' using Django 4.0.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
import sys
from pathlib import Path
import mimetypes
mimetypes.add_type("text/css", ".css", True)

SITE_ID = 1

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY','1234567890')

# SECURITY WARNING: don't run with debug turned on in production!
# Make sure the environment variable DJANGO_DEBUG is set to 'False' in your production environment. Note that environment variables are strings,
# so the comparison is case-sensitive and should exactly match how you check it in your code.
DEBUG = os.environ.get('DJANGO_DEBUG', '') != 'False'

import socket
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS',"augmego.com www.augmego.com 167.99.179.219 127.0.0.1 localhost augmego-django augmego.ngrok.io 369de4cfa06e-7199118840071997290.ngrok-free.app").split(" ")
ALLOWED_HOSTS += [ip_address,]
ALLOWED_HOSTS += [os.environ['WEBSITE_HOSTNAME']] if 'WEBSITE_HOSTNAME' in os.environ else []

CORS_ALLOW_ALL_ORIGINS = True

CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS',"https://augmego.com https://www.augmego.com https://localhost https://augmego-django https://augmego.ngrok.io https://369de4cfa06e-7199118840071997290.ngrok-free.app").split(" ")
CSRF_TRUSTED_ORIGINS += ["http://"+ip_address,"https://"+ip_address]

# Application definition

INSTALLED_APPS = [
    "daphne",
    "whitenoise.runserver_nostatic",
    "corsheaders",
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.sitemaps',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    'paypal.standard.ipn',
    'django_celery_beat',
    'django_celery_results',

    # 'allauth.socialaccount.providers.apple',
    # 'allauth.socialaccount.providers.google',
    # 'allauth.socialaccount.providers.microsoft',

    'quickstartproject',
    'chat',
    'game',
    'payment',
    'person',
    'webpage',
    'cube',
    'texture',
    'monitor',
    'tutorial',

    'channels',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    "allauth.account.middleware.AccountMiddleware",

    'quickstartproject.middleware.ServerStartTimeMiddleware',
]

ROOT_URLCONF = 'quickstartproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'),
                 os.path.join(BASE_DIR, 'my-frontend/out')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

SOCIALACCOUNT_PROVIDERS = {
    # 'google': {
    #     # For each OAuth based provider, either add a ``SocialApp``
    #     # (``socialaccount`` app) containing the required client
    #     # credentials, or list them here:
    #     'APP': {
    #         'client_id': '123',
    #         'secret': '456',
    #         'key': ''
    #     }
    # }
}

WSGI_APPLICATION = 'quickstartproject.wsgi.application'
ASGI_APPLICATION = 'quickstartproject.asgi.application'
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": ["redis://:"+os.environ.get('REDIS_PASSWORD', '')+"@"+os.environ.get('REDIS_HOST', '127.0.0.1')+":"+os.environ.get('REDIS_PORT', "6379")+"/0"],
            "symmetric_encryption_keys": [SECRET_KEY],
        },
    },
}

CACHES = {
    'default': {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://:"+os.environ.get('REDIS_PASSWORD', '')+"@"+os.environ.get('REDIS_HOST', '127.0.0.1')+":6379/1",
    }
}

# Celery Configuration
CELERY_BROKER_URL = "redis://:"+os.environ.get('REDIS_PASSWORD', '')+"@"+os.environ.get('REDIS_HOST', '127.0.0.1')+":6379/2"
CELERY_RESULT_BACKEND = "redis://:"+os.environ.get('REDIS_PASSWORD', '')+"@"+os.environ.get('REDIS_HOST', '127.0.0.1')+":6379/2"

# CELERY_BEAT_SCHEDULE = {
#     'add-every-30-seconds': {
#         'task': 'quickstartproject.tasks.add',
#         'schedule': 30.0, # specifies the interval in seconds
#         'args': (16, 16), # arguments passed to the 'add' task
#     },
# }

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': os.environ.get('DJANGO_DB_ENGINE', 'django.db.backends.postgresql'),
            'NAME': os.environ.get('DJANGO_DB_NAME', 'augmego-postgres'),
            'USER': os.environ.get('DJANGO_DB_USER', 'augmego-postgres'),
            'PASSWORD': os.environ.get('DJANGO_DB_PASS', 'changeme'),
            'HOST': os.environ.get('DJANGO_DB_HOST', 'augmego-postgres'),
            'PORT': os.environ.get('DJANGO_DB_PORT', '5432'),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

# STATICFILES_DIRS = (str(BASE_DIR.joinpath('static')),)
STATICFILES_DIRS = [
    BASE_DIR / "static",
    '/var/www/static/',
    os.path.join(BASE_DIR, 'my-frontend/out'),
]
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') #"/var/www/augmego.com/static/"

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = os.environ.get('MEDIA_URL','')

if os.environ.get('AZURE_CONNECTION_STRING', ''):
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.azure_storage.AzureStorage",
            "OPTIONS": {
                "azure_container": os.environ.get('AZURE_CONTAINER', "localhost"),
                "connection_string": os.environ.get('AZURE_CONNECTION_STRING', ''),
            },
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
    

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication backends
AUTHENTICATION_BACKENDS = [
    # 'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Allauth settings
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_REQUIRED = False
# ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

LOGIN_REDIRECT_URL = "main"
LOGOUT_REDIRECT_URL = ""

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', "test@example.com")
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', "password")

PAYPAL_TEST = os.environ.get('PAYPAL_TEST', '') != 'False'
if PAYPAL_TEST == True:
    PAYPAL_BUSINESS=os.environ.get('PAYPAL_BUSINESS_TEST', '')
else:
    PAYPAL_BUSINESS=os.environ.get('PAYPAL_BUSINESS_LIVE', '')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
