import { API } from './'

export const createRV = payload => {
  return API.post(`api/v1/rv/`, payload)
}

export const getQuote = payload => {
  return API.post(`api/v1/bookings/quote/`, payload)
}

export const makeBooking = payload => {
  return API.post(`api/v1/bookings/`, payload)
}

export const makePayment = payload => {
  return API.post(`api/v1/payments/process/`, payload)
}

export const getListRVS = () => {
  return API.get(`api/v1/rv/`)
}

export const getRVDetail = id => {
  return API.get(`api/v1/rv/${id}/`)
}
