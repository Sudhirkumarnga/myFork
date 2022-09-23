// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { Layout } from '../../components'
import { Button, Divider, Grid } from '@mui/material'
import Cloud_Download from '../../assets/svg/Cloud_Download.svg'

export default function Notifications ({}) {
  return (
    <div>
      <Layout>
        <div className='container minheight80vh'>
          <Grid container spacing={2} className='rowBetween mb-4 ph-3'>
            {[1, 2, 3].map((item, index) => (
              <Grid key={index} item xs={12}>
                <div className='ph-0'>
                  <div className='rowBetween align-items-center'>
                    <div className='d-flex align-items-center'>
                      <div className='notificationImage' />
                      <div>
                        <div className='font-bold'>Staff</div>
                        <div className='font-12'>Portfolio Updated</div>
                      </div>
                    </div>
                    <div className='d-flex align-items-center'>
                      <span className=''>Today</span>
                    </div>
                  </div>
                  <Divider className='mt-4 mb-2' />
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
