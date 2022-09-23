// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Checkbox, Typography } from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { useNavigate, useParams } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useStripe, CardElement, useElements } from '@stripe/react-stripe-js'
import { makePayment } from '../../api/rvlisting'
import { useSnackbar } from 'notistack'
import { COUNTRY } from '../../constants/country'

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true
}
export default function Booking ({}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const stripe = useStripe()
  const elements = useElements()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    line1: '',
    postal_code: '',
    loading: false
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
    phone,
    email,
    loading,
    city,
    country,
    line1,
    postal_code
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    handlePayment()
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handlePayment = async () => {
    try {
      handleChange('loading', true)
      const cardElement = elements.getElement(CardElement)
      stripe
        .createPaymentMethod({
          type: 'card',
          card: cardElement
        })
        .then(result => {
          console.warn('result', result?.paymentMethod?.id)
          if (result?.paymentMethod?.id) {
            _makePayment(result?.paymentMethod?.id)
          } else {
            alert(result.error.message)
            handleChange('loading', false)
          }
        })
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

  const _makePayment = async payment_method => {
    try {
      const payload = {
        booking_id: id,
        payment_method,
        billing_details: {
          address: {
            city,
            country,
            line1,
            postal_code
          },
          name
        }
      }
      const res = await makePayment(payload)
      enqueueSnackbar(`Payment has been submitted!`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
      handleChange('loading', false)
      navigate('/')
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

  const yearOptions = () => {
    return (
      <>
        <option value={''}>Select</option>
        {COUNTRY.map((country, index) => (
          <option key={index} value={country.code}>
            {country.name}
          </option>
        ))}
      </>
    )
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={8} className='loginPaper p-4'>
              <p className='font-18 font-bold600 text_primary'>Add card</p>
              <Grid container>
                <div className='cardBox'>
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: -5 }}>
                <Grid item xs={12} md={12}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'Card holder full name'}
                    value={name}
                    inputWidthFull
                    name={'name'}
                    onChange={handleChange}
                    placeholder={'Your name'}
                  />
                </Grid>
              </Grid>

              <p className='font-18 font-bold600 text_primary'>
                Billing address
              </p>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppInput
                    label={'Street'}
                    inputWidthFull
                    value={line1}
                    name={'line1'}
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Enter street'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'City'}
                    value={city}
                    inputWidthFull
                    name={'city'}
                    onChange={handleChange}
                    placeholder={'City'}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: -5 }}>
                <Grid item xs={12} md={6}>
                  <AppInput
                    label={'ZIP'}
                    value={postal_code}
                    name={'postal_code'}
                    inputWidthFull
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Enter ZIP '}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'Country'}
                    select
                    selectOptions={yearOptions()}
                    inputWidthFull
                    value={country}
                    name={'country'}
                    onChange={handleChange}
                    placeholder={'Name of the country'}
                  />
                </Grid>
              </Grid>
              <div className='hline' />
              <div className='orTextDiv1'>
                <div className='orTextCard'>OR</div>
              </div>
              <p className='font-18 font-bold600 text_primary'>
                Add bank account
              </p>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppInput
                    label={'Bank name'}
                    value={name}
                    name={'name'}
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Enter bank name'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'Account name'}
                    value={last_name}
                    name={'last_name'}
                    onChange={handleChange}
                    placeholder={'Enter account name'}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: -5 }}>
                <Grid item xs={12} md={6}>
                  <AppInput
                    label={'Account number'}
                    value={phone}
                    name={'phone'}
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Enter account number '}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'Routing number'}
                    value={email}
                    name={'email'}
                    onChange={handleChange}
                    placeholder={'Enter rounting number'}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: -5 }}>
                <Grid item xs={12} md={6}>
                  <AppInput
                    label={'IBAN'}
                    value={phone}
                    name={'phone'}
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Enter IBAN'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppInput
                    className='mb-4 mt-3'
                    label={'SWIFT'}
                    value={email}
                    name={'email'}
                    onChange={handleChange}
                    placeholder={'Enter SWIFT'}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={'Cancel'}
                    // onClick={handleBack}
                    color={'rgba(168, 124, 81, 1)'}
                    borderColor={'rgba(168, 124, 81, 1)'}
                    backgroundColor={'#fff'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={'Save'}
                    // onClick={handleSubmit}
                    // loading={loading}
                    // disabled={!email || !password}
                    backgroundColor={'rgba(168, 124, 81, 1)'}
                    color={'#fff'}
                  />
                </Grid>
              </Grid>
              <p className='font-18 font-bold600 text_primary mt-2'>
                Cancellation Policy
              </p>
              <p className='font-14 text_primary mb-5'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent cursus pretium augue, id posuere nisl vehicula
                hendrerit. Phasellus elementum purus ligula, et scelerisque diam
                viverra eu. Phasellus consectetur commodo volutpat.
              </p>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={'Back'}
                    onClick={handleBack}
                    color={'rgba(168, 124, 81, 1)'}
                    borderColor={'rgba(168, 124, 81, 1)'}
                    backgroundColor={'#fff'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={'Confirm'}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={
                      !name || !city || !country || !postal_code || !line1
                    }
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
