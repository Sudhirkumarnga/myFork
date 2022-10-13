import { API } from './'

export const createMenu = (body, token) => {
  return API.post(`api/v1/items/`, body, token)
}

export const getAllEmployee = token => {
  return API.get(`api/v1/employee/`, token)
}

export const createEmployee = (payload, token) => {
  return API.post(`api/v1/employee/`, payload, token)
}

export const updateEmployee = (id, payload, token) => {
  return API.put(`api/v1/employee/${id}/`, payload, token)
}

export const deleteEmployee = (id, token) => {
  return API.delete(`api/v1/employee/${id}/`, {}, token)
}

export const getAllWorksites = token => {
  return API.get(`api/v1/worksite/`, token)
}

export const createWorksite = (payload, token) => {
  return API.post(`api/v1/worksite/`, payload, token)
}

export const updateWorksite = (id, payload, token) => {
  return API.put(`api/v1/worksite/${id}/`, payload, token)
}

export const createTask = (payload, token) => {
  return API.post(`api/v1/task/`, payload, token)
}

export const deleteWorksite = (id, token) => {
  return API.delete(`api/v1/worksite/${id}/`, {}, token)
}

export const getAllSchedules = (payload, token) => {
  return API.get(`api/v1/schedular/${payload}`, token)
}

export const createEvent = (payload, token) => {
  return API.post(`api/v1/event/`, payload, token)
}

export const getEventDetails = (id, token) => {
  return API.get(`api/v1/event/${id}/`, token)
}

export const updateEvent = (id, payload, token) => {
  return API.put(`api/v1/event/${id}/`, payload, token)
}

export const deleteEvent = (id, token) => {
  return API.delete(`api/v1/event/${id}/`, {}, token)
}

export const getEarnings = token => {
  return API.get(`api/v1/earnings/`, token)
}

export const getleaveRequest = token => {
  return API.get(`api/v1/leave_request/`, token)
}

export const updateLeaveRequest = (id, payload, token) => {
  return API.put(`api/v1/leave_request/${id}/`, payload, token)
}
