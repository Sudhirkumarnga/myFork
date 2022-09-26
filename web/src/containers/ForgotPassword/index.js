// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react'
import { AppButton, AppInput, HomeHeader, MainFooter } from '../../components'
import { Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { forgotpassword, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import { useSnackbar } from 'notistack'

export default function ForgotPassword ({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    activeTab: 0,
    email: '',
    password: '',
    passwordSignup: '',
    loading: false,
    checked: false
  })

  const {
    activeTab,
    email,
    password,
    loading,
    passwordSignup,
    checked
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSignup = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email
      }
      const res = await forgotpassword(payload)
      handleChange('loading', false)
      enqueueSnackbar(`Email has been sent`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
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

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={4} className='loginPaper p-4'>
              <p className='text_primary text-center font-bold font-18 mb-3'>
                Forgot Password
              </p>
              <AppInput
                label={'Enter'}
                value={email}
                name={'email'}
                onChange={handleChange}
                className='mb-4 mt-3'
                placeholder={'Enter email'}
              />
              <AppButton
                title={'Reset password '}
                onClick={handleSignup}
                loading={loading}
                disabled={!email}
                backgroundColor={COLORS.primary}
                color={'#fff'}
              />
              <div className='mt-4 text-center'>
                <Link
                  to={'/login'}
                  className='text-center font-14  text_secondary c-pointer'
                >
                  Remember Your Password? Sign In
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </section>
      <MainFooter />
    </div>
  )
}
