// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeHeader, MainFooter } from '../../components'
import {
  Grid,
  Typography,
  Checkbox,
  Divider,
  Radio,
  Modal,
  Box,
  IconButton
} from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { Link, useNavigate } from 'react-router-dom'
import { getPlans, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import { useSnackbar } from 'notistack'
import { Close } from '@mui/icons-material'
import { useStripe, CardElement, useElements } from '@stripe/react-stripe-js'
import { makePayment } from '../../api/rvlisting'

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true
}

export default function Checkout ({}) {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    isModal: false,
    checked: '',
    name: '',
    plans: []
  })

  const { loading, isModal, name, checked } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
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
        payment_method,
        billing_details: {
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
      // navigate('/')
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
      <section className='bg-white'>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} className=''>
              <div className='font-24 mb-4 font-bold'>Checkout</div>
              <Divider />
              <Grid container spacing={2} className='mt-4 mb-4'>
                <Grid item xs={6} className=''>
                  <p className='font-14 mb-4'>
                    You have selected Basic offer. Lorem ipsum dolor $9.99 per
                    yearsit amet, consectetur iscing elit, sed do eiusmod tempor
                    incididunt ut labre et dolore magna You have selected Basic
                    offer. Lorem ipsum dolor $9.99 per yearsit amet, consectetur
                    iscing elit, sed do eiusmod tempor incididunt ut labre et
                    dolore magna{' '}
                  </p>
                  <ul>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                  </ul>
                </Grid>
                <Grid item xs={6} className=''>
                  <div className=''>
                    <Typography variant='h6' className='checkboxLabel'>
                      Card Details
                    </Typography>
                    <div className='cardBox'>
                      <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    <Grid container spacing={2} sx={{ marginTop: -5 }}>
                      <Grid item xs={12} md={12}>
                        <AppInput
                          className='mb-4 mt-3'
                          value={name}
                          inputWidthFull
                          name={'name'}
                          onChange={handleChange}
                          placeholder={'Card Holder Name'}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
              <Grid container justifyContent={'flex-end'}>
                <AppButton
                  width={350}
                  title={'Confirm and pay'}
                  onClick={handlePayment}
                  loading={loading}
                  disabled={!name}
                  backgroundColor={COLORS.primary}
                  color={'#fff'}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>
    </div>
  )
}
