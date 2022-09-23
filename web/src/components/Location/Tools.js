import { Grid, Paper } from '@mui/material'
import React, { Component } from 'react'
import trashIcon from '../../assets/svg/trash.svg'

function Tools ({}) {
  return (
    <Paper>
      <Grid container justifyContent={'space-between'}>
        <Grid item md={6} xs={12} sx={{ p: 1 }}>
          <div className='head'>Site Configuration Tool</div>
          {[0, 0, 0].map((item, index) => (
            <Grid
              container
              justifyContent={'space-between'}
              className={'listItem'}
            >
              <div>Elevator</div>
              <div>
                <img src={trashIcon} />
              </div>
            </Grid>
          ))}
        </Grid>
        <Grid item md={6} xs={12} sx={{ p: 1 }}>
          <div className='head'>Locations</div>
          {[0, 0, 0].map((item, index) => (
            <Grid
              container
              justifyContent={'space-between'}
              className={'listItem'}
            >
              <div>Elevator is functional</div>
              <div>
                <img src={trashIcon} />
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Tools
