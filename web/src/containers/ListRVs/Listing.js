// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { AppInput } from '../../components'
import { Grid, Checkbox, Typography } from '@mui/material'

export default function Listing (
  {
    name,
    note,
    pet_friendly,
    wheelchair_accessible,
    delivery,
    smoking_allowed,
    total_bunks,
    total_beds,
    cargo_weight,
    handleChange
  },
  props
) {
  const amenities = [
    {
      title: 'In Dash Air Conditioning',
      key: 'roof_air_conditioning'
    },
    // { title: 'iPod Docking Station' },
    {
      title: 'Hot & Cold Water Supply',
      key: 'hot_and_cold_water'
    },
    { title: 'DVD Player', key: 'dvd' },
    { title: 'Microwave', key: 'microwave' },
    // { title: 'Seat Belts ', key: false },
    { title: 'Roof Air Conditioning', key: 'roof_air_conditioning' },
    // { title: 'Rear Vision Camera', key: false },
    { title: 'Toilet', key: 'toilet' },
    { title: 'AM/FM Radio', key: 'am_fm_radio' },
    { title: 'Range (Stove)', key: 'range_stove' },
    { title: 'Fire Extinguisher', key: 'fire_extinguisher' },
    { title: 'Refrigerator', key: 'refrigerator' },
    // { title: 'Navigation', key: false },
    { title: 'Bathroom Sink', key: 'bathroom_sink' },
    { title: 'CD Player ', key: 'cd_player' },
    { title: 'Shower', key: 'shower' },
    { title: 'Electric Generator', key: 'electric_generator' },
    { title: 'Kitchen Sink', key: 'kitchen_sink' },
    { title: 'Slide Out', key: 'slide_out' },
    { title: 'TV', key: 'tv' }
  ]

  return (
    <div>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12}>
          <p className='text_primary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            cursus pretium augue, id posuere nisl vehicula hendrerit.
          </p>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <AppInput
                label={'Give your RV listing a name'}
                value={name}
                inputWidthFull
                name={'name'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter name'}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <AppInput
                label={'Note'}
                value={note}
                multiline
                inputWidthFull
                name={'note'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter text'}
              />
            </Grid>
          </Grid>

          <p className='font-18 font-bold600 text_primary'>Suitability</p>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={pet_friendly}
                  onClick={() => handleChange('pet_friendly', !pet_friendly)}
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
                  Pet Friendly
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6} md={4}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={wheelchair_accessible}
                  onClick={() =>
                    handleChange(
                      'wheelchair_accessible',
                      !wheelchair_accessible
                    )
                  }
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
                  Wheelchair Accessibility
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6} md={4}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={delivery}
                  onClick={() => handleChange('delivery', !delivery)}
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
                  Delivery
                </Typography>
              </div>
            </Grid>
            <Grid className='paddingTop0' item xs={6} md={4}>
              <div className='checkboxDiv'>
                <Checkbox
                  checked={smoking_allowed}
                  onClick={() =>
                    handleChange('smoking_allowed', !smoking_allowed)
                  }
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
                  Smoking Allowed
                </Typography>
              </div>
            </Grid>
          </Grid>
          <p className='font-18 font-bold600 mt-4 text_primary'>Amenities</p>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Total number of beds'}
                value={total_beds}
                name={'total_beds'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter Text'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Number of bunk beds'}
                value={total_bunks}
                name={'total_bunks'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter Text'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppInput
                label={'Cargo weight'}
                value={cargo_weight}
                name={'cargo_weight'}
                onChange={handleChange}
                className='mb-3 mt-3'
                placeholder={'Enter Text'}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={'mb-5'}>
            {amenities.map((item, index) => (
              <Grid key={index} item xs={6} md={4}>
                <div className='checkboxDiv'>
                  <Checkbox
                    checked={props[item.key]}
                    onClick={() =>
                      handleChange(`${props[item.key]}`, !props[item.key])
                    }
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
                    {item.title}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
