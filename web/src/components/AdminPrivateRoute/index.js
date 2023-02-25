import React from "react"
import { Navigate } from "react-router-dom"

const AdminPrivateRoute = ({ isLoading, children }) => {
  let token = localStorage.getItem("token")
  const isProtected = token
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!isProtected) return <Navigate to="/admin-login" replace />

  return children
}

export default AdminPrivateRoute
