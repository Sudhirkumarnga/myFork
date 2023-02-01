// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, AppInput } from "../../components"
import { Grid } from "@mui/material"
import eyeIcon from "../../assets/svg/eye.svg"
import { useNavigate } from "react-router-dom"
import { loginUser, signupUser } from "../../api/auth"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"

export default function Login({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { user, setUser, _getProfile } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    activeTab: 0,
    email: "",
    password: "",
    emailSignup: "",
    passwordSignup: "",
    loading: false,
    loadingSignup: false,
    checked: false,
    employee_types: "",
    first_name: "",
    last_name: "",
    phone: ""
  })

  useEffect(() => {
    // if (path) {
    //   handleChange("activeTab", path === "/signup" ? 0 : 1)
    // }
    if (user) {
      navigate("/")
    }
  }, [path, user])

  const {
    email,
    password,
    loading,
    employee_types,
    activeTab,
    first_name,
    last_name,
    phone
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const onSubmit = () => {
    const UserType = localStorage.getItem("UserType")

    const payload = {
      name: first_name + " " + last_name,
      email,
      password,
      phone
    }
    if (UserType === "admin") {
      handleChange("activeTab", 2)
    } else {
      handleSignup(true)
    }
    // navigate("signupComplete", { values: payload })
  }

  const handleSignup = async isBusiness => {
    try {
      this.handleChange("loading", true, true)
      const {
        first_name,
        last_name,
        email,
        password,
        phone,
        business_code,
        termsConditions
      } = this.state
      const payload = {
        first_name,
        last_name,
        email,
        password,
        phone,
        business_code,
        is_read_terms: termsConditions
      }
      const res = await signupUser(payload)
      handleChange("loading", false, true)
      navigate("VerifyAccount", {
        email: payload?.email,
        userData: payload
      })
      enqueueSnackbar(`"Signed up Successfully, Please verify your account!"`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    } catch (error) {
      console.warn("error", error)
      handleChange("loading", false, true)
      const errorText = Object.values(error?.response?.data)
      enqueueSnackbar(`Error: ${errorText[0]}`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const handleLogin = async () => {
    try {
      handleChange("  ", true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      localStorage.setItem("token", res?.data?.key)
      localStorage.setItem("user", JSON.stringify(res?.data?.user))
      handleChange("loading", false)
      // _getProfile()
      // setUser(res?.data?.user)
      enqueueSnackbar(`Login Successful`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      navigate("/subscription")
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
      <Grid item xs={12} md={8} className="LoginBG" />
      <Grid item xs={12} md={4} className="divCenter loginRight">
        <div className=" text-center font-30 font-bold">
          {activeTab === 2
            ? "How do you refer to your employees?"
            : activeTab === 1
            ? "Sign up"
            : "Welcome back"}
        </div>
        <div className="text_grey letter-spacing text_transform_none font-14">
          {activeTab === 2
            ? "Employees will see this term"
            : activeTab === 1
            ? "Create your account"
            : "Login to your account"}
        </div>
        {activeTab !== 2 && (
          <div className="tabs">
            <div
              onClick={() => handleChange("activeTab", 0)}
              className={activeTab === 0 ? "activeTab" : "inactiveTab"}
            >
              Sign in
            </div>
            <div
              onClick={() => handleChange("activeTab", 1)}
              className={activeTab === 1 ? "activeTab" : "inactiveTab"}
            >
              Sign up
            </div>
          </div>
        )}
        <div className="width80">
          {activeTab === 2 && (
            <>
              <AppInput
                value={employee_types}
                name={"employee_types"}
                onChange={handleChange}
                className="mb-3 mt-3"
                placeholder={"e.g. Cleaners, Janitors, Crew, Gang, Team..."}
              />
            </>
          )}
          {activeTab === 1 && (
            <>
              <AppInput
                value={first_name}
                name={"first_name"}
                onChange={handleChange}
                className="mb-3 mt-3"
                placeholder={"First Name"}
              />
              <AppInput
                value={last_name}
                name={"last_name"}
                onChange={handleChange}
                className="mb-3 mt-3"
                placeholder={"Last Name"}
              />
              <AppInput
                value={phone}
                name={"phone"}
                onChange={handleChange}
                className="mb-3 mt-3"
                placeholder={"Phone Number"}
              />
            </>
          )}
          {activeTab !== 2 && (
            <>
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
                type={"password"}
                name={"password"}
                onChange={handleChange}
                postfix={
                  <img src={eyeIcon} width={20} className={"c-pointer"} />
                }
                placeholder={"********"}
              />
            </>
          )}
          {activeTab === 0 && (
            <div className="flex_end mb-4">
              <div
                className="c-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                <p className="text_primary">Forgot Password?</p>
              </div>
            </div>
          )}
          <AppButton
            title={
              activeTab === 2 ? "Sign up" : activeTab === 1 ? "Next" : "Login"
            }
            onClick={() =>
              activeTab === 2
                ? handleSignup(true)
                : activeTab === 1
                ? onSubmit()
                : handleLogin()
            }
            loading={loading}
            disabled={
              activeTab === 2
                ? false
                : activeTab === 1
                ? !email || !first_name || !last_name || !password || !phone
                : !email || !password
            }
            backgroundColor={COLORS.primary}
            color={"#fff"}
          />
          {activeTab === 2 && (
            <AppButton
              title={"Back"}
              onClick={() => handleChange("activeTab", 1)}
              backgroundColor={COLORS.white}
              color={COLORS.primary}
            />
          )}
        </div>
      </Grid>
    </Grid>
  )
}
