// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { HomeFooter, HomeHeader, Layout } from '../../components'
import { Divider, Grid, Typography } from '@mui/material'

export default function Matrics ({}) {
  const comments = [
    {
      title: 'James Smithson',
      description:
        'Fusce pulvinar varius urna eu tincidunt. Vestibulum non ex ut nisl eleifend.  '
    },
    {
      title: 'James Smithson',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis, dui id mattis elementum, tellus justo maximus mauris, quis dignissim velit tortor sit amet lectus. Quisque id turpis convallis sapien auctor maximus quis eu enim. Nulla commodo faucibus sodales. Praesent lobortis mi et justo vehicula, id consequat sem lobortis. '
    },
    {
      title: 'James Smithson',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis, dui id mattis elementum, tellus justo maximus mauris, quis dignissim velit tortor sit amet lectus. Quisque id turpis convallis sapien auctor maximus quis eu enim. Nulla commodo faucibus sodales. Praesent lobortis mi et justo vehicula, id consequat sem lobortis.'
    },
    {
      title: 'James Smithson',
      description:
        'Fusce pulvinar varius urna eu tincidunt. Vestibulum non ex ut nisl eleifend... '
    },
    {
      title: 'James Smithson',
      description:
        'Fusce pulvinar varius urna eu tincidunt. Vestibulum non ex ut nisl eleifend... '
    },
    {
      title: 'James Smithson',
      description:
        'Fusce pulvinar varius urna eu tincidunt. Vestibulum non ex ut nisl eleifend... '
    },
    {
      title: 'James Smithson',
      description:
        'Fusce pulvinar varius urna eu tincidunt. Vestibulum non ex ut nisl eleifend... '
    }
  ]

  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div>Matrics</div>
          </div>
          <Divider className='mt-3' />
          <Grid container className=''>
            <Grid item xs={12} md={4} className={'border-right'}>
              <Grid item xs={12} className={'border-bottom'}>
                <p className='withdrawAmount mb-2 mt-3 ph-3'>175</p>
                <Typography className='text_primary mb-4 ph-3'>
                  Number of completed bookings
                </Typography>
              </Grid>
              <Grid item xs={12} className={'border-bottom'}>
                <p className='withdrawAmount mb-2 mt-3 ph-3'>175</p>
                <Typography className='text_primary mb-4 ph-3'>
                  Number of completed bookings
                </Typography>
              </Grid>
              <Grid item xs={12} className={'border-bottom'}>
                <p className='withdrawAmount mb-2 mt-3 ph-3'>175</p>
                <Typography className='text_primary mb-4 ph-3'>
                  Number of completed bookings
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} sx={{ pt: 2 }}>
              <Typography className='text_primary mb-2 pl-3'>
                All comments
              </Typography>
              {comments.map((comment, index) => (
                <div key={index}>
                  <div className=' mt-4 mb-4 pl-3'>
                    <div className='messageTitle'>{comment.title}</div>
                    <div className='messageDes'>{comment.description}</div>
                  </div>
                  <Divider className='fullDivider' />
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
