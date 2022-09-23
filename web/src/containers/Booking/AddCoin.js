// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react'
import { AppInput, Layout } from '../../components'
import { Grid, Divider, Button, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import saerchIcon from '../../assets/svg/saerchIcon.svg'
import callIcon from '../../assets/svg/call.svg'

export default function AddCoin ({}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    categories: '',
    searchText: ''
  })

  const { loading } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  return (
    <div>
      <Layout>
        <div className='container minheight80vh'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={12} md={12} className=''>
              <div className='mb-4 font-bold'>Build My Portfolio</div>
              <Grid
                container
                // justifyContent={'center'}
                className={'mb-3'}
                alignItems={'center'}
              >
                <div
                  style={{
                    borderRadius: 30,
                    border: `1px solid ${COLORS.primary}`,
                    padding: 5
                  }}
                >
                  <Button
                    variant='contained'
                    // onClick={() => navigate('/dashboard/spot-price')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.primary,
                      textTransform: 'capitalize'
                    }}
                  >
                    Add Coins Manually
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => navigate('/dashboard/portfolio/add/new')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.retail,
                      ml: 1,
                      mr: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    Upload Invoice
                  </Button>

                  <Button
                    variant='contained'
                    // onClick={() => navigate('/dashboard/makeoffers')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.offer,
                      textTransform: 'capitalize'
                    }}
                  >
                    <img src={callIcon} />
                    Call Now
                  </Button>
                </div>
              </Grid>
              <Grid
                container
                item
                xs={12}
                md={5}
                className={'mt-3'}
              >
                <Typography className='text_primary mb-2 mt-4'>
                  Find my coin
                </Typography>
                <AppInput
                  variant={'filled'}
                  backgroundColor={'#fff'}
                  postfix={
                    <img src={saerchIcon} width={20} className={'ml-2 mr-2'} />
                  }
                  placeholder={'Search coin'}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
