import React, { useState } from "react"
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
    visible: false,
    dropdownOpen: false
  })
  const { user, setUser, adminProfile } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const { dropdownOpen, visible } = state
  const showDrawer = () => {
    setState(pre => ({
      ...pre,
      visible: true
    }))
  }

  const onClose = () => {
    setState(pre => ({
      ...pre,
      visible: false
    }))
  }

  const onlogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    enqueueSnackbar(`Logout!`, {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      }
    })
    navigate("/login")
  }

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
    { title: "My Profile", route: "", icon: <Myprofile /> },
    { title: "Employee List", route: "/employee-list", icon: <Employeelist /> },
    { title: "Worksites", route: "/worksites", icon: <Worksites /> },
    { title: "Scheduler", route: "", icon: <Schedular /> },
    { title: "Settings", route: "", icon: <Settings /> }
  ]
  return (
    <div>
      <header className="dashboardHeader">
        <div className="dashboardHeaderDiv">
          <li className="d-flex align-items-center">
            <AppInput
              placeholder={"Search"}
              borderRadius={10}
              inputWidthFull
              height={40}
              postfix={<img src={searchIcon} width={"20px"} />}
            />
          </li>
          <li className="d-flex justify-content-end align-items-center">
            <div className="mr-2 d-flex c-pointer align-items-center">
              <img src={bell} className={"mr-4"} />
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
                  {list.map((item, index) => (
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
