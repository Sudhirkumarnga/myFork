import { API } from "./"

export const getAdminUsers = payload => {
  return API.get(`api/v1/admin/users/${payload}`)
}

export const getFeedbacks = () => {
  return API.get(`api/v1/admin/feedbacks/`)
}

export const replyFeedback = (id, payload) => {
  return API.put(`api/v1/admin/feedbacks/${id}/`, payload)
}

export const getSubscriptions = () => {
  return API.get(`api/v1/admin/plans/`)
}

export const createSubscription = payload => {
  return API.post(`api/v1/admin/plans/`, payload)
}

export const updateSubscription = (id, payload) => {
  return API.put(`api/v1/admin/plans/${id}/`, payload)
}

export const updateUserProfile = async (payload, user_id, token) => {
  return API.put(`api/v1/admin/users/${user_id}/`, payload, token)
}
