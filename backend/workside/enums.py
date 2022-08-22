

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
    EVERY_TIME = "EVERY_TIME"
    WEEKLY = "WEEKLY"
    SEMI_WEEKLY = "SEMI_WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    SEMI_ANNUALLY = "SEMI_ANNUALLY"
    CUSTOM = "CUSTOM"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class EventFrequency(Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    ONE_TIME = "ONE_TIME"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

class EventStatus(Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)