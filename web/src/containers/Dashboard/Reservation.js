// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import {
  HomeFooter,
  AppInput,
  HomeHeader,
  AppButton,
  Layout
} from '../../components'
import { Checkbox, Divider, Grid, Typography } from '@mui/material'
import whoweare from '../../assets/images/inspiration.png'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'

export default function Reservation ({}) {
  const navigate = useNavigate()

  const reservations = [
    {
      title: 'Pending Owner Inspection',
      rv: '2019 Fly Eagle Alliance 7DDD ',
      date: '05/18/2022 - 05/22/2022'
    },
    {
      title: 'Pending Owner Inspection',
      rv: '2019 Fly Eagle Alliance 7DDD ',
      date: '05/18/2022 - 05/22/2022'
    },
    {
      title: 'Pending Owner Inspection',
      rv: '2019 Fly Eagle Alliance 7DDD ',
      date: '05/18/2022 - 05/22/2022'
    },
    {
      title: 'Pending Owner Inspection',
      rv: '2019 Fly Eagle Alliance 7DDD ',
      date: '05/18/2022 - 05/22/2022'
    },
    {
      title: 'Pending Owner Inspection',
      rv: '2019 Fly Eagle Alliance 7DDD ',
      date: '05/18/2022 - 05/22/2022'
    }
  ]
  const Upcoming = [
    {
      name: 'John Smith',
      rv: 'The Gray House - Glacier RV Edition Ice House',
      date: '05/18/2022 - 05/22/2022 / $1.640.00 / Handed off'
    },
    {
      name: 'John Smith',
      rv: 'The Gray House - Glacier RV Edition Ice House',
      date: '05/18/2022 - 05/22/2022 / $1.640.00 / Handed off'
    }
  ]
  const Recent = [
    {
      name: 'Jean J. Thornhill',
      rv: 'The Gray House - Glacier RV Edition Ice House',
      date: '05/18/2022 - 05/22/2022 / $1.640.00 / Handed off',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis, dui id mattis elementum, tellus justo maximus mauris, quis dignissim velit tortor sit amet lectus. Quisque id turpis convallis sapien auctor maximus quis eu enim. Nulla commodo faucibus sodales. Praesent lobortis mi et justo vehicula, id consequat sem lobortis. Consectetur adipiscing elit. Nullam lobortis, dui id mattis elementum, tellus justo maximus mauris, quis dignissim velit tortor sit amet lectus. '
    },
    {
      name: 'Martha G. McHenry',
      rv: 'The Gray House - Glacier RV Edition Ice House',
      date: '05/18/2022 - 05/22/2022 / $1.640.00 / Handed off',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis, dui id mattis elementum, '
    }
  ]
  const phistory = [
    {
      name: 'Jean J. Thornhill',
      status: 'Pending',
      id: '#7555735',
      date: '05/18/2022',
      price: '$769.00',
      last4: '******* 8654'
    },
    {
      status: 'Completed',
      name: 'Jean J. Thornhill',
      id: '#7555735',
      date: '05/18/2022',
      price: '$769.00',
      last4: '******* 8654'
    },
    {
      name: 'Jean J. Thornhill',
      id: '#7555735',
      date: '05/18/2022',
      price: '$769.00',
      last4: '******* 8654'
    },
    {
      name: 'Jean J. Thornhill',
      id: '#7555735',
      date: '05/18/2022',
      price: '$769.00',
      last4: '******* 8654'
    }
  ]

  const guestOptions2 = () => {
    return (
      <>
        <option value={''}>Select</option>
        <option value={'Not yet paid'}>
          <Checkbox
            defaultChecked
            className='checkbox1'
            sx={{
              color: 'rgba(201, 208, 216, 1)',
              '&.Mui-checked': {
                color: 'rgba(168, 124, 81, 1)'
              }
            }}
          />
          Not yet paid
        </option>
        <option value={'Paid in full'}>
          <Checkbox
            defaultChecked
            className='checkbox1'
            sx={{
              color: 'rgba(201, 208, 216, 1)',
              '&.Mui-checked': {
                color: 'rgba(168, 124, 81, 1)'
              }
            }}
          />
          Paid in full
        </option>
        <option value={'Canceled'}>
          <div>
            <Checkbox
              defaultChecked
              className='checkbox1'
              sx={{
                color: 'rgba(201, 208, 216, 1)',
                '&.Mui-checked': {
                  color: 'rgba(168, 124, 81, 1)'
                }
              }}
            />
            Canceled
          </div>
        </option>
      </>
    )
  }
  const guestOptions = () => {
    return (
      <>
        <option value={''}>Select</option>
        <option value={'Not yet paid'}>RV listing 1</option>
        <option value={'Paid in full'}>RV listing 2</option>
        <option value={'Canceled'}>RV listing N</option>
      </>
    )
  }

  return (
    <div>
      <HomeHeader />

      <Layout>
        <div className='paper ph-0'>
          <div className='rowBetween ph-3'>
            <div>Reservation</div>
          </div>
          <Divider className='mt-3' />
          <Grid container spacing={2} className='rowBetween mt-3 mb-3 ph-3'>
            <Grid item xs={12} md={6}>
              <AppInput
                placeholder={'Select'}
                select
                inputWidthFull
                selectOptions={guestOptions2()}
                label={'All payments'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppInput
                select
                inputWidthFull
                selectOptions={guestOptions()}
                placeholder={'Select'}
                label={'All RVs'}
              />
            </Grid>
          </Grid>
          <Grid container className='ph-3 mt-5 mb-2'>
            <Grid item xs={4}>
              <p>Dates</p>
            </Grid>
            <Grid item xs={4}>
              <p>RV listing</p>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          {reservations.map((reservation, index) => (
            <>
              <Divider className='fullDivider' />
              <Grid key={index} container className='ph-3'>
                <Grid item xs={4}>
                  <p className='text_primary mt-4'>{reservation.date}</p>
                </Grid>
                <Grid item xs={4}>
                  <p className='text_primary mt-4'>{reservation.rv}</p>
                </Grid>
                <Grid item xs={4}>
                  <p className='text_primary mt-2'>{reservation.title}</p>
                  <div className='profileCheckbox mb-2'>
                    <div className='checkboxDiv1'>
                      <Checkbox
                        defaultChecked
                        className='checkbox1'
                        sx={{
                          color: 'rgba(201, 208, 216, 1)',
                          '&.Mui-checked': {
                            color: 'rgba(168, 124, 81, 1)'
                          }
                        }}
                      />
                      <Typography variant='body2' className='CheckboxText'>
                        Alow
                      </Typography>
                    </div>
                    <div className='checkboxDiv1'>
                      <Checkbox
                        defaultChecked
                        className='checkbox1'
                        sx={{
                          color: 'rgba(201, 208, 216, 1)',
                          '&.Mui-checked': {
                            color: 'rgba(168, 124, 81, 1)'
                          }
                        }}
                      />
                      <Typography variant='body2' className='CheckboxText mr-3'>
                        Deny
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </>
          ))}
        </div>
        <div className='paper ph-0 mt-4'>
          <div className='rowBetween ph-3'>
            <div>Upcoming bookings (2)</div>
          </div>
          <Divider className='mt-3' />
          {Upcoming.map((rv, index) => (
            <>
              <Grid key={index} container className='rowBetween ph-3'>
                <Grid container item xs={8}>
                  <img src={whoweare} className={'upcomingImg mt-2 mr-3'} />
                  <div>
                    <p className='text_primary font-bold mt-2'>{rv.name}</p>
                    <p className='text_primary mt-2'>{rv.rv}</p>
                    <p className='text_primary'>{rv.date}</p>
                  </div>
                </Grid>
                <Grid
                  item
                  container
                  alignItems={'flex-end'}
                  xs={4}
                  direction={'column'}
                  className='mt-3 mb-3'
                >
                  {/* <AppButton
                      title={'Message renter'}
                      borderColor={COLORS.primary}
                      backgroundColor={COLORS.white}
                      color={COLORS.primary}
                      height={40}
                      width={150}
                    /> */}
                  <AppButton
                    title={'Booking details'}
                    onClick={() => navigate('/dashboard/reservation/details')}
                    className={'mt-2'}
                    borderColor={COLORS.primary}
                    backgroundColor={COLORS.white}
                    color={COLORS.primary}
                    height={40}
                    width={150}
                  />
                </Grid>
              </Grid>
              <Divider className='fullDivider' />
            </>
          ))}
          <Grid
            container
            alignItems={'flex-end'}
            className={'pr-3 mt-2 c-pointer'}
            direction={'column'}
          >
            <p className='text_secondary'>View all</p>
          </Grid>
        </div>
        <div className='paper ph-0 mt-4'>
          <div className='rowBetween ph-3'>
            <div>Pending requests (2)</div>
          </div>
          <Divider className='mt-3' />
          {Upcoming.map((rv, index) => (
            <>
              <Grid key={index} container className='rowBetween ph-3'>
                <Grid container item xs={8}>
                  <img src={whoweare} className={'upcomingImg mt-2 mr-3'} />
                  <div>
                    <p className='text_primary font-bold mt-2'>{rv.name}</p>
                    <p className='text_primary mt-2'>{rv.rv}</p>
                    <p className='text_primary'>{rv.date}</p>
                  </div>
                </Grid>
                <Grid
                  item
                  container
                  alignItems={'flex-end'}
                  xs={4}
                  direction={'column'}
                  className='mt-3 mb-3'
                >
                  <AppButton
                    title={'Message renter'}
                    borderColor={COLORS.primary}
                    backgroundColor={COLORS.white}
                    color={COLORS.primary}
                    height={40}
                    width={150}
                  />
                  <AppButton
                    title={'Booking details'}
                    className={'mt-2'}
                    borderColor={COLORS.primary}
                    backgroundColor={COLORS.white}
                    color={COLORS.primary}
                    height={40}
                    width={150}
                  />
                </Grid>
              </Grid>
              <Divider className='fullDivider' />
            </>
          ))}
          <Grid
            container
            alignItems={'flex-end'}
            className={'pr-3 mt-2 c-pointer'}
            direction={'column'}
          >
            <p className='text_secondary'>View all</p>
          </Grid>
        </div>
        {/* <div className='paper ph-0 mt-4'>
          <div className='rowBetween ph-3'>
            <div>Recent messages</div>
          </div>
          {Recent.map((rv, index) => (
            <>
              <Divider className='mt-3 mb-2' />
              <Grid key={index} container className='rowBetween ph-3'>
                <Grid container item xs={8}>
                  <img src={whoweare} className={'upcomingImg mt-2 mr-3'} />
                  <div>
                    <p className='text_primary font-bold mt-2'>{rv.name}</p>
                    <p className='text_primary mt-2 messageDes'>{rv.rv}</p>
                    <p className='text_primary messageDes'>{rv.date}</p>
                  </div>
                </Grid>
              </Grid>
              <Grid className='ph-3 mt-3 mb-3'>
                <Divider />
                <p className='text_primary  mt-3 messageDes'>{rv.message}</p>
                <Grid
                  container
                  className={'pr-3 mt-4 c-pointer'}
                  direction={'column'}
                >
                  <p className='text_secondary'>Archive</p>
                </Grid>
              </Grid>
            </>
          ))}
        </div> */}
        <div className='paper ph-0 mt-4'>
          <div className='rowBetween ph-3'>
            <div>Payment history</div>
          </div>
          {phistory.map((rv, index) => (
            <>
              <Divider className='mt-3 mb-2' />
              <Grid key={index} container className='rowBetween ph-3'>
                <Grid container item xs={8}>
                  <div>
                    <p className='text_primary font-16 font-bold mt-2'>
                      {rv.status}
                    </p>
                    <p className='text_primary mt-2 messageTitle'>
                      {rv.name} -{' '}
                      <span className='text_secondary'>ID {rv.id}</span>
                    </p>
                    <p className='text_primary messageDes'>{rv.date}</p>
                  </div>
                </Grid>
                <Grid
                  container
                  item
                  xs={4}
                  direction={'column'}
                  alignItems={'flex-end'}
                >
                  <p className='text_primary mt-2 messageTitle'>{rv.price}</p>
                  <p className='text_primary mt-2 messageDes'>{rv.last4}</p>
                </Grid>
              </Grid>
            </>
          ))}
        </div>
      </Layout>

      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
