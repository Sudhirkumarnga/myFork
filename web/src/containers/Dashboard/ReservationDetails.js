// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { HomeFooter, HomeHeader, AppButton, Layout } from '../../components'
import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'
import { GoogleMap } from '@react-google-maps/api'

export default function ReservationDetails ({}) {
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
            <div>Reservation</div>
          </div>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={12} md={6} className='p-4'>
              <Grid className={'mb-3'} alignItems={'center'}>
                <p className='text_primary font-bold font-18'>
                  Jean-Claude Van Van 2022 Dodge Ram Promaster{' '}
                </p>
                <p className='text_primary font-14 font-bold600 mt-3'>Date</p>
                <p className='text_darkgrey font-14'>05/18/2022 - 05/22/2022</p>
                <p className='text_primary font-14 font-bold600 mt-3'>Price</p>
                <p className='text_darkgrey font-14'>$890</p>
                <p className='text_primary font-14 font-bold600 mt-3'>Status</p>
                <p className='text_darkgrey font-14'>On the road</p>
                <p className='text_primary font-18 font-bold600 mt-3'>
                  Statistics
                </p>
                <p className='text_primary font-14 font-bold600'>
                  Milage per day
                </p>
                <p className='text_darkgrey font-14'>1,760km</p>
                <p className='text_primary font-14 font-bold600 mt-3'>
                  Traveling time
                </p>
                <p className='text_darkgrey font-14'>12 hours : 17 min</p>
                <p className='text_primary font-14 font-bold600'>Static time</p>
                <p className='text_darkgrey font-14'>3 hours : 26 min</p>
                <p className='text_primary font-14 font-bold600'>
                  Aditional cost per milage
                </p>
                <p className='text_darkgrey font-14'>$780</p>
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
                    title={'Complete the rent'}
                    width={200}
                    onClick={() => navigate('/dashboard/invoice/create')}
                    className={'ml-3'}
                    color={COLORS.white}
                    backgroundColor={COLORS.primary}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className='p-4'>
              <GoogleMap
                mapContainerStyle={{
                  width: '95%',
                  height: '97%'
                }}
                center={center}
                zoom={10}
                // onLoad={onLoad}
                // onUnmount={onUnmount}
              ></GoogleMap>
            </Grid>
          </Grid>
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
