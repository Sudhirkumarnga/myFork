from enum import Enum


class BusinessPayFrequency(Enum):
    WEEKLY = "WEEKLY"
    EVERY_TWO_WEEK = "EVERY_TWO_WEEK"
    EVERY_FIRST_AND_FIFTEENTH = "EVERY_FIRST_AND_FIFTEENTH"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class Gender(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    GENDERLESS = "GENDERLESS"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class AttendanceStatus(Enum):
    CLOCK_IN = "CLOCK_IN"
    CLOCK_OUT = "CLOCK_OUT"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class RequestType(Enum):
    PAID = "PAID"
    UNPAID = "UNPAID"
    SICK = "SICK"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class RequestStatus(Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DENY = "DENY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)
