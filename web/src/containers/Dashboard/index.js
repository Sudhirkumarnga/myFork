// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react'
import { Layout } from '../../components'
import { Grid, Divider, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import AppTable from '../../components/AppTable'
import { COLORS } from '../../constants'

const headCells1 = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    sx: { width: 400 },
    label: 'Name '
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Current'
  },
  {
    id: 'change',
    numeric: false,
    disablePadding: false,
    label: 'Quantity'
  },
  {
    id: 'marketcap',
    numeric: false,
    disablePadding: false,
    label: 'Total'
  }
]

const headCells2 = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    sx: { width: 400 },
    label: 'Name '
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Current retail price range/ounce'
  },
  {
    id: 'change',
    numeric: false,
    disablePadding: false,
    label: 'Quantity'
  },
  {
    id: 'marketcap',
    numeric: false,
    disablePadding: false,
    label: 'Total range'
  }
]

const headCells3 = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    sx: { width: 400 },
    label: 'Name '
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Current target price'
  },
  {
    id: 'change',
    numeric: false,
    disablePadding: false,
    label: 'Owned'
  },
  {
    id: 'marketcap',
    numeric: false,
    disablePadding: false,
    label: 'Quantity to Sell'
  }
]

const data = [
  {
    price: '$1,812.00',
    name: 'Gold',
    change: '+4.00%',
    marketcap: '$11.485 T'
  },
  {
    price: '$1,812.00',
    name: 'Gold',
    change: '+4.00%',
    marketcap: '$11.485 T'
  },
  {
    price: '$1,812.00',
    name: 'Gold',
    change: '+4.00%',
    marketcap: '$11.485 T'
  },
  {
    price: '$1,812.00',
    name: 'Gold',
    change: '+4.00%',
    marketcap: '$11.485 T'
  }
]

export default function Home ({}) {
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
            <Grid item xs={12} sm={12} md={12} className=' p-4'>
              <Grid
                container
                justifyContent={'center'}
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
                    onClick={() => navigate('/dashboard/spot-price')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.primary,
                      textTransform: 'capitalize',
                      width: 200
                    }}
                  >
                    1. Spot Price
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => navigate('/dashboard/retail-value')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.retail,
                      ml: 1,
                      mr: 1,
                      textTransform: 'capitalize',
                      width: 200
                    }}
                  >
                    2. Retail Value
                  </Button>

                  <Button
                    variant='contained'
                    onClick={() => navigate('/dashboard/makeoffers')}
                    sx={{
                      borderRadius: 30,
                      backgroundColor: COLORS.offer,
                      textTransform: 'capitalize',
                      width: 200
                    }}
                  >
                    3. Make Me An Offer
                  </Button>
                </div>
              </Grid>
              <Divider />
              <Grid container spacing={2} className={'mt-3'}>
                <AppTable
                  onClickItem={() => navigate('/my-booking/details')}
                  headCells={
                    location.pathname === '/dashboard/spot-price'
                      ? headCells1
                      : location.pathname === '/dashboard/retail-value'
                      ? headCells2
                      : headCells3
                  }
                  portfolio
                  rows={data}
                  rowsPage={15}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
