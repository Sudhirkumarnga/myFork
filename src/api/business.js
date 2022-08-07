import { API } from './'

export const createMenu = (body, token) => {
  return API.post(`api/v1/items/`, body, token)
}