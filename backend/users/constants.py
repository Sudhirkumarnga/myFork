users/constants.pyfrom enum import Enum


class UserRole(Enum):
    Organization_Admin = "Organization Admin"
    Employee = "Employee"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)