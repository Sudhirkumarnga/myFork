// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Checkbox, Typography, Divider } from '@mui/material'
import eyeIcon from '../../assets/svg/eye.svg'
import { useNavigate, useParams } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import { makeBooking } from '../../api/rvlisting'
import moment from 'moment'
import saerchIcon from '../../assets/svg/saerchIcon.svg'
import { COLORS } from '../../constants'
import Bus1 from '../../assets/images/Bus1.png'
import heartWhite from '../../assets/svg/heartWhite.svg'

export default function Favourite ({}) {
  const navigate = useNavigate()
  const { listRVS } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    categories: '',
    searchText: ''
  })

  const { loading, searchText, categories } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const yearOptions = () => {
    return (
      <>
        <option value={''}>Select</option>
        <option value={'Type'}>Type</option>
        <option value={'Location'}>Location</option>
        <option value={'Price'}>Price</option>
      </>
    )
  }

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={12} md={12} className='loginPaper p-4'>
              <Grid
                container
                justifyContent={'space-between'}
                className={'mb-3'}
                alignItems={'center'}
              >
                <p className='text_primary font-bold font-18'>Favourites</p>
                <Grid container item md={6}>
                  <Grid item md={8} xs={8}>
                    <AppInput
                      value={searchText}
                      prefix={
                        <img
                          src={saerchIcon}
                          width={20}
                          className={'ml-2 mr-2'}
                        />
                      }
                      name={'searchText'}
                      onChange={handleChange}
                      placeholder={'Type here'}
                    />
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <AppInput
                      value={categories}
                      select
                      selectOptions={yearOptions()}
                      inputWidthFull
                      name={'categories'}
                      onChange={handleChange}
                      placeholder={'All categories'}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <Grid spacing={2} container sx={{ p: 2 }}>
                {listRVS?.map((rv, index) => (
                  <Grid
                    key={index}
                    item
                    md={3}
                    sm={6}
                    xs={12}
                    sx={{ cursor: 'pointer' }}
                    // onClick={() => navigate(`/rv/${rv?.id}`)}
                  >
                    <div className='paperList'>
                      <div className='heartWhite'>
                        <img src={heartWhite} />
                      </div>
                      <img
                        src={
                          rv?.images?.length > 0 ? rv.images[0]?.image : Bus1
                        }
                        className={'rvImage1'}
                      />
                      <div className='listallRVcard'>
                        <div className='text_primary mb-2 font-18'>
                          {rv?.name}
                        </div>
                        <div className='rowBetween'>
                          <div className=''>
                            ${rv?.per_night_price}/
                            <span className='font-14'>night</span>
                          </div>
                          <AppButton
                            title={'Remove'}
                            borderColor={COLORS.primary}
                            backgroundColor={COLORS.white}
                            color={COLORS.primary}
                            height={40}
                            width={80}
                          />
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
