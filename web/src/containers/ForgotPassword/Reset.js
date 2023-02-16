// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, AppInput, AuthLeft } from "../../components"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router-dom"
import eyeIcon from "../../assets/svg/eye.svg"
import { setPassword } from "../../api/auth"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import eyeCLose from "../../assets/images/closeEYE.jpg"

export default function Reset({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const email = localStorage.getItem("email")
  const [state, setState] = useState({
    new_password1: "",
    new_password2: "",
    loading: false,
    loadingResend: false,
    isShow: false,
    isShow1: false
  })

  const {
    new_password1,
    new_password2,
    loading,
    loadingResend,
    isShow,
    isShow1
  } = state

  // useEffect(() => {
  //   return () => localStorage.removeItem("email")
  // }, [])

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSignup = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email,
        new_password1,
        new_password2
      }
      const res = await setPassword(payload)
      handleChange("loading", false)
      enqueueSnackbar(`Password has been changed`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      navigate("/login")
      localStorage.removeItem("email")
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        enqueueSnackbar(`Error: ${errorText[0]}`, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      } else {
        enqueueSnackbar(`Error: ${error}`, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      }
    }
  }

  return (
    <Grid container className="authSection">
      <AuthLeft />
      <Grid item xs={12} md={4} className="divCenter loginRight">
        <div className=" text-center font-30 font-bold">{"Password Reset"}</div>
        <div className="width80 mt-4">
          <AppInput
            className="mb-4 mt-3"
            value={new_password1}
            name={"new_password1"}
            type={isShow ? "text" : "password"}
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
          <AppInput
            className="mb-4 mt-3"
            value={new_password2}
            name={"new_password2"}
            type={isShow1 ? "text" : "password"}
            onChange={handleChange}
            postfix={
              <img
                src={isShow1 ? eyeIcon : eyeCLose}
                style={{ objectFit: "contain" }}
                onClick={() => handleChange("isShow1", !isShow1)}
                width={20}
                className={"c-pointer"}
              />
            }
            placeholder={"********"}
          />
          <AppButton
            title={"Submit"}
            onClick={handleSignup}
            loading={loading}
            className="mb-3"
            disabled={!email || !new_password1 || !new_password2}
            backgroundColor={COLORS.primary}
            color={"#fff"}
          />
          <AppButton
            title={"Cancel"}
            loading={loadingResend}
            onClick={() => navigate("/login")}
            backgroundColor={COLORS.white}
            color={COLORS.primary}
          />
        </div>
      </Grid>
    </Grid>
  )
}
