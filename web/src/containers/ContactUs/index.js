// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { MainFooter, HomeHeader } from '../../components'
import Phone from '../../assets/svg/Phone.svg'
import Globe from '../../assets/svg/Globe.svg'
import Mail from '../../assets/svg/Mail.svg'
import WorkHours from '../../assets/svg/WorkHours.svg'
import { Grid } from '@mui/material'

export default function ContactUs ({}) {
  return (
    <div>
      <HomeHeader />
      <section className='mt-5 bg-white'>
        <div className='container height100vh'>
          <Grid container>
            <Grid xs={12} item className='mb-5'>
              <div className='text-center font-24 text_primary font-bold'>
                Contact
              </div>
              <div className='text-center font-14 text_primary'>
                If you need help with your account or have a question for us,
                we’d be happy to help.
              </div>
            </Grid>
            <Grid container justifyContent={'space-around'} className='mt-5'>
              <Grid item md={5} xs={12} item className='contactBox'>
                <img src={Phone} className={'mr-3'} />
                <div>
                  <div className='text_primary mb-2 font-weight-bold'>
                    Phone
                  </div>
                  <div className='text_secondary'>+1992883733</div>
                </div>
              </Grid>
              <Grid item md={5} xs={12} item className='contactBox'>
                <img src={Mail} className={'mr-3'} />
                <div>
                  <div className='text_primary  mb-2 font-weight-bold'>
                    Email
                  </div>
                  <div className='text_secondary'>name@email.com</div>
                </div>
              </Grid>
              <Grid item md={5} xs={12} item className='contactBox'>
                <img src={Globe} className={'mr-3'} />
                <div>
                  <div className='text_primary mb-2 font-weight-bold'>
                    Address
                  </div>
                  <div className='text_secondary'>
                    125 Nottingham Road, Stapleford, Nottingham,
                    Nottinghamshire, NG9 8AT.
                  </div>
                </div>
              </Grid>
              <Grid item md={5} xs={12} item className='contactBox'>
                <img src={WorkHours} className={'mr-3'} />
                <div>
                  <div className='text_primary mb-2 font-weight-bold'>
                    Work Hours
                  </div>
                  <div className='text_secondary'>9:00 - 18:00</div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>
      <MainFooter />
    </div>
  )
}
