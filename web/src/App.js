import './App.css'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { PrivateRoute } from './components'
import { loadStripe } from '@stripe/stripe-js'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Elements } from '@stripe/react-stripe-js'

//ROUTES
import * as ROUTES from './constants/routes'

//CONTAINERS
import {
  ContactUs,
  Home,
  MoreFilter,
  PrivacyPolicy,
  Recommandation,
  RVDetails,
  TermsConditions,
  Login,
  MyPortfolio,
  AddCard,
  ListRVs,
  AddDetails,
  Listing,
  Pricing,
  AddPhotos,
  ForgotPassword,
  FeedBack,
  InviteLink,
  ChangePassword,
  UploadPhoto,
  Settings,
  // Inbox,
  NewMessage,
  Profile,
  Offers,
  Withdraw,
  Matrics,
  Listings,
  Reservation,
  ReservationDetails,
  InvoiceCreate,
  Favourite,
  Subscription,
  Checkout,
  Aboutus,
  Notifications,
  AddCoin,
  Upload,
  MainHome
} from './containers'
import AppContext from './Context'
import './styles.css'
import { getProfile } from './api/auth'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { SnackbarProvider } from 'notistack'
const stripePromise = loadStripe(
  'pk_test_51LHszpICUZwLvblBOHgQGNgtQLWZVoQUelbi5JiK5e8rV4noTDSZ3DRCFPCoYyunryIL4OlDhwUFNAeJqKb0Lvlj00Hk8mUFpw'
)

const theme = createTheme()
function App () {
  const [user, setUser] = useState(null)
  const [listRVS, setListRVS] = useState([])
  const navigate = useNavigate()
  let userData = localStorage.getItem('user')
  let token = localStorage.getItem('token')
  const isProtected = token

  useEffect(() => {
    if (token) {
      _getProfile()
      navigate('/subscription')
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
              <Route path={ROUTES.MAIN} element={<Home />} />
              <Route path={ROUTES.MAIN1} element={<Home />} />
              <Route path={ROUTES.MAIN2} element={<Home />} />
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
                element={
                  <PrivateRoute isAuthenticated={isProtected}>
                    <ForgotPassword />
                  </PrivateRoute>
                }
              />
              <Route
                path={ROUTES.CHANGEPASSWORD}
                element={<ChangePassword />}
              />
              <Route path={ROUTES.FEEDBACK} element={<FeedBack />} />
              <Route path={ROUTES.INVITELINK} element={<InviteLink />} />
              <Route path={ROUTES.UPLOADPHOTO} element={<UploadPhoto />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path={ROUTES.RVDETAILS} element={<RVDetails />} />
              <Route path={ROUTES.CONTACTUS} element={<ContactUs />} />
              <Route
                path={ROUTES.TERMSCONDITIONS}
                element={<TermsConditions />}
              />
              <Route path={ROUTES.ABOUTUS} element={<Aboutus />} />
              <Route path={ROUTES.PRIVACYPOLICY} element={<PrivacyPolicy />} />
              <Route
                path={ROUTES.RECOMMANDATION}
                element={<Recommandation />}
              />
              <Route path={ROUTES.MOREFILTER} element={<MoreFilter />} />
              <Route path={ROUTES.UPLOAD_PORTFOLIO} element={<Upload />} />
              <Route path={ROUTES.ADD_PORTFOLIO} element={<AddCoin />} />
              <Route path={ROUTES.MY_PORTFOLIO} element={<MyPortfolio />} />
              <Route path={ROUTES.ADDCARD} element={<AddCard />} />
              <Route path={ROUTES.LISTRVS} element={<ListRVs />} />
              <Route path={ROUTES.ADDDETAILS} element={<AddDetails />} />
              <Route path={ROUTES.LISTING} element={<Listing />} />
              <Route path={ROUTES.PRICING} element={<Pricing />} />
              <Route path={ROUTES.ADDPHOTOS} element={<AddPhotos />} />
              {/* <Route path={ROUTES.INBOX} element={<Inbox />} /> */}
              <Route path={ROUTES.NEWMESSAGE} element={<NewMessage />} />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <PrivateRoute isAuthenticated={isProtected}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path={ROUTES.OFFERS} element={<Offers />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
              <Route path={ROUTES.MATRICS} element={<Matrics />} />
              <Route path={ROUTES.MYLISTING} element={<Listings />} />
              <Route path={ROUTES.RESERVATION} element={<Reservation />} />
              <Route
                path={ROUTES.RESERVATION_DETAILS}
                element={<ReservationDetails />}
              />
              <Route path={ROUTES.INVOICECREATE} element={<InvoiceCreate />} />
              <Route path={ROUTES.FAVOURITE} element={<Favourite />} />
            </Routes>
          </ThemeProvider>
        </Elements>
      </SnackbarProvider>
    </AppContext.Provider>
  )
}

export default App
