// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useContext, useState } from 'react'
import {
  HomeFooter,
  AppInput,
  HomeHeader,
  AppButton,
  Layout
} from '../../components'
import { Divider, Grid } from '@mui/material'
import { COLORS } from '../../constants'

export default function NewMessage ({}) {
  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div>Inbox / new message</div>
          </div>
          <Divider className='mt-3' />
          <Grid container spacing={2} className='rowBetween mt-3 mb-3 ph-3'>
            <Grid item xs={12} md={6}>
              <AppInput placeholder={'Robert Bailey'} label={'To:'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppInput placeholder={'Enter text'} label={'Title:'} />
            </Grid>
          </Grid>
          <Divider className='mt-3' />
          <Grid container className='mt-3 mb-3 ph-3'>
            <AppInput height={300} multiline placeholder={'Enter message'} />
          </Grid>
          <Grid className='rowFlexend mt-3 mb-3 ph-3'>
            <AppButton
              title={'Back'}
              className={'mr-3'}
              borderColor={COLORS.primary}
              backgroundColor={COLORS.white}
              color={COLORS.primary}
              height={40}
              width={120}
            />
            <AppButton
              title={'Send'}
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
