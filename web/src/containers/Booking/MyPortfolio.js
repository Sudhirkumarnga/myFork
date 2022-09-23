// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react'
import { Layout } from '../../components'
import { Grid, Divider, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import AppTable from '../../components/AppTable'

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
    label: 'Current price/ounce'
  },
  {
    id: 'change',
    numeric: false,
    disablePadding: false,
    label: '24hr change'
  },
  {
    id: 'marketcap',
    numeric: false,
    disablePadding: false,
    label: 'Market cap'
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

export default function MyPortfolio ({}) {
  const navigate = useNavigate()
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
                justifyContent={'space-between'}
                className={'mb-3'}
                alignItems={'center'}
              >
                <p className='text_primary font-bold font-18'>
                  Precious Metals Spot Prices
                </p>
                <Grid container justifyContent={'flex-end'} item md={6}>
                  <Button variant='contained' onClick={()=>navigate('/dashboard/portfolio/add')}>Add New Coin</Button>
                </Grid>
              </Grid>
              <Divider />
              <Grid container spacing={2} className={'mt-3'}>
                <AppTable
                  onClickItem={() => navigate('/my-booking/details')}
                  headCells={headCells1}
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
