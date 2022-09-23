// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import {
  AppButton,
  AppInput,
  HomeFooter,
  HomeHeader,
  Layout
} from '../../components'
import { Grid, Tab, Tabs, Typography, Box, Checkbox } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createFeedback, loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'

export default function FeedBack ({}) {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    activeTab: 0,
    email: '',
    password: '',
    emailSignup: '',
    passwordSignup: '',
    message: '',
    loading: false,
    loadingSignup: false,
    checked: false
  })

  const {
    activeTab,
    email,
    password,
    loading,
    emailSignup,
    passwordSignup,
    loadingSignup,
    checked,
    message
  } = state

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
        email,
        password
      }
      const res = await loginUser(payload)
      localStorage.setItem('token', res?.data?.token)
      localStorage.setItem('user', JSON.stringify(res?.data?.user))
      handleChange('loading', false)
      setUser(res?.data?.user)
      navigate('/')
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

  const handleSignup = async () => {
    try {
      handleChange('loadingSignup', true)
      const payload = {
        message
      }
      const res = await createFeedback(payload)
      handleChange('loadingSignup', false)
      handleChange('message', '')
      alert('Feedback has been submitted')
      navigate(-1)
    } catch (error) {
      handleChange('loadingSignup', false)
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
      <Layout>
        <div className='container minheight80vh'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={4} className='loginPaper p-4'>
              <p className='text_primary text-center font-bold font-18 mb-3'>Send Feedback</p>
              <AppInput
                label={'Message'}
                value={message}
                name={'message'}
                multiline
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Text'}
              />
              <AppButton
                title={'Submit '}
                onClick={handleSignup}
                loading={loadingSignup}
                disabled={!message}
                backgroundColor={COLORS.primary}
                color={'#fff'}
              />
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
