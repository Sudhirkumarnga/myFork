// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from "react"
import { AppButton, AppInput, AuthLeft } from "../../components"
import { Grid } from "@mui/material"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { forgotpassword, resetEmail, verifyEmail } from "../../api/auth"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import OtpInput from "react-otp-input"

export default function ForgotPasswordOtp({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const email = localStorage.getItem("email")
  const [state, setState] = useState({
    otp: "",
    loading: false,
    loadingResend: false
  })

  const { otp, loading, loadingResend } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleResendOTP = async () => {
    try {
      handleChange("loadingResend", true)

      const payload = {
        email
      }
      await resetEmail(payload)
      handleChange("loadingResend", false)
      enqueueSnackbar(`Email has been sent to ${email}`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    } catch (error) {
      handleChange("loadingResend", false)
      enqueueSnackbar(`Error: ${error.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const handleSignup = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email,
        otp
      }
      await verifyEmail(payload)
      handleChange("loading", false)
      enqueueSnackbar(`OTP has been verified`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      navigate(`/forgot-password/reset`)
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
        <div className=" text-center font-30 font-bold">{"Token input"}</div>
        <div className="text_grey mt-3 text-center width80 letter-spacing text_transform_none font-14">
          {"Please enter 4 digit code sent to your email address"}
        </div>
        <div className="width80 columnCenter mt-4">
          <OtpInput
            value={otp}
            inputStyle={{
              width: 50,
              marginRight: 20,
              height: 60,
              border: "1px solid #CECECE",
              backgroundColor: "#F7F7F7",
              borderRadius: 10
            }}
            onChange={e => handleChange("otp", e)}
            numInputs={4}
          />
          <AppButton
            title={"Submit"}
            onClick={handleSignup}
            loading={loading}
            className="mb-3 mt-4"
            disabled={!email}
            backgroundColor={COLORS.primary}
            color={"#fff"}
          />
          <AppButton
            title={"Resend token"}
            loading={loadingResend}
            onClick={handleResendOTP}
            backgroundColor={COLORS.white}
            color={COLORS.primary}
          />
        </div>
      </Grid>
    </Grid>
  )
}
