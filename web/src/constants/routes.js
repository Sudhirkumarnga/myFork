import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

export const HOME = '/'
export const MAIN = '/dashboard/spot-price'
export const MAIN1 = '/dashboard/retail-value'
export const MAIN2 = '/dashboard/makeoffers'
export const CONTACTUS = '/contact-us'
export const TERMSCONDITIONS = '/terms-conditions'
export const PRIVACYPOLICY = '/privacy-policy'
export const ABOUTUS = '/about-us'
export const RECOMMANDATION = '/recommandation'
export const MOREFILTER = '/more-filter'
export const RVDETAILS = '/rv/:id'
export const LOGIN = '/login'
export const SUBSCRIPTION = '/subscription'
export const CHECKOUT = '/checkout/:id'
export const FORGOTPASSWORD = '/forgot-password'
export const CHANGEPASSWORD = '/change-password'
export const FEEDBACK = '/feedback'
export const INVITELINK = '/invite-link'
export const UPLOADPHOTO = '/upload-photo'
export const SETTINGS = '/settings'
export const BOOKING = '/booking/:id'
export const ADD_PORTFOLIO = '/dashboard/portfolio/add'
export const UPLOAD_PORTFOLIO = '/dashboard/portfolio/add/new'
export const MY_PORTFOLIO = '/dashboard/portfolio'
export const MY_BOOKING_DETAILS = '/my-booking/details'
export const ADDCARD = '/booking/:id/payment'
export const LISTRVS = '/rvs'
export const ADDDETAILS = '/rvs/add'
export const LISTING = '/rvs/listing'
export const PRICING = '/rvs/pricing'
export const ADDPHOTOS = '/rvs/add-photos'
export const INBOX = '/dashboard/inbox'
export const NEWMESSAGE = '/dashboard/message/new'
export const PROFILE = '/dashboard/profile'
export const OFFERS = '/dashboard/offers'
export const NOTIFICATIONS = '/dashboard/notifications'
export const WITHDRAW = '/dashboard/wallet/withdraw'
export const MATRICS = '/dashboard/matrics'
export const MYLISTING = '/dashboard/listing'
export const RESERVATION = '/dashboard/reservation'
export const RESERVATION_DETAILS = '/dashboard/reservation/details'
export const INVOICECREATE = '/dashboard/invoice/create'
export const FAVOURITE = '/rv/favourite'

export const SIDEBAR = (
  <React.Fragment>
    <ListItemButton>
      <ListItemText primary='Dashboard' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Users' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Zip Codes' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Requests' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Feedback' />
    </ListItemButton>
  </React.Fragment>
)
