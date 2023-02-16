from django.apps import AppConfig


class BusinessConfig(AppConfig):
    name = 'business'

    def ready(self):
        try:
            import business.signals
        except ImportError:
            pass