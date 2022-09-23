// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { AppInput } from '../../components'
import { Grid, Checkbox, Typography, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export default function AddDetails ({
  handleChange,
  first_name,
  last_name,
  email,
  address,
  phone,
  type,
  year,
  make,
  model,
  length,
  sleeping_capacity,
  dry_weight,
  gross_weight
}) {
  const yearOptions = () => {
    return (
      <>
        <option value={''}>Select</option>
        <option value={'2022'}>2022</option>
        <option value={'2020'}>2020</option>
        <option value={'2019'}>2019</option>
        <option value={'2018'}>2018</option>
        <option value={'2017'}>2017</option>
      </>
    )
  }

  return (
    <div>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Name'}
                value={first_name}
                name={'first_name'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'First name'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Last name'}
                value={last_name}
                name={'last_name'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Last name'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                className='mb-4 mt-3'
                label={'Email'}
                value={email}
                name={'email'}
                onChange={handleChange}
                placeholder={'Email'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Address'}
                value={address}
                name={'address'}
                // onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Address'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <p className='mt-3 mb-2 font-bold text_primary'>Date of birth</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label={false}
                  // value={value}
                  // onChange={newValue => {
                  //   setValue(newValue)
                  // }}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                className='mb-4 mt-3'
                label={'Phone number'}
                value={phone}
                name={'phone'}
                onChange={handleChange}
                placeholder={'Phone number'}
              />
            </Grid>
          </Grid>
          <div className='checkboxDiv mb-4'>
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
              className='text_primary06 checkboxLabel mt-1'
            >
              Send me SMS messages about my bookings. Standard messaging rates
              apply.
            </Typography>
          </div>

          <p className='font-18 font-bold600 text_primary'>RV details</p>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Class'}
                value={type}
                name={'type'}
                // onChange={handleChange}
                className='mb-3 mt-3'
                // select
                // selectOptions={classOptions()}
                inputWidthFull
                placeholder={'Travel trailer '}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Year'}
                value={year}
                select
                selectOptions={yearOptions()}
                inputWidthFull
                name={'year'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'2022'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Make'}
                value={make}
                name={'make'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter name'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Model'}
                value={model}
                name={'model'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter model'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                className='mb-4 mt-3'
                label={'Length'}
                value={length}
                name={'length'}
                onChange={handleChange}
                placeholder={'Enter model'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Sleeping Capacity'}
                value={sleeping_capacity}
                name={'sleeping_capacity'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Number of capacity'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Dry weight'}
                value={dry_weight}
                name={'dry_weight'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter dry weight'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                className='mb-4 mt-3'
                label={'Gross weight'}
                value={gross_weight}
                name={'gross_weight'}
                onChange={handleChange}
                placeholder={'Enter gross weight'}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
