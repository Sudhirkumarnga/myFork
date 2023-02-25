import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

export const HOME = "/"
export const DASHBOARD = "/dashboard"
export const PAYROLL = "/payroll"
export const EMPLOYEELIST = "/employee-list"
export const TERMSCONDITIONS = "/terms-conditions"
export const PRIVACYPOLICY = "/privacy-policy"
export const LOGIN = "/login"
export const SUBSCRIPTION = "/subscription"
export const CHECKOUT = "/checkout/:id"
export const FORGOTPASSWORD = "/forgot-password"
export const FORGOTPASSWORDOTP = "/forgot-password/otp"
export const RESET = "/forgot-password/reset"
// Admin
export const ADMINLOGIN = "/admin/login"
export const ADMINUSERS = "/admin/users"
export const FEEDBACK = "/admin/feedback"

export const SIDEBAR = (
  <React.Fragment>
    <ListItemButton>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary="Users" />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary="Zip Codes" />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary="Requests" />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary="Feedback" />
    </ListItemButton>
  </React.Fragment>
)
