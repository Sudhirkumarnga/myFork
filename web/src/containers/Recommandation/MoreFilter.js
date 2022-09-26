// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useRef, useState } from 'react'
import { HomeFooter, AppInput, HomeHeader, AppButton } from '../../components'
import { Element } from 'react-scroll'
import {
  Grid,
  Slider,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import instantIcon from '../../assets/svg/instant.svg'
import saerchIcon from '../../assets/svg/saerchIcon.svg'

const center = {
  lat: -3.745,
  lng: -38.523
}
const IOSSwitch = styled(props => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#A87C51' : '#A87C51',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export default function MoreFilter ({}) {
  const [state, setState] = React.useState({
    length: [8, 40],
    year: [2000, 2021]
  })

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  function valuetext (value) {
    return `${value} FT`
  }

  function valuetext1 (value) {
    return `${value}`
  }

  const { length, year } = state

  const kitchenList = [
    { title: 'Microwave', key: 'microwave' },
    { title: 'Range (stove)', key: 'range' },
    { title: 'Refrigerator', key: 'refrigerator' },
    { title: 'Kitchen sink', key: 'kitchenSink' },
    { title: 'Slide out', key: 'slideOut' }
  ]
  const cancellationTypeList = [
    { title: 'Flexible', key: 'flexible' },
    { title: 'Standard', key: 'standard' },
    { title: 'Strict', key: 'strict' }
  ]

  const bathroomList = [
    { title: 'Shower', key: 'shower' },
    { title: 'Bathroom sink', key: 'bathroomSink' },
    { title: 'Toilet', key: 'toilet' }
  ]

  const entertainmentList = [
    { title: 'CD Player', key: 'CDPlayer' },
    { title: 'iPod Docking Station', key: 'iPodDockingStation' },
    { title: 'TV', key: 'TV' },
    { title: 'DVD Player', key: 'DVDPlayer' },
    { title: 'AM/FM Radio', key: 'AM/FMRadio' }
  ]

  const temperatureList = [
    { title: 'Hot & Cold Water Supply', key: 'hotColdWaterSupply' },
    { title: 'In Dash Air Conditioning', key: 'inDashAirConditioning' }
  ]

  const otherList = [
    { title: 'Electric Generator', key: 'electricGenerator' },
    { title: 'Seat Belts', key: 'seatBelts' },
    { title: 'Navigation', key: 'Navigation' },
    { title: 'Rear Vision Camera', key: 'rearVisionCamera' }
  ]

  return (
    <div>
      <HomeHeader />
      <section className='mt-4'>
        <div className='container'>
          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
            className={'mt-5 mb-5'}
          >
            <Typography variant='h5'>Aditional Filters</Typography>
            <div className='d-flex align-items-center'>
              <div className='filterButtonWidth'>
                <AppButton
                  title={'Cancel'}
                  borderColor={'rgba(168, 124, 81, 1)'}
                  backgroundColor={'transparent'}
                  color={'rgba(168, 124, 81, 1)'}
                />
              </div>
              <div className='filterButtonWidth'>
                <AppButton
                  title={'Apply filters'}
                  backgroundColor={'rgba(168, 124, 81, 1)'}
                  color={'#fff'}
                />
              </div>
            </div>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <Typography className='text_primary mb-2'>
                Vehicle details
              </Typography>
              <Typography className='text_primary '>Length</Typography>
              <Grid container justifyContent={'space-between'}>
                <Typography className='text_primary06'>Min: 8 ft</Typography>
                <Typography className='text_primary06'>Max: 40 ft</Typography>
              </Grid>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={length}
                max={40}
                min={8}
                classes={{ root: 'slider' }}
                onChange={(event, newValue) => handleChange('length', newValue)}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
              />
              <Typography className='text_primary mt-2'>Year</Typography>
              <Grid container justifyContent={'space-between'}>
                <Typography className='text_primary06'>Min: 2000</Typography>
                <Typography className='text_primary06'>Max: 2023+</Typography>
              </Grid>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={year}
                max={2023}
                min={2000}
                classes={{ root: 'slider' }}
                onChange={(event, newValue) => handleChange('year', newValue)}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext1}
              />
              <div className={'d-flex align-items-center mt-4 mb-3'}>
                <img src={instantIcon} />
                <Typography className='text_primary ml-2'>
                  Instant booking
                </Typography>
              </div>
              <div className='checkboxDiv'>
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
                <Typography
                  variant='body2'
                  className='text_primary06 checkboxLabel'
                >
                  Book instantly without waiting for the owner to respond
                </Typography>
              </div>
              <Typography className='text_primary mt-4'>
                Rental rules
              </Typography>
              <div className='checkboxDiv'>
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
                <Typography
                  variant='body2'
                  className='text_primary06 checkboxLabel'
                >
                  Allows smoking
                </Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Typography className='text_primary mb-2'>
                Rental Options
              </Typography>
              <div className='checkboxDiv'>
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
                <Typography
                  variant='body2'
                  className='text_primary06 checkboxLabel'
                >
                  Offers stationary renta
                </Typography>
              </div>
              <Typography className='text_primary mt-4'>Kitchen</Typography>
              {kitchenList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
              <Typography className='text_primary mt-4'>
                Cancellation type
              </Typography>
              {cancellationTypeList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Typography className='text_primary mb-2'>Bathroom</Typography>
              {bathroomList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
              <Typography className='text_primary mt-4'>
                Entertainment
              </Typography>
              {entertainmentList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Typography className='text_primary mb-2'>Temperature</Typography>
              {temperatureList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
              <Typography className='text_primary mb-2 mt-4'>Other</Typography>
              {otherList.map((item, index) => (
                <div key={index} className='checkboxDiv'>
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
                  <Typography
                    variant='body2'
                    className='text_primary06 checkboxLabel'
                  >
                    {item.title}
                  </Typography>
                </div>
              ))}
              <Typography className='text_primary mb-2 mt-4'>
                Keyword search
              </Typography>
              <AppInput
                variant={'filled'}
                backgroundColor={'#fff'}
                prefix={
                  <img src={saerchIcon} width={20} className={'ml-2 mr-2'} />
                }
                placeholder={'Search for specific filter'}
              />
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter />
      {/* <MainFooter /> */}
    </div>
  )
}
