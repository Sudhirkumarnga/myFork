// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useContext, useState } from 'react'
import {
  HomeFooter,
  HomeHeader,
  AppButton,
  Layout
} from '../../components'
import { Divider, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { COLORS } from '../../constants'
import Bus1 from '../../assets/images/Bus1.png'
import heartWhite from '../../assets/svg/heartWhite.svg'

export default function Listings ({}) {
  const { listRVS } = useContext(AppContext)


  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div>List of all RVs</div>
            <div className='row'>
              <AppButton
                title={'Add new RV'}
                backgroundColor={COLORS.primary}
                color={COLORS.white}
                height={40}
                width={150}
              />
              <AppButton
                title={'Remove listing'}
                borderColor={COLORS.primary}
                backgroundColor={COLORS.white}
                className={'ml-3 mr-3'}
                color={COLORS.primary}
                height={40}
                width={150}
              />
            </div>
          </div>
          <Divider className='mt-3' />
          <Grid spacing={2} container sx={{ p: 2 }}>
            {listRVS?.map((rv, index) => (
              <Grid
                key={index}
                item
                md={3}
                sm={6}
                xs={12}
                sx={{ cursor: 'pointer' }}
                // onClick={() => navigate(`/rv/${rv?.id}`)}
              >
                <div className='paperList'>
                  <div className='heartWhite'>
                    <img src={heartWhite} />
                  </div>
                  <img
                    src={rv.images?.length > 0 ? rv.images[0]?.image : Bus1}
                    className={'rvImage1'}
                  />
                  <div className='listallRVcard'>
                    <div className='text_primary mb-2 font-18'>{rv?.name}</div>
                    <div className='rowBetween'>
                      <div className=''>
                        ${rv?.per_night_price}/
                        <span className='font-14'>night</span>
                      </div>
                      <AppButton
                        title={'Edit'}
                        borderColor={COLORS.primary}
                        backgroundColor={COLORS.white}
                        color={COLORS.primary}
                        height={40}
                        width={80}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
