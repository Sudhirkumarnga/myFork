// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from "react"
import { AppButton, AppInput } from "../../components"
import { Grid } from "@mui/material"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import eyeIcon from "../../assets/svg/eye.svg"
import { setPassword } from "../../api/auth"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"

export default function Reset({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const [state, setState] = useState({
    new_password1: "",
    new_password2: "",
    loading: false
  })

  const { new_password1, new_password2, loading } = state

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
      <Grid item xs={12} md={8} className="LoginBG" />
      <Grid item xs={12} md={4} className="divCenter loginRight">
        <div className=" text-center font-30 font-bold">{"Password Reset"}</div>
        <div className="width80 mt-4">
          <AppInput
            className="mb-4 mt-3"
            value={new_password1}
            name={"new_password1"}
            type={"password"}
            onChange={handleChange}
            postfix={<img src={eyeIcon} width={20} className={"c-pointer"} />}
            placeholder={"********"}
          />
          <AppInput
            className="mb-4 mt-3"
            value={new_password2}
            name={"new_password2"}
            type={"password"}
            onChange={handleChange}
            postfix={<img src={eyeIcon} width={20} className={"c-pointer"} />}
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
            onClick={() => navigate(-1)}
            backgroundColor={COLORS.white}
            color={COLORS.primary}
          />
        </div>
      </Grid>
    </Grid>
  )
}
