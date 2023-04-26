import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import bell from "../../assets/svg/bell.svg"
import "rsuite/dist/rsuite.min.css"
import { useSnackbar } from "notistack"
import userProfile from "../../assets/images/userProfile.png"
import searchIcon from "../../assets/svg/search.svg"
import { ReactComponent as Myprofile } from "../../assets/svg/myprofile.svg"
import { ReactComponent as Settings } from "../../assets/svg/Settingsicon.svg"
import { ReactComponent as Employeelist } from "../../assets/svg/employeelist.svg"
import { ReactComponent as Worksites } from "../../assets/svg/worksites.svg"
import { ReactComponent as Schedular } from "../../assets/svg/schedular.svg"
import { ReactComponent as Report } from "../../assets/svg/report.svg"
import { ReactComponent as Timer } from "../../assets/svg/timer.svg"
import menuIcon from "../../assets/svg/menu.svg"
import AppButton from "../AppButton"
import { Popover } from "@mui/material"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import AppInput from "../AppInput"

export default function DashboardHeader() {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState({
    search: "",
    dropdownOpen: false
  })
  const { search } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const { user, setUser, adminProfile } = useContext(AppContext)
  const UserType = localStorage.getItem("UserType")
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  let userData = localStorage.getItem("userData")
  userData = JSON.parse(userData)
  const list = [
    {
      title: "My Profile",
      route: "/business/profile/update",
      icon: <Myprofile />
    },
    { title: "Employee List", route: "/employee-list", icon: <Employeelist /> },
    { title: "Worksites", route: "/worksites", icon: <Worksites /> },
    { title: "Report", route: "/reports", icon: <Report /> },
    { title: "Timer off Requests", route: "/timer-request", icon: <Timer /> },
    { title: "Scheduler", route: "/scheduler", icon: <Schedular /> },
    { title: "Settings", route: "/settings", icon: <Settings /> }
  ]
  const listE = [
    { title: "My Profile", route: "/profile/update", icon: <Myprofile /> },
    { title: "Worksites", route: "/worksites", icon: <Worksites /> },
    {
      title: "Timer off Requests",
      route: "/time-off-request",
      icon: <Timer />
    },
    { title: "Settings", route: "/settings", icon: <Settings /> }
  ]
  return (
    <div>
      <header className="dashboardHeader">
        <div className="dashboardHeaderDiv">
          <li className="d-flex align-items-center">
            <AppInput
              placeholder={"Search"}
              autoComplete={"new-password"}
              value={search}
              name={"search"}
              borderRadius={10}
              onChange={handleChange}
              inputWidthFull
              height={40}
              postfix={<img src={searchIcon} width={"20px"} />}
            />
          </li>
          <li className="d-flex justify-content-end align-items-center">
            <div className="mr-2 d-flex c-pointer align-items-center">
              <img
                onClick={() => navigate("/notifications")}
                src={bell}
                className={"mr-4"}
              />
              <Popover
                id={id}
                open={open}
                classes={{ paper: "dropdownPaper" }}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ width: 300 }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
              >
                <div style={{ width: 300, borderRadius: 12 }}>
                  {(UserType === "admin" ? list : listE).map((item, index) => (
                    <div
                      onClick={() => item.route && navigate(item?.route)}
                      className="dropdownMenu"
                      key={index}
                    >
                      <div className="dropdownicon">{item.icon}</div>
                      <div>{item.title}</div>
                    </div>
                  ))}
                </div>
              </Popover>
              <img
                style={{ borderRadius: 10 }}
                src={
                  adminProfile?.business_information?.profile_image ||
                  userProfile
                }
                className={"mr-3"}
                width={40}
              />
              <span className="font-bold font-16">
                {adminProfile?.personal_information?.first_name +
                  " " +
                  adminProfile?.personal_information?.last_name || "Jack Doe"}
              </span>
              <img
                onClick={handleClick}
                src={menuIcon}
                className="ml-4"
                width={20}
              />
            </div>
          </li>
        </div>
      </header>
    </div>
  )
}
