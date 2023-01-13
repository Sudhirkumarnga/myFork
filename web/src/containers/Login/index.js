// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeHeader, MainFooter } from '../../components'
import { Grid, Typography, Box, Checkbox } from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { ReactComponent as LoginBG } from '../../assets/svg/loginBG.svg'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import { useSnackbar } from 'notistack'

export default function Login ({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { user, setUser, _getProfile } = useContext(AppContext)
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

  useEffect(() => {
    if (path) {
      handleChange('activeTab', path === '/signup' ? 0 : 1)
    }
    if (user) {
      navigate('/')
    }
  }, [path, user])

  const { email, password, loading, checked } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleLogin = async () => {
    try {
      handleChange('  ', true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      localStorage.setItem('token', res?.data?.key)
      localStorage.setItem('user', JSON.stringify(res?.data?.user))
      handleChange('loading', false)
      // _getProfile()
      // setUser(res?.data?.user)
      enqueueSnackbar(`Login Successful`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
      navigate('/subscription')
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
    <Grid container className='authSection'>
      <Grid item xs={12} md={8} className='LoginBG' />
      <Grid item xs={12} md={4} className='divCenter loginRight'>
        <div className=' text-center font-30 font-bold'>Welcome back</div>
        <div className='text_grey font-14'>Login to your account</div>
        <div className='width80'>
          <AppInput
            value={email}
            name={'email'}
            onChange={handleChange}
            className='mb-3 mt-3'
            placeholder={'Email Address'}
          />
          <AppInput
            className='mb-4 mt-3'
            value={password}
            type={'password'}
            name={'password'}
            onChange={handleChange}
            postfix={<img src={eyeIcon} width={20} className={'c-pointer'} />}
            placeholder={'********'}
          />
          <div className='flex_end mb-4'>
            <div
              className='c-pointer'
              onClick={() => navigate('/forgot-password')}
            >
              <p className='text_primary'>Forgot Password?</p>
            </div>
          </div>
          <AppButton
            title={'Login'}
            onClick={handleLogin}
            loading={loading}
            disabled={!email || !password}
            backgroundColor={COLORS.primary}
            color={'#fff'}
          />
        </div>
      </Grid>
    </Grid>
  )
}
