import React from 'react'
import { Navigate, Route } from 'react-router-dom'

const PrivateRoute = ({ isAuthenticated, isLoading, children }) => {
  let token = localStorage.getItem('token')
  const isProtected = token
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!isProtected) return <Navigate to='/' replace />

  return children
}

export default PrivateRoute
