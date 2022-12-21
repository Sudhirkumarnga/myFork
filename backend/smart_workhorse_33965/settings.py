# sourcery skip: de-morgan, remove-redundant-if, split-or-ifs, use-contextlib-suppress, use-named-expression
"""
Django settings for smart_workhorse_33965 project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""
import os
import environ
import logging
from modules.manifest import get_modules
from pathlib import Path
import firebase_admin
from firebase_admin.credentials import Certificate
import json

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
APPS_DIR = ROOT_DIR / "backend"

env_file = os.path.join(BASE_DIR, ".env")
env = environ.Env()
env.read_env(env_file)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=True)

# try:
#     # Pull secrets from Secret Manager
#     _, project = google.auth.default()
#     client = secretmanager.SecretManagerServiceClient()
#     settings_name = os.environ.get("SETTINGS_NAME", "django_settings")
#     name = client.secret_version_path(project, settings_name, "latest")
#     payload = client.access_secret_version(name=name).payload.data.decode("UTF-8")
#     env.read_env(io.StringIO(payload))
# except (DefaultCredentialsError, PermissionDenied):
#     pass


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY", 'test')

ALLOWED_HOSTS = ["*","127.0.0.1", "localhost"]#env.list("HOST", default=["*","127.0.0.1", "localhost"])
SITE_ID = 1

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_REDIRECT", default=False)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites'
]
LOCAL_APPS = [
    'home',
    'users.apps.UsersConfig',
    "workside",
    "reports",
    'business',
    'subscriptions',
    'push_notification'
]
THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'rest_auth.registration',
    'bootstrap4',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django_extensions',
    'drf_yasg',
    'storages',
    'django_filters',
    'corsheaders',
    'cities_light',
    'tinymce',
    'django_celery_beat',
    'django_celery_results',
    'djstripe',
    'fcm_django'
]

MODULES_APPS = get_modules()

INSTALLED_APPS += LOCAL_APPS + THIRD_PARTY_APPS + MODULES_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'smart_workhorse_33965.urls'

CORS_ORIGIN_WHITELIST = ['https://smart-workhorse-33965.botics.co','http://localhost', 'http://127.0.0.1']
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'web_build')],
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

WSGI_APPLICATION = 'smart_workhorse_33965.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

if env.str("DATABASE_URL", default=None):
    DATABASES = {
        'default': env.db()
    }


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware']

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend'
)

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), os.path.join(BASE_DIR, 'web_build/static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# allauth / users
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_UNIQUE_EMAIL = True
LOGIN_REDIRECT_URL = "users:redirect"

ACCOUNT_ADAPTER = "users.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "users.adapters.SocialAccountAdapter"
ACCOUNT_ALLOW_REGISTRATION = env.bool("ACCOUNT_ALLOW_REGISTRATION", True)
SOCIALACCOUNT_ALLOW_REGISTRATION = env.bool("SOCIALACCOUNT_ALLOW_REGISTRATION", True)

REST_AUTH_SERIALIZERS = {
    # Replace password reset serializer to fix 500 error
    "PASSWORD_RESET_SERIALIZER": "home.api.v1.serializers.PasswordSerializer",
}
REST_AUTH_REGISTER_SERIALIZERS = {
    # Use custom serializer that has no username and matches web signup
    "REGISTER_SERIALIZER": "home.api.v1.serializers.SignupSerializer",
}

# Custom user model
AUTH_USER_MODEL = "users.User"

DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL","")
EMAIL_HOST = env.str("EMAIL_HOST", "")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env.str("SENDGRID_KEY", "")
EMAIL_PORT = 587
EMAIL_USE_TLS = True


# AWS S3 config
AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY", "")
AWS_STORAGE_BUCKET_NAME = env.str("AWS_STORAGE_BUCKET_NAME", "")
AWS_STORAGE_REGION = env.str("AWS_STORAGE_REGION", "")

USE_S3 = (
    AWS_ACCESS_KEY_ID and
    AWS_SECRET_ACCESS_KEY and
    AWS_STORAGE_BUCKET_NAME and
    AWS_STORAGE_REGION
)

if USE_S3:
    AWS_S3_CUSTOM_DOMAIN = env.str("AWS_S3_CUSTOM_DOMAIN", "")
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    AWS_DEFAULT_ACL = env.str("AWS_DEFAULT_ACL", "public-read")
    AWS_MEDIA_LOCATION = env.str("AWS_MEDIA_LOCATION", "media")
    AWS_AUTO_CREATE_BUCKET = env.bool("AWS_AUTO_CREATE_BUCKET", True)
    DEFAULT_FILE_STORAGE = env.str(
        "DEFAULT_FILE_STORAGE", "home.storage_backends.MediaStorage"
    )
    MEDIA_URL = '/mediafiles/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Swagger settings for api docs
SWAGGER_SETTINGS = {
    "DEFAULT_INFO": f"{ROOT_URLCONF}.api_info",
}

if DEBUG or not (EMAIL_HOST_USER and EMAIL_HOST_PASSWORD):
    # output email to console instead of sending
    if not DEBUG:
        logging.warning("You should setup `SENDGRID_USERNAME` and `SENDGRID_PASSWORD` env vars to send emails.")
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


# GCP config
GS_BUCKET_NAME = env.str("GS_BUCKET_NAME", "")
if GS_BUCKET_NAME:
    DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    GS_DEFAULT_ACL = "publicRead"


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        #'users.authentication.ExpiringTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        #'rest_framework.authentication.SessionAuthentication'
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAdminUser',
    ),
    'DATETIME_FORMAT': "%Y-%m-%d %H:%M:%S",
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True

AWS_QUERYSTRING_AUTH = False

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    },
    'facebook': {
        'SCOPE': [
            'email',
            'public_profile'
        ],
        'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
    }
}
CITIES_LIGHT_APP_NAME = "business"


DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

CELERY_RESULT_BACKEND = "django-db"
BROKER_URL = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
TIME_INPUT_FORMATS = ('%I:%M %p',)

STRIPE_TEST_PUBLIC_KEY ='pk_test_51JDWfKLVgVGgnNunjyDVTn1130UQqbfHWZcdlphQIVRd41r1emuzvUBjgZMviWJsqpwGNyUQxj6V2FGimiwWLtX200LqYNJmuf' # add here
STRIPE_TEST_SECRET_KEY ='sk_test_51JDWfKLVgVGgnNund39HhzNCPDef1TcR3ZnjbYcz6rhvz6mmDT1qXPSp7WuETKREmaA37YpUTR9Agar7vXHYOR4c00q27I500E' # add here
STRIPE_LIVE_SECRET_KEY = 'asdasdasdasd'
STRIPE_LIVE_MODE = False  # Change to True in production# Add these two lines even if you are not using webhooks
DJSTRIPE_WEBHOOK_SECRET = "whsec_48e8a215af1fa02eda2299b82a9978a8438a11415b604a8b387f84a68475a8e9"
DJSTRIPE_FOREIGN_KEY_TO_FIELD = "id"




# FCM_DJANGO_SETTINGS = {
#     # default: _('FCM Django')
#     "APP_VERBOSE_NAME": "Smart Work Horse",
#     # Your firebase API KEY
#     "FCM_SERVER_KEY": env.str("FCM_SERVER_KEY", "FCM_SERVER_KEY"),
#     # true if you want to have only one active device per registered user at a time
#     # default: False
#     "ONE_DEVICE_PER_USER": False,
#     # devices to which notifications cannot be sent,
#     # are deleted upon receiving error response from FCM
#     # default: False
#     "DELETE_INACTIVE_DEVICES": False,
# }


FCM_DJANGO_SETTINGS = {"FCM_SERVER_KEY": env("FCM_SERVER_KEY", default=None)}

credentials = json.loads(
    env.str("FIREBASE_CREDENTAILS", default="")
)


firebase_admin.initialize_app(Certificate(credentials))


FCM_DJANGO_SETTINGS = {
    "APP_VERBOSE_NAME": "Smart Work Horse",
    "ONE_DEVICE_PER_USER": False,
    "DELETE_INACTIVE_DEVICES": False,
}


OLD_PASSWORD_FIELD_ENABLED = True
