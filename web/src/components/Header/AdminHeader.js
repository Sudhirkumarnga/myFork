import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "rsuite/dist/rsuite.min.css"
import { useSnackbar } from "notistack"
import menuIcon from "../../assets/svg/menu.svg"
import AppButton from "../AppButton"
import { Popover } from "@mui/material"
import AppContext from "../../Context"
import { useContext } from "react"

export default function AdminHeader() {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { setAdminUser } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null)

  const onlogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAdminUser(null)
    enqueueSnackbar(`Logout!`, {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      }
    })
    navigate("/admin-login")
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
  return (
    <div>
      <header className="dashboardHeader">
        <div className="dashboardHeaderDiv">
          <li className="d-flex align-items-center"></li>
          <li className="d-flex justify-content-end align-items-center">
            <div className="mr-2 d-flex c-pointer align-items-center">
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ width: 200 }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
              >
                <div>
                  <AppButton
                    width={120}
                    className={"text-left"}
                    title={"Logout"}
                    onClick={onlogout}
                    backgroundColor={"#fff"}
                    color={"#000"}
                  />
                </div>
              </Popover>
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
