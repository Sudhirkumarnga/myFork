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
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPlans, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import { useSnackbar } from 'notistack'
import { Close } from '@mui/icons-material'
import {
  useStripe,
  CardElement,
  useElements,
  CardNumberElement
} from '@stripe/react-stripe-js'
import { createPayment, makePayment } from '../../api/rvlisting'
import CreditCardInput from 'react-credit-card-input'

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true
}

export default function Checkout ({}) {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const stripe = useStripe()
  const { id } = useParams()
  const elements = useElements()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    isModal: false,
    checked: '',
    name: '',
    selected: null
  })

  const { loading, cvc, expiry, number, focus, name, selected } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getPlans()
  }, [])

  const handleClose = () => {
    handleChange('isModal', false)
  }

  const _getPlans = async () => {
    try {
      handleChange('loading', true)
      const res = await getPlans()
      handleChange('plans', res?.data?.results)
      if (res?.data?.results?.length > 0) {
        const selected = res?.data?.results?.filter(e => e?.id === id)
        handleChange('selected', selected)
      }
      handleChange('loading', false)
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

  const handlePayment = async () => {
    try {
      handleChange('loading', true)
      const b = expiry.split('/')
      const payload = {
        payment_method: {
          type: 'card',
          card: {
            number,
            exp_month: Number(b[0]),
            exp_year: '20' + Number(b[1]),
            cvc
          }
        }
      }
      const res = await createPayment(payload)
      _makePayment(res?.data?.payment_method?.id)
      // handleChange('loading', false)
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
        plan_id: id
      }
      const res = await makePayment(payload)
      handleChange('number', '')
      handleChange('expiry', '')
      handleChange('cvc', '')
      handleChange('name', '')
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

  console.warn('expiry', expiry)

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
                  <p className='font-14 mb-4'>{selected?.description}</p>
                  {/* <ul>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                    <li>Ut enim ad minim veniam</li>
                  </ul> */}
                </Grid>
                <Grid item xs={6} className=''>
                  <div className=''>
                    <Typography variant='h6' className='checkboxLabel'>
                      Card Details
                    </Typography>
                    <div className='cardBox'>
                      {/* <Cards
                        cvc={cvc}
                        expiry={expiry}
                        preview={false}
                        focused={focus}
                        // name={name}
                        number={number}
                      /> */}
                      <CreditCardInput
                        containerStyle={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          marginTop: -10
                        }}
                        fieldStyle={{ backgroundColor: 'transparent' }}
                        inputStyle={{
                          backgroundColor: 'transparent',
                          marginTop: 5
                        }}
                        cardNumberInputProps={{
                          value: number,
                          onChange: value =>
                            handleChange('number', value.target.value)
                        }}
                        cardExpiryInputProps={{
                          value: expiry,
                          onChange: e => handleChange('expiry', e.target.value)
                        }}
                        cardCVCInputProps={{
                          value: cvc,
                          onChange: e => handleChange('cvc', e.target.value)
                        }}
                        fieldClassName='input'
                      />
                      {/* <CardNumberElement onChange={(value)=>console.log('value',value)} /> */}
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
