// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { AppInput } from '../../components'
import {
  Grid,
  Checkbox,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl
} from '@mui/material'

export default function Pricing ({
  per_night_price,
  per_week_price,
  per_month_price,
  pickup_time,
  drop_off_time,
  minimum_trip_length,
  security_deposit,
  cancellation_policy,
  mileage_charges,
  custom_mileage_charge,
  generator_charges,
  custom_generator_charge,
  handleChange
}) {
  const guestOptions2 = () => {
    return (
      <>
        <option value={''}>Select Time</option>
        <option value={'1:00AM'}>01:00AM</option>
        <option value={'2:00AM'}>02:00AM</option>
        <option value={'3:00AM'}>03:00AM</option>
        <option value={'4:00AM'}>04:00AM</option>
        <option value={'5:00AM'}>05:00AM</option>
        <option value={'6:00AM'}>06:00AM</option>
        <option value={'7:00AM'}>07:00AM</option>
        <option value={'8:00AM'}>08:00AM</option>
        <option value={'9:00AM'}>09:00AM</option>
        <option value={'10:00AM'}>10:00AM</option>
        <option value={'11:00AM'}>11:00AM</option>
        <option value={'12:00PM'}>12:00PM</option>
        <option value={'1:00PM'}>01:00PM</option>
        <option value={'2:00PM'}>02:00PM</option>
        <option value={'3:00PM'}>03:00PM</option>
        <option value={'4:00PM'}>04:00PM</option>
        <option value={'5:00PM'}>05:00PM</option>
        <option value={'6:00PM'}>06:00PM</option>
        <option value={'7:00PM'}>07:00PM</option>
        <option value={'8:00PM'}>08:00PM</option>
        <option value={'9:00PM'}>09:00PM</option>
        <option value={'10:00PM'}>10:00PM</option>
        <option value={'11:00PM'}>11:00PM</option>
        <option value={'12:00PM'}>12:00PM</option>
      </>
    )
  }
  return (
    <div>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12}>
          <p className='text_primary font-bold600 font-18'>Pricing</p>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Per night'}
                value={per_night_price}
                type={'number'}
                name={'per_night_price'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'$0.00'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Per week'}
                value={per_week_price}
                name={'per_week_price'}
                onChange={handleChange}
                type={'number'}
                className='mb-3 mt-3'
                placeholder={'$0.00'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Per month'}
                value={per_month_price}
                name={'per_month_price'}
                type={'number'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'$0.00'}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <AppInput
                label={'Minimum length of the trip'}
                value={minimum_trip_length}
                type={'number'}
                name={'minimum_trip_length'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter text'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Pick up time'}
                value={pickup_time}
                select
                inputWidthFull
                selectOptions={guestOptions2()}
                name={'pickup_time'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter text'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Drop off time'}
                select
                inputWidthFull
                selectOptions={guestOptions2()}
                value={drop_off_time}
                name={'drop_off_time'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter text'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Security deposit'}
                type={'number'}
                value={security_deposit}
                name={'security_deposit'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter text'}
              />
            </Grid>
          </Grid>

          <p className='font-18 font-bold600 text_primary'>
            Cancelation policy
          </p>
          <FormControl>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              defaultValue='female'
              row
              value={cancellation_policy}
              onChange={value =>
                handleChange('cancellation_policy', value.target.value)
              }
              name='radio-buttons-group'
            >
              <FormControlLabel
                value='Flexible'
                control={<Radio className='text_secondary' />}
                label='Flexible'
              />
              <FormControlLabel
                value='Standard'
                control={<Radio className='text_secondary' />}
                label='Standard'
              />
              <FormControlLabel
                value='Strict'
                control={<Radio className='text_secondary' />}
                label='Strict'
              />
            </RadioGroup>
          </FormControl>

          <p className='font-18 font-bold600 mt-4 text_primary'>
            Mileage Charges
          </p>
          <Grid container spacing={2} className={'mb-5'}>
            <Grid item xs={12}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={mileage_charges === 'Unlimited'}
                  onClick={() => handleChange('mileage_charges', 'Unlimited')}
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
                  Unlimited
                </Typography>
              </div>
              <div className='checkboxDiv mt-4'>
                <Checkbox
                  checked={mileage_charges === 'Set my own'}
                  onClick={() => handleChange('mileage_charges', 'Set my own')}
                  className='checkbox2'
                  sx={{
                    color: 'rgba(201, 208, 216, 1)',
                    '&.Mui-checked': {
                      color: 'rgba(168, 124, 81, 1)'
                    }
                  }}
                />
                <Typography variant='body2' className='text_primary06 mt-1'>
                  Set my own
                </Typography>
                <div style={{ width: 100, marginLeft: 20, marginTop: -20 }}>
                  <AppInput
                    inputWidthFull
                    value={custom_mileage_charge}
                    name={'custom_mileage_charge'}
                    onChange={handleChange}
                    placeholder={'0.00 Mil'}
                    type={'number'}
                  />
                </div>
              </div>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={mileage_charges === 'Recommendation'}
                  onClick={() =>
                    handleChange('mileage_charges', 'Recommendation')
                  }
                  className='checkbox2'
                  sx={{
                    color: 'rgba(201, 208, 216, 1)',
                    '&.Mui-checked': {
                      color: 'rgba(168, 124, 81, 1)'
                    }
                  }}
                />
                <Typography variant='body2' className='text_primary06 mt-1'>
                  Recommendation
                </Typography>
                <p
                  style={{ marginTop: 2, marginLeft: 10 }}
                  className={'text_primary'}
                >
                  (Free 100 miles per night with extra miles charged at $0.35
                  per mile.)
                </p>
              </div>
            </Grid>
          </Grid>
          <p className='font-18 font-bold600 mt-4 text_primary'>
            Generator charges
          </p>
          <Grid container spacing={2} className={'mb-5'}>
            <Grid item xs={12}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={generator_charges === 'Unlimited'}
                  onClick={() => handleChange('generator_charges', 'Unlimited')}
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
                  Unlimited
                </Typography>
              </div>
              <div className='checkboxDiv mt-4'>
                <Checkbox
                  checked={generator_charges === 'Set my own'}
                  onClick={() =>
                    handleChange('generator_charges', 'Set my own')
                  }
                  className='checkbox2'
                  sx={{
                    color: 'rgba(201, 208, 216, 1)',
                    '&.Mui-checked': {
                      color: 'rgba(168, 124, 81, 1)'
                    }
                  }}
                />
                <Typography variant='body2' className='text_primary06 mt-1'>
                  Set my own
                </Typography>
                <div style={{ width: 100, marginLeft: 20, marginTop: -20 }}>
                  <AppInput
                    inputWidthFull
                    value={custom_generator_charge}
                    name={'custom_generator_charge'}
                    onChange={handleChange}
                    placeholder={'$0.00'}
                    type={'number'}
                  />
                </div>
              </div>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={generator_charges === 'Recommendation'}
                  onClick={() =>
                    handleChange('generator_charges', 'Recommendation')
                  }
                  className='checkbox2'
                  sx={{
                    color: 'rgba(201, 208, 216, 1)',
                    '&.Mui-checked': {
                      color: 'rgba(168, 124, 81, 1)'
                    }
                  }}
                />
                <Typography variant='body2' className='text_primary06 mt-1'>
                  Recommendation
                </Typography>
                <p
                  style={{ marginTop: 2, marginLeft: 10 }}
                  className={'text_primary'}
                >
                  (Free 4 hours per night with extra hours charged at $3 per
                  hour.)
                </p>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
