import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import bell from '../../assets/svg/bell.svg'
import 'rsuite/dist/rsuite.min.css'
import { useSnackbar } from 'notistack'
import userProfile from '../../assets/images/userProfile.png'
import AppButton from '../AppButton'
import { Popover } from '@mui/material'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'

export default function DashboardHeader () {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState({
    visible: false,
    dropdownOpen: false
  })
  const { user, setUser } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const { dropdownOpen, visible } = state
  const showDrawer = () => {
    setState(pre => ({
      ...pre,
      visible: true
    }))
  }

  const onClose = () => {
    setState(pre => ({
      ...pre,
      visible: false
    }))
  }

  const onlogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    enqueueSnackbar(`Logout!`, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      }
    })
    navigate('/login')
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  let userData = localStorage.getItem('userData')
  userData = JSON.parse(userData)
  return (
    <div>
      <header className='dashboardHeader'>
        <div className='dashboardHeaderDiv'>
          <li className='d-flex justify-content-end align-items-center'>
            <div className='text_primary font-bold font-16'>
              {location.pathname === '/dashboard/profile'
                ? 'My Profile'
                : location.pathname === '/dashboard/offers'
                ? 'Offers'
                : location.pathname === '/dashboard/portfolio'
                ? 'My Portfolio'
                : location.pathname === '/dashboard/notifications'
                ? 'Notifications'
                : location.pathname === '/dashboard/spot-price' ||
                  location.pathname === '/dashboard/retail-value' ||
                  location.pathname === '/dashboard/makeoffers'
                ? 'My Portfolio - '
                : 'Settings'}
              {location.pathname === '/dashboard/spot-price' && (
                <span style={{ color: COLORS.primary }}>Spot Price</span>
              )}
              {location.pathname === '/dashboard/retail-value' && (
                <span style={{ color: COLORS.retail }}>Retail Value</span>
              )}
              {location.pathname === '/dashboard/makeoffers' && (
                <span style={{ color: COLORS.offer }}>Make Me An Offer</span>
              )}
            </div>
          </li>
          <li className='d-flex justify-content-end align-items-center'>
            <div className='mr-2 d-flex align-items-center'>
              <img src={bell} className={'mr-2'} />
              {/* <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ width: 200 }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <div>
                  <AppButton
                    width={120}
                    className={'text-left'}
                    title={'Logout'}
                    onClick={onlogout}
                    backgroundColor={'#fff'}
                    color={'#000'}
                  />
                </div>
              </Popover> */}
              <div className={'divider'} />
              <img
                onClick={handleClick}
                style={{ borderRadius: 50 }}
                src={user?.picture || userProfile}
                className={'mr-2'}
                width={40}
              />
              <span className='font-bold font-16'>{user?.first_name}</span>
            </div>
          </li>
        </div>
      </header>
    </div>
  )
}
