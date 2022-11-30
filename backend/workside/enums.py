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
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class EventStatus(Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class EventPublishingReminder(Enum):
    ONE_DAY = "ONE_DAY"
    TWO_DAYS = "TWO_DAYS"
    ONE_WEEK = "ONE_WEEK"
    TWO_WEEKS = "TWO_WEEKS"
    ONE_MONTH = "ONE_MONTH"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)
