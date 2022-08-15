from enum import Enum

class SubscriptionPeriod(Enum):
    MONTHLY = "MONTHLY"
    YEARLY= "YEARLY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

