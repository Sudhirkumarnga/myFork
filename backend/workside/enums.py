

from enum import Enum

class Weekday(Enum):
    MONDAY = "MONDAY"
    TUESDAY = "TUESDAY"
    WEDNESDAY = "WEDNESDAY"
    THURSDAY = "THURSDAY"
    FRIDAY = "FRIDAY"
    SATURDAY = "SATURDAY"
    SUNDAY = "SUNDAY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class Priority(Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class Frequency(Enum):
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    DAILY = "DAILY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)