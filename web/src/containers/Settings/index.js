// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useRef, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import {
  Grid,
  Tab,
  Tabs,
  Typography,
  Box,
  Switch,
  Divider
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import uploadphoto from '../../assets/svg/uploadphoto.svg'
import videoupload from '../../assets/svg/videoupload.svg'
import { styled } from '@mui/material/styles'

const IOSSwitch = styled(props => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#A87C51' : '#A87C51',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export default function Settings ({}) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    image1: '',
    showMap: '',
    loading: false,
    loadingSignup: false,
    checked: false
  })

  const { showMap, email, password, loading, image1 } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={10} className='loginPaper p-4'>
              <p className='text_primary font-bold font-18 mb-3'>Settings</p>
              <Divider />
              <Grid container spacing={2} className={'mt-4'}>
                <Grid item xs={10} md={8}>
                  <Link to={'/privacy-policy'}>
                    <p className='text_secondary font-18 mb-3'>
                      Privacy Policy
                    </p>
                  </Link>
                  <Link to={'/terms-conditions'}>
                    <p className='text_secondary font-18 mb-3'>
                      Terms and Conditions
                    </p>
                  </Link>
                  <Link to={'/change-password'}>
                    <p className='text_secondary font-18 mb-3'>
                      Change Password
                    </p>
                  </Link>
                  <Link to={'/invite-link'}>
                    <p className='text_secondary font-18 mb-3'>
                      Invite friends
                    </p>
                  </Link>
                  <Link to={'/feedback'}>
                    <p className='text_secondary font-18 mb-3'>Feedback</p>
                  </Link>
                  <p
                    onClick={logout}
                    className='text_secondary c-pointer font-18 mb-3'
                  >
                    Log out
                  </p>
                </Grid>
                <Grid item xs={10} md={4}>
                  <p className='text_primary font-bold font-18 mb-3'>
                    Message settings
                  </p>
                  <div className='d-flex align-items-center mb-2 justify-content-between'>
                    <p className='text_primary font-14 '>Receive via sms</p>
                    <IOSSwitch
                      {...label}
                      checked={showMap}
                      onClick={() => handleChange('showMap', !showMap)}
                    />
                  </div>
                  <div className='d-flex align-items-center mb-2 justify-content-between'>
                    <p className='text_primary font-14 '>Receive via Email </p>
                    <IOSSwitch
                      {...label}
                      checked={showMap}
                      onClick={() => handleChange('showMap', !showMap)}
                    />
                  </div>
                  <div className='d-flex align-items-center mb-2 justify-content-between'>
                    <p className='text_primary font-14 '>Receive only in app</p>
                    <IOSSwitch
                      {...label}
                      checked={showMap}
                      onClick={() => handleChange('showMap', !showMap)}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
