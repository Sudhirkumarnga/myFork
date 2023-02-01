import { API } from "./"

export const createPayment = payload => {
  return API.post(`api/v1/payment/create_payment_method/`, payload)
}
export const makePayment = payload => {
  return API.post(`api/v1/payment/process/`, payload)
}

export const getPlans = () => {
  return API.get("api/v1/subscription-plans/")
}
