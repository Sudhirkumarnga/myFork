// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { Layout } from '../../components'
import { Button, Divider, Grid } from '@mui/material'
import Cloud_Download from '../../assets/svg/Cloud_Download.svg'

export default function Offers ({}) {
  return (
    <div>
      <Layout>
        <div className='container minheight80vh'>
          <Grid container spacing={2} className='rowBetween mb-4 ph-3'>
            {[1, 2, 3].map((item, index) => (
              <Grid key={index} item xs={12}>
                <div className='ph-0'>
                  <div className='rowBetween'>
                    <Button variant='contained'>Offer {item}</Button>
                    <div className='d-flex align-items-center'>
                      <span className='mr-2 text_secondary'>Download</span>
                      <img src={Cloud_Download} />
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
