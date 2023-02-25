// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, AppInput, AuthLeft } from "../../components"
import { Grid } from "@mui/material"
import eyeIcon from "../../assets/svg/eye.svg"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../../api/auth"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import eyeCLose from "../../assets/images/closeEYE.jpg"

export default function AdminLogin({}) {
  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()
  const UserType = localStorage.getItem("UserType")
  const { adminUser, setAdminUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    email: "",
    password: "",
    loading: false,
    isShow: false
  })

  const { email, password, loading, isShow } = state

  useEffect(() => {
    if (adminUser) {
      navigate("/admin/users")
    }
  }, [adminUser])

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleLogin = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      handleChange("loading", false)
      if (res?.data?.user?.role !== null) {
        alert("Please use super admin user")
        return
      }
      localStorage.setItem("token", res?.data?.key)
      localStorage.setItem("user", JSON.stringify(res?.data?.user))
      setAdminUser(res?.data?.user)
      enqueueSnackbar(`Login Successful`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      navigate("/admin/users")
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        alert(`Error: ${errorText[0]}`)
      } else {
        alert(`Error: ${error}`)
      }
    }
  }

  return (
    <Grid container className="authSection">
      <AuthLeft />
      <Grid item xs={12} md={4} className="divCenter loginRight">
        <div className=" text-center font-30 font-bold">
          {"Welcome back to Admin"}
        </div>
        <div className="text_grey letter-spacing text_transform_none font-14">
          {"Login to your account"}
        </div>
        <div className="width80">
          <AppInput
            value={email}
            name={"email"}
            onChange={handleChange}
            className="mb-3 mt-3"
            placeholder={"Email Address"}
          />
          <AppInput
            className="mb-4 mt-3"
            value={password}
            type={isShow ? "text" : "password"}
            name={"password"}
            onChange={handleChange}
            postfix={
              <img
                src={isShow ? eyeIcon : eyeCLose}
                style={{ objectFit: "contain" }}
                onClick={() => handleChange("isShow", !isShow)}
                width={20}
                className={"c-pointer"}
              />
            }
            placeholder={"********"}
          />
          <AppButton
            title={"Login"}
            onClick={() => handleLogin()}
            loading={loading}
            disabled={!email || !password}
            backgroundColor={COLORS.primary}
            color={"#fff"}
          />
        </div>
      </Grid>
    </Grid>
  )
}
