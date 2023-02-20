from django.apps import AppConfig


class SubscriptionsConfig(AppConfig):
    name = 'subscriptions'

    def ready(self):
        try:
            import subscriptions.signals
        except ImportError:
            pass

