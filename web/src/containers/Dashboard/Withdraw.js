// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import {
  HomeFooter,
  AppInput,
  HomeHeader,
  AppButton,
  Layout
} from '../../components'
import { Divider, Grid } from '@mui/material'
import { COLORS } from '../../constants'

export default function Withdraw ({}) {
  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div>Withdraw money</div>
          </div>
          <Divider className='mt-3' />
          <Grid container spacing={2} className='rowBetween mt-3 mb-3 ph-3'>
            <Grid item xs={12} md={4}>
              <AppInput placeholder={'Enter bank name'} label={'Bank name'} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                placeholder={'Enter account name'}
                label={'Account name'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                placeholder={'Enter account number'}
                label={'Account number'}
                type={'number'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                placeholder={'Enter rounting number'}
                label={'Routing number'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput placeholder={'Enter IBAN'} label={'IBAN'} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput placeholder={'SWIFT'} label={'Enter SWIFT'} />
            </Grid>
          </Grid>
          <Grid className='rowFlexend mt-3 mb-3 ph-3'>
            <AppButton
              title={'Cancel'}
              className={'mr-3'}
              borderColor={COLORS.primary}
              backgroundColor={COLORS.white}
              color={COLORS.primary}
              height={40}
              width={120}
            />
            <AppButton
              title={'Save'}
              backgroundColor={COLORS.primary}
              color={COLORS.white}
              height={40}
              width={120}
            />
          </Grid>
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
