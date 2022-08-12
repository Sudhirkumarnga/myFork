from enum import Enum

from smart_workhorse_33965.typings import TypedResponse


class SmartWorkHorseResponse:
    @staticmethod
    def get_response(
        success: str = False,
        message: str = "",
        status: int = 101,
        response: dict = {},
        error: dict = {},
    ) -> TypedResponse:
        return {
            "success": success,
            "status": status,
            "message": message,
            "response": response,
            "error": error,
        }


class SmartWorkHorseStatus(Enum):
    Success = 1
    Error = 101