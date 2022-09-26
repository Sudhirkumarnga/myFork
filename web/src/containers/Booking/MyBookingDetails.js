// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Checkbox, Typography, Divider } from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { useNavigate, useParams } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import { makeBooking } from '../../api/rvlisting'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import AppTable from '../../components/AppTable'
import { COLORS } from '../../constants'

export default function MyBookingDetails ({}) {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    categories: '',
    searchText: ''
  })

  const { loading, searchText, categories } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={12} md={12} className='loginPaper p-4'>
              <Grid className={'mb-3'} alignItems={'center'}>
                <p className='text_primary font-bold font-18'>
                  Jean-Claude Van Van 2022 Dodge Ram Promaster{' '}
                </p>
                <p className='text_primary font-14 font-bold600'>Date</p>
                <p className='text_darkgrey font-14'>05/18/2022 - 05/22/2022</p>
                <p className='text_primary font-14 font-bold600 mt-3'>
                  Destination
                </p>
                <p className='text_darkgrey font-14'>Orlando, FL</p>
                <p className='text_primary font-14 font-bold600'>Price</p>
                <p className='text_darkgrey font-14'>$890</p>
                <Grid container sx={{ mt: 3 }} spacing={2}>
                  <AppButton
                    title={'Back'}
                    width={150}
                    backgroundColor={COLORS.white}
                    className={'ml-3'}
                    color={COLORS.primary}
                    borderColor={COLORS.primary}
                  />
                  <AppButton
                    title={'Cancel booking'}
                    width={200}
                    className={'ml-3'}
                    color={COLORS.white}
                    backgroundColor={COLORS.primary}
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
