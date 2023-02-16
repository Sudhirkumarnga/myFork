import "./App.css"
import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { PrivateRoute } from "./components"
import { loadStripe } from "@stripe/stripe-js"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Elements } from "@stripe/react-stripe-js"

//ROUTES
import * as ROUTES from "./constants/routes"

//CONTAINERS
import {
  PrivacyPolicy,
  TermsConditions,
  Login,
  ForgotPassword,
  Subscription,
  Checkout,
  MainHome,
  ForgotPasswordOtp,
  Reset,
  Dashboard,
  Payroll
} from "./containers"
import AppContext from "./Context"
import "./styles.css"
import { getProfile } from "./api/auth"
import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import { SnackbarProvider } from "notistack"
import { getUpcomingShift, getUpcomingShiftTimes } from "./api/employee"
import { getEarnings } from "./api/business"
import EmployeeList from "./containers/Dashboard/EmployeeList"
const stripePromise = loadStripe(
  "pk_test_51LHszpICUZwLvblBOHgQGNgtQLWZVoQUelbi5JiK5e8rV4noTDSZ3DRCFPCoYyunryIL4OlDhwUFNAeJqKb0Lvlj00Hk8mUFpw"
)

const theme = createTheme()
function App() {
  const [user, setUser] = useState(null)
  const [listRVS, setListRVS] = useState([])
  const [adminProfile, setAdminProfile] = useState(null)
  const [upcomingShiftData, setUpcomingShiftData] = useState(null)
  const [earnings, setEarnings] = useState([])
  const [earningLoading, setEarningLoading] = useState(false)
  const [upcomingShiftTimesDataList, setupcomingShiftTimesDataList] = useState(
    []
  )
  const navigate = useNavigate()
  let userData = localStorage.getItem("user")
  let token = localStorage.getItem("token")
  const isProtected = token

  const _getUpcomingShift = async () => {
    try {
      const res = await getUpcomingShift(token)
      setUpcomingShiftData(res?.data)
      if (res?.data?.id) {
        const res1 = await getUpcomingShiftTimes(
          `?event=${res?.data?.id}`,
          token
        )
        setupcomingShiftTimesDataList(res1?.data)
      }
    } catch (error) {
      const showWError = error.response?.data?.error
        ? Object.values(error.response?.data?.error)
        : error.response?.data
        ? Object.values(error.response?.data)
        : ""
      if (showWError.length > 0) {
        alert(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        alert(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  const _getProfile = async () => {
    try {
      const res = await getProfile()
      setAdminProfile(res?.data?.response)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getEarnings = async payload => {
    try {
      setEarningLoading(true)
      const qs = payload ? payload : ""
      const res = await getEarnings(qs, token)
      setEarnings(res?.data)
      setEarningLoading(false)
    } catch (error) {
      setEarningLoading(false)
      const showWError = error.response?.data?.error
        ? Object.values(error.response?.data?.error)
        : error.response?.data
        ? Object.values(error.response?.data)
        : ""
      if (showWError.length > 0) {
        alert(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        alert(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        adminProfile,
        _getProfile,
        listRVS,
        _getUpcomingShift,
        upcomingShiftData,
        upcomingShiftTimesDataList,
        earnings,
        earningLoading,
        _getEarnings
      }}
    >
      <SnackbarProvider>
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PAYROLL} element={<Payroll />} />
              <Route path={ROUTES.EMPLOYEELIST} element={<EmployeeList />} />
              <Route path={ROUTES.HOME} element={<MainHome />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.SUBSCRIPTION}
                element={
                  <PrivateRoute isAuthenticated={isProtected}>
                    <Subscription />
                  </PrivateRoute>
                }
              />
              <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
              <Route
                path={ROUTES.FORGOTPASSWORD}
                element={<ForgotPassword />}
              />
              <Route
                path={ROUTES.FORGOTPASSWORDOTP}
                element={<ForgotPasswordOtp />}
              />
              <Route path={ROUTES.RESET} element={<Reset />} />
              <Route
                path={ROUTES.TERMSCONDITIONS}
                element={<TermsConditions />}
              />
              <Route path={ROUTES.PRIVACYPOLICY} element={<PrivacyPolicy />} />
            </Routes>
          </ThemeProvider>
        </Elements>
      </SnackbarProvider>
    </AppContext.Provider>
  )
}

export default App
