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

export const leaveRequest = (payload, token) => {
  return API.post(`api/v1/leave_request/`, payload, token)
}
