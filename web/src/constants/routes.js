import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

export const HOME = "/"
export const DASHBOARD = "/dashboard"
export const TERMSCONDITIONS = "/terms-conditions"
export const PRIVACYPOLICY = "/privacy-policy"
export const LOGIN = "/login"
export const SUBSCRIPTION = "/subscription"
export const CHECKOUT = "/checkout/:id"
export const FORGOTPASSWORD = "/forgot-password"
export const FORGOTPASSWORDOTP = "/forgot-password/otp"
export const RESET = "/forgot-password/reset"

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
