import * as React from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

export const HOME = "/"
export const DASHBOARD = "/dashboard"
export const PAYROLL = "/payroll"
export const EMPLOYEELIST = "/employee-list"
export const EMPLOYEEVIEW = "/employees-view/:id"
export const ADDEMPLOYEE = "/employees/add"
export const EDITEMPLOYEE = "/employees/edit/:id"
export const WORKSITELIST = "/worksites"
export const WORKSITEVIEW = "/worksites/:id"
export const ADDWORKSITE = "/worksites/add"
export const MESSAGE = "/messages"
export const SCHEDULER = "/scheduler"
export const ADD_EVENT = "/event/add"
export const EDIT_EVENT = "/event/edit/:id"
export const MESSAGEDETAIL = "/messages/:id"
export const USERS = "/users"
export const GROUPUSERS = "/users/group"
export const TIMERREQUEST = "/timer-request"
export const GROUPMESSAGEDETAIL = "/messages/group/:id"
export const EDITWORKSITE = "/worksites/edit/:id"
export const ADDTASK = "/worksites/:id/task/add"
export const EDITTASK = "/worksites/:id/task/edit/:tid"
export const TERMSCONDITIONS = "/terms-conditions"
export const PRIVACYPOLICY = "/privacy-policy"
export const LOGIN = "/login"
export const SETTINGS = "/settings"
export const CHANGEPASSWORD = "/change-password"
export const USERFEEDBACK = "/feedback"
export const REPORTS = "/reports"
export const REPORTSLIST = "/reports/list"
export const CREATEINSPECTION = "/reports/inspection/create"
export const SUBSCRIPTION = "/subscription"
export const CHECKOUT = "/checkout/:id"
export const FORGOTPASSWORD = "/forgot-password"
export const FORGOTPASSWORDOTP = "/forgot-password/otp"
export const RESET = "/forgot-password/reset"
// Admin
export const ADMINLOGIN = "/admin-login"
export const ADMINUSERS = "/admin-users"
export const FEEDBACK = "/admin-feedback"
export const ADMINSUBSCRIPTIONS = "/admin-subscriptions"

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
