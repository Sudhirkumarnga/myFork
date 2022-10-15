from enum import Enum


class TaskFeedback(Enum):
    SATISFACTORY = "SATISFACTORY"
    NEEDS_ATTENTION = "NEEDS_ATTENTION"
    UNSATISFACTORY = "UNSATISFACTORY"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)
