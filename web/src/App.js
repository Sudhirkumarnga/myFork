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
  ForgotPasswordOtp
} from "./containers"
import AppContext from "./Context"
import "./styles.css"
import { getProfile } from "./api/auth"
import "react-date-range/dist/styles.css" // main style file
import "react-date-range/dist/theme/default.css" // theme css file
import { SnackbarProvider } from "notistack"
const stripePromise = loadStripe(
  "pk_test_51LHszpICUZwLvblBOHgQGNgtQLWZVoQUelbi5JiK5e8rV4noTDSZ3DRCFPCoYyunryIL4OlDhwUFNAeJqKb0Lvlj00Hk8mUFpw"
)

const theme = createTheme()
function App() {
  const [user, setUser] = useState(null)
  const [listRVS, setListRVS] = useState([])
  const navigate = useNavigate()
  let userData = localStorage.getItem("user")
  let token = localStorage.getItem("token")
  const isProtected = token

  useEffect(() => {
    if (token) {
      _getProfile()
      navigate("/subscription")
    }
  }, [userData])

  const _getProfile = async () => {
    try {
      const res = await getProfile()
      setUser(res?.data?.results?.length > 0 && res?.data?.results[0])
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        _getProfile,
        listRVS
      }}
    >
      <SnackbarProvider>
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={theme}>
            <Routes>
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
