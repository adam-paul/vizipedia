# prod.py
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['www.vizipedia.ca']

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'