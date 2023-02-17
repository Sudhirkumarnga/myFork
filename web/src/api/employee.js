import { API } from './'

export const createMenu = (body, token) => {
  return API.post(`api/v1/items/`, body, token)
}

export const getUpcomingShift = token => {
  return API.get(`api/v1/upcoming_shift/`, token)
}

export const getAllWorksitesEmp = token => {
  return API.get(`api/v1/worksites/`, token)
}

export const getUpcomingShiftTimes = (payload, token) => {
  return API.get(`api/v1/event_shift_times/${payload}`, token)
}

export const updateUpcomingShiftTimes = (payload, token) => {
  return API.put(`api/v1/event_shift_times/`, payload, token)
}

export const leaveRequest = (payload, token) => {
  return API.post(`api/v1/leave_request/`, payload, token)
}

export const newAttendance = (payload, token) => {
  return API.post(`api/v1/attendance/`, payload, token)
}

export const createAttendance = (payload, token) => {
  return API.put(`api/v1/attendance/`, payload, token)
}
