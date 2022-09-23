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
import { loginUser, setPassword, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import eyeIcon from '../../assets/svg/eye.svg'
import { COLOR } from 'rsuite/esm/utils'
import { COLORS } from '../../constants'

export default function ChangePassword ({}) {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    activeTab: 0,
    email: '',
    oldpassword: '',
    password_1: '',
    password_2: '',
    loading: false,
    loadingSignup: false,
    checked: false
  })

  const {
    activeTab,
    email,
    oldpassword,
    loading,
    emailSignup,
    passwordSignup,
    loadingSignup,
    password_1,
    password_2
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

  const handleSignup = async () => {
    try {
      handleChange('loadingSignup', true)
      const payload = {
        password_1,
        password_2
      }
      const res = await setPassword(payload)
      alert('Password has been changed')
      handleChange('loadingSignup', false)
      navigate('/')
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
              <p className='text_primary text-center font-bold font-18 mb-3'>
                Change password
              </p>
              <AppInput
                className='mb-4 mt-3'
                value={oldpassword}
                type={'password'}
                name={'oldpassword'}
                onChange={handleChange}
                label={'Current Password'}
                postfix={
                  <img src={eyeIcon} width={20} className={'c-pointer'} />
                }
                placeholder={'********'}
              />
              <AppInput
                className='mb-4 mt-3'
                value={password_1}
                type={'password'}
                name={'password_1'}
                onChange={handleChange}
                label={'New password'}
                postfix={
                  <img src={eyeIcon} width={20} className={'c-pointer'} />
                }
                placeholder={'********'}
              />
              <AppInput
                className='mb-4 mt-3'
                value={password_2}
                type={'password'}
                name={'password_2'}
                onChange={handleChange}
                label={'Confirm Password'}
                postfix={
                  <img src={eyeIcon} width={20} className={'c-pointer'} />
                }
                placeholder={'********'}
              />
              <AppButton
                title={'Submit'}
                onClick={handleSignup}
                loading={loadingSignup}
                disabled={!oldpassword || !password_1 || !password_2}
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
