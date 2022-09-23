// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Tab, Tabs, Typography, Box, Checkbox } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { inviteFriend, loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'

export default function InviteLink ({}) {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    activeTab: 0,
    email: '',
    password: '',
    emailSignup: '',
    passwordSignup: '',
    loading: false,
    loadingSignup: false,
    checked: false
  })

  const { email, loading } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleTab = value => {
    if (value === 0) {
      navigate('/signup')
    } else {
      navigate('/login')
    }
    handleChange('activeTab', value)
  }

  const handleLogin = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email
      }
      const res = await inviteFriend(payload)
      alert('Invitation has been sent')
      handleChange('loading', false)
      navigate(-1)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        alert(`Error: ${errorText[0]}`)
      } else {
        alert(`Error: ${error}`)
      }
    }
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={4} className='loginPaper p-4'>
              <p className='text_primary font-bold font-18 mb-3'>
                Send invite link
              </p>
              <AppInput
                label={'Enter email address'}
                value={email}
                name={'email'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter email'}
              />
              <AppButton
                title={'Send'}
                onClick={handleLogin}
                loading={loading}
                disabled={!email}
                backgroundColor={'rgba(168, 124, 81, 1)'}
                color={'#fff'}
              />
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
