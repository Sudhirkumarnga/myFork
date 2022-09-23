// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Checkbox, Typography } from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { useNavigate, useParams } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import { makeBooking } from '../../api/rvlisting'
import moment from 'moment'
import { useSnackbar } from 'notistack'

export default function AddCard ({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const urlParams = new URLSearchParams(window.location.search)
  const from = urlParams.get('from')
  const to = urlParams.get('to')
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    destination_info: '',
    trip_info: '',
    loading: false,
    step: 0
  })

  // useEffect(() => {
  //   if (path) {
  //     handleChange('activeTab', path === '/signup' ? 0 : 1)
  //   }
  //   if (user) {
  //     // navigate('/')
  //   }
  // }, [path, user])

  const {
    name,
    last_name,
    destination_info,
    trip_info,
    phone,
    email,
    loading,
    step
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    if (step === 0) {
      handleChange('step', 1)
    } else {
      _makeBooking()
    }
  }

  const handleBack = () => {
    if (step === 0) {
      navigate(-1)
    } else {
      handleChange('step', 0)
    }
  }

  const _makeBooking = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        pickup_date: moment(Number(from) * 1000).format('YYYY-MM-DD'),
        dropoff_date: moment(Number(to) * 1000).format('YYYY-MM-DD'),
        rv: id,
        destination_info,
        trip_info
      }
      const res = await makeBooking(payload, id)
      handleChange('quote', res?.data)
      enqueueSnackbar(`You have successfully booked!`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
      navigate(`/booking/${res?.data?.id}/payment`)
      handleChange('loading', false)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      enqueueSnackbar(`Error: ${errorText[0]}`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
    }
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={8} className='loginPaper p-4'>
              <p className='font-18 font-bold500 text_primary'>
                {step
                  ? 'Let’s take next step for your booking'
                  : 'Let’s start your booking'}
              </p>
              {step === 0 && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <AppInput
                        label={'Name'}
                        value={name}
                        name={'name'}
                        onChange={handleChange}
                        className='mb-3 mt-3'
                        placeholder={'Enter name'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AppInput
                        className='mb-4 mt-3'
                        label={'Last name'}
                        value={last_name}
                        name={'last_name'}
                        onChange={handleChange}
                        placeholder={'Enter last name'}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ marginTop: -5 }}>
                    <Grid item xs={12} md={6}>
                      <AppInput
                        label={'Phone number'}
                        value={phone}
                        name={'phone'}
                        onChange={handleChange}
                        className='mb-3 mt-3'
                        placeholder={'Enter phone number '}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AppInput
                        className='mb-4 mt-3'
                        label={'Email'}
                        value={email}
                        name={'email'}
                        onChange={handleChange}
                        placeholder={'Enter email'}
                      />
                    </Grid>
                  </Grid>
                  <div className='checkboxDiv mb-4'>
                    <Checkbox
                      defaultChecked
                      className='checkbox1'
                      sx={{
                        color: 'rgba(201, 208, 216, 1)',
                        '&.Mui-checked': {
                          color: 'rgba(168, 124, 81, 1)'
                        }
                      }}
                    />
                    <Typography
                      variant='body2'
                      className='text_primary06 checkboxLabel mt-1'
                    >
                      I certify that I am at least 25 years old at the time of
                      rental and I have a valid driver's license.
                    </Typography>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <AppInput
                    label={'Destination'}
                    value={destination_info}
                    name={'destination_info'}
                    multiline
                    inputWidthFull
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Text (Up to 300 characters)'}
                  />
                  <AppInput
                    label={'About your trip'}
                    value={trip_info}
                    name={'trip_info'}
                    multiline
                    inputWidthFull
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Text (Up to 300 characters)'}
                  />
                </>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={step ? 'Cancel' : 'Back'}
                    onClick={handleBack}
                    color={'rgba(168, 124, 81, 1)'}
                    borderColor={'rgba(168, 124, 81, 1)'}
                    backgroundColor={'#fff'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={step ? 'Confirm' : 'Agree and continue'}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={step ? !destination_info || !trip_info : false}
                    backgroundColor={'rgba(168, 124, 81, 1)'}
                    color={'#fff'}
                  />
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
