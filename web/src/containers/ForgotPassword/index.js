// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from "react"
import { AppButton, AppInput, AuthLeft } from "../../components"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { forgotpassword, resetEmail } from "../../api/auth"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"

export default function ForgotPassword({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [state, setState] = useState({
    activeTab: 0,
    email: "",
    password: "",
    passwordSignup: "",
    loading: false,
    checked: false
  })

  const { activeTab, email, loading } = state

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
        email
      }
      const res = await resetEmail(payload)
      handleChange("loading", false)
      enqueueSnackbar(`Email has been sent`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      localStorage.setItem("email", email)
      navigate(`/forgot-password/otp`)
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
          {"Forgot Password"}
        </div>
        <div className="text_grey mt-3 text-center width80 letter-spacing text_transform_none font-14">
          {"Please enter your email address in order to reset your password"}
        </div>
        <div className="width80 mt-4">
          <AppInput
            value={email}
            name={"email"}
            onChange={handleChange}
            className="mb-5 mt-3"
            placeholder={"Email Address"}
          />

          <AppButton
            title={"Submit"}
            onClick={handleSignup}
            loading={loading}
            className="mb-3"
            disabled={!email}
            backgroundColor={COLORS.primary}
            color={"#fff"}
          />
          <AppButton
            title={"Back"}
            onClick={() => navigate(-1)}
            backgroundColor={COLORS.white}
            color={COLORS.primary}
          />
        </div>
      </Grid>
    </Grid>
  )
}
