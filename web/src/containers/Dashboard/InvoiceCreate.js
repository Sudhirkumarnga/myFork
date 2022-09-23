// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import {
  HomeFooter,
  HomeHeader,
  AppButton,
  Layout,
  AppInput
} from '../../components'
import { Divider, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'

export default function InvoiceCreate ({}) {
  const navigate = useNavigate()
  const center = {
    lat: -3.745,
    lng: -38.523
  }
  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div className='text_primary font-bold font-18'>
              The Gray House - Glacier RV Edition Ice House
            </div>
          </div>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={6} md={4} className='p-4'>
              <Grid className={'mb-3'} alignItems={'center'}>
                <p className='text_primary font-14 font-bold600 mt-3'>Name</p>
                <p className='text_darkgrey font-14'>James</p>
                <p className='text_primary font-14 font-bold600 mt-3'>
                  Last name
                </p>
                <p className='text_darkgrey font-14'>Smith</p>
                <p className='text_primary font-14 font-bold600 mt-3'>
                  Phone number
                </p>
                <p className='text_darkgrey font-14'>(789) 567- 7867</p>
                <p className='text_primary font-14 font-bold600'>Email</p>
                <p className='text_darkgrey font-14'>jamessmith@gmail.com</p>
                <p className='text_primary font-14 font-bold600 mt-3'>
                  Destination
                </p>
                <p className='text_darkgrey font-14'>Miami, FL</p>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} className='p-4'>
              <p className='text_primary font-14 font-bold600 mt-3'>
                About your trip
              </p>
              <p className='text_darkgrey font-14'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                congue porttitor quam, nec euismod metus dapibus vitae. Donec
                sodales pretium ultrices. Vivamus efficitur nunc vitae metus
                mollis.
              </p>
              <p className='text_primary font-14 font-bold600 mt-3'>
                Mileage charges
              </p>
              <p className='text_darkgrey font-14'>$780</p>
            </Grid>
            <Grid item xs={12} sm={6} md={4} className='p-4'>
              <AppInput placeholder={'Text'} label='Generator usage' />
              <AppInput placeholder={'Text'} label='Other costs 1' />
              <AppInput placeholder={'Text'} label='Other costs 2' />
              <AppInput placeholder={'Text'} label='Other costs 3' />
            </Grid>
          </Grid>
          <Grid className='ph-3'>
            <Divider />
            <Grid
              container
              sx={{ minHeight: 50 }}
              alignItems={"center"}
              justifyContent={'space-between'}
            >
              <div className='text_primary font-14 font-bold600'>Total price</div>
              <div className='text_secondary font-16 font-bold600'>$1,610.00</div>
            </Grid>
            <Divider />
          </Grid>
          <Grid
            container
            justifyContent={'flex-end'}
            sx={{ mt: 4 }}
            spacing={2}
          >
            <AppButton
              title={'Cancel'}
              width={150}
              backgroundColor={COLORS.white}
              className={'ml-3'}
              color={COLORS.primary}
              borderColor={COLORS.primary}
            />
            <AppButton
              title={'Send invoice'}
              width={200}
              className={'ml-3 mr-3'}
              color={COLORS.white}
              backgroundColor={COLORS.primary}
            />
          </Grid>
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
