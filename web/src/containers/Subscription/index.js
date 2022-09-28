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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
}

export default function Subscription ({}) {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    isModal: false,
    checked: '',
    checkedPlan: null,
    plans: []
  })

  const { loading, isModal, plans, checked, checkedPlan } = state

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

  return (
    <div>
      <HomeHeader />
      <section className='bg-white'>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} className=''>
              <div className='font-24 mb-4 font-bold'>
                Choose your subscription
              </div>
              <Divider />
              <Grid container spacing={2} className='mt-4 mb-4'>
                {plans?.map((plan, index) => (
                  <Grid key={index} item xs={6} className=''>
                    <div className='teirBox'>
                      <Typography variant='h6' className='checkboxLabel'>
                        {plan?.description}
                      </Typography>
                      {/* <div className='checkboxDiv mt-1'>
                        <Radio
                          checked={checked === 'teir1'}
                          onClick={() => handleChange('checked', 'teir1')}
                          className='checkbox1'
                          sx={{
                            color: 'rgba(201, 208, 216, 1)',
                            '&.Mui-checked': {
                              color: '#06726A'
                            }
                          }}
                        />
                      </div> */}
                      <div className='checkboxDiv mt-1'>
                        <div>
                          <div className='font-30'>{plan?.amount}</div>
                          <div
                            className='text-right text-grey'
                            style={{ marginTop: -8 }}
                          >
                            $/{plan?.interval}
                          </div>
                        </div>
                        <Radio
                          checked={checked === plan?.id}
                          onClick={() => {
                            handleChange('checked', plan?.id)
                            handleChange('checkedPlan', plan)
                          }}
                          className='checkbox1'
                          sx={{
                            color: 'rgba(201, 208, 216, 1)',
                            '&.Mui-checked': {
                              color: '#06726A'
                            }
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                ))}
                {/* <Grid item xs={6} className=''>
                  <div className='teirBox'>
                    <Typography variant='h6' className='checkboxLabel'>
                      Tier 1-10
                    </Typography>
                    <div className='checkboxDiv mt-1'>
                      <div>
                        <div className='font-30'>18.99</div>
                        <div
                          className='text-right text-grey'
                          style={{ marginTop: -8 }}
                        >
                          $/year
                        </div>
                      </div>
                      <Radio
                        checked={checked === 'teir2'}
                        onClick={() => handleChange('checked', 'teir2')}
                        className='checkbox1'
                        sx={{
                          color: 'rgba(201, 208, 216, 1)',
                          '&.Mui-checked': {
                            color: '#06726A'
                          }
                        }}
                      />
                    </div>
                  </div>
                </Grid> */}
              </Grid>
              <Grid container justifyContent={'flex-end'}>
                <AppButton
                  width={350}
                  title={'Subscribe'}
                  onClick={() => handleChange('isModal', true)}
                  loading={loading}
                  disabled={!checked}
                  backgroundColor={COLORS.primary}
                  color={'#fff'}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Modal
          open={isModal}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Grid container justifyContent={'flex-end'}>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
            <p className='font-24 font-bold capitalize'>
              {checkedPlan?.interval} offer
            </p>
            <p className='font-14 mb-4 mt-4'>{checkedPlan?.description}</p>
            {/* <ul>
              <li>Ut enim ad minim veniam</li>
              <li>Ut enim ad minim veniam</li>
              <li>Ut enim ad minim veniam</li>
              <li>Ut enim ad minim veniam</li>
            </ul> */}
            <AppButton
              className={'mt-4'}
              title='Subscribe'
              onClick={() => navigate(`/checkout/${checkedPlan?.id}`)}
              color={'#fff'}
              backgroundColor={COLORS.primary}
            />
          </Box>
        </Modal>
      </section>
    </div>
  )
}
