import "./App.css"
import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { PrivateRoute, AdminPrivateRoute } from "./components"
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
  Payroll,
  AdminLogin,
  Users,
  Feedback,
  Subscriptions,
  EmployeeView,
  WorkSiteList,
  WorksiteView,
  AddEmployee,
  AddWorksite,
  AddTask
} from "./containers"
import AppContext from "./Context"
import "./styles.css"
import { getCities, getCountries, getProfile, getStates } from "./api/auth"
import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import { SnackbarProvider } from "notistack"
import { getUpcomingShift, getUpcomingShiftTimes } from "./api/employee"
import { getEarnings } from "./api/business"
import EmployeeList from "./containers/Dashboard/EmployeeList"
import { getAdminUsers, getFeedbacks, getSubscriptions } from "./api/admin"
import { getSimplifiedError } from "./utils/error"
const stripePromise = loadStripe(
  "pk_test_51LHszpICUZwLvblBOHgQGNgtQLWZVoQUelbi5JiK5e8rV4noTDSZ3DRCFPCoYyunryIL4OlDhwUFNAeJqKb0Lvlj00Hk8mUFpw"
)

const theme = createTheme()
function App() {
  // Admin Side
  const [adminUser, setAdminUser] = useState(null)
  const [businessUsers, setBusinessUsers] = useState([])
  const [employeeUsers, setEmployeeUsers] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [subscriptions, setSubscriptions] = useState([])

  // User Side
  const [user, setUser] = useState(null)
  const [listRVS, setListRVS] = useState([])
  const [adminProfile, setAdminProfile] = useState(null)
  const [upcomingShiftData, setUpcomingShiftData] = useState(null)
  const [earnings, setEarnings] = useState([])
  const [earningLoading, setEarningLoading] = useState(false)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [loadingCity, setLoadingCity] = useState(false)
  const [upcomingShiftTimesDataList, setupcomingShiftTimesDataList] = useState(
    []
  )
  const navigate = useNavigate()
  let userData = localStorage.getItem("user")
  let token = localStorage.getItem("token")
  const isProtected = token

  const _getAdminData = async () => {
    try {
      const Organization = await getAdminUsers("?role=Organization Admin")
      const Employee = await getAdminUsers("?role=Employee")
      const Feedback = await getFeedbacks()
      const Subscription = await getSubscriptions()
      setBusinessUsers(Organization?.data)
      setEmployeeUsers(Employee?.data)
      setFeedbacks(Feedback?.data)
      setSubscriptions(Subscription?.data)
    } catch (error) {
      alert(getSimplifiedError(error))
    }
  }

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
      alert(getSimplifiedError(error))
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
      alert(getSimplifiedError(error))
    }
  }

  const _getCountries = async () => {
    try {
      const countries = await getCountries(token)
      _getCities("")
      const states = await getStates(token)
      setCountries(countries?.data?.results)
      setCities(cities?.data)
      setStates(states?.data?.results)
    } catch (error) {
      alert(getSimplifiedError(error))
    }
  }

  const _getCities = async payload => {
    try {
      setLoadingCity(true)
      const body = payload || ""
      const cities = await getCities(body, token)
      setCities(cities?.data)
      setLoadingCity(false)
    } catch (error) {
      setLoadingCity(false)
      alert(getSimplifiedError(error))
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
        _getEarnings,
        setAdminUser,
        adminUser,
        businessUsers,
        employeeUsers,
        _getAdminData,
        feedbacks,
        subscriptions,
        _getCountries,
        countries,
        cities,
        states
      }}
    >
      <SnackbarProvider>
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PAYROLL} element={<Payroll />} />
              <Route path={ROUTES.EMPLOYEELIST} element={<EmployeeList />} />
              <Route path={ROUTES.EMPLOYEEVIEW} element={<EmployeeView />} />
              <Route path={ROUTES.ADDEMPLOYEE} element={<AddEmployee />} />
              <Route path={ROUTES.EDITEMPLOYEE} element={<AddEmployee />} />
              <Route path={ROUTES.WORKSITELIST} element={<WorkSiteList />} />
              <Route path={ROUTES.WORKSITEVIEW} element={<WorksiteView />} />
              <Route path={ROUTES.ADDWORKSITE} element={<AddWorksite />} />
              <Route path={ROUTES.ADDTASK} element={<AddTask />} />
              <Route path={ROUTES.EDITTASK} element={<AddTask />} />
              <Route path={ROUTES.EDITWORKSITE} element={<AddWorksite />} />
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
              {/* Admin Routes */}
              <Route path={ROUTES.ADMINLOGIN} element={<AdminLogin />} />
              <Route
                path={ROUTES.ADMINUSERS}
                element={
                  <AdminPrivateRoute>
                    <Users />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path={ROUTES.FEEDBACK}
                element={
                  <AdminPrivateRoute>
                    <Feedback />
                  </AdminPrivateRoute>
                }
              />
              <Route
                path={ROUTES.ADMINSUBSCRIPTIONS}
                element={
                  <AdminPrivateRoute>
                    <Subscriptions />
                  </AdminPrivateRoute>
                }
              />
            </Routes>
          </ThemeProvider>
        </Elements>
      </SnackbarProvider>
    </AppContext.Provider>
  )
}

export default App
