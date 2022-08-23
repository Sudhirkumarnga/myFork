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

export const getAllWorksites = token => {
  return API.get(`api/v1/worksite/`, token)
}

export const createWorksite = (payload, token) => {
  return API.post(`api/v1/worksite/`, payload, token)
}

export const createTask = (payload, token) => {
  return API.post(`api/v1/task/`, payload, token)
}
