from django.apps import AppConfig
from django.conf import settings

class HangmanConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hangman'
    nouns = []

    def ready(self):
        if settings.LOAD_NOUNS_ON_STARTUP:
            from .utils import loadWordList
            nouns = loadWordList()
            self.nouns = nouns