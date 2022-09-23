// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import {
  AppButton,
  AppInput,
  AppSwitch,
  HomeFooter,
  HomeHeader
} from '../../components'
import { Grid, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import AutoComplete from 'react-google-autocomplete'
import AddDetails from './AddDetails'
import Listing from './Listing'
import Pricing from './Pricing'
import AddPhotos from './AddPhotos'
import { createRV } from '../../api/rvlisting'
import { useSnackbar } from 'notistack'

const label = { inputProps: { 'aria-label': 'Switch demo' } }

export default function ListRVs ({}) {
  const navigate = useNavigate()
  const [gmapsLoaded, setGmapsLoaded] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    first_name: '',
    last_name: '',
    loading: false,
    email: '',
    dob: '',
    phone: '',
    step: 0,
    name: '',
    type: '',
    address: '',
    stationary: false,
    year: '',
    make: '',
    model: '',
    length: '',
    sleeping_capacity: '',
    dry_weight: '',
    gross_weight: '',
    note: '',
    total_beds: '',
    total_bunks: '',
    cargo_weight: '',
    pet_friendly: false,
    wheelchair_accessible: false,
    delivery: false,
    smoking_allowed: false,
    roof_air_conditioning: false,
    hot_and_cold_water: false,
    dvd: false,
    microwave: false,
    refrigerator: false,
    kitchen_sink: false,
    slide_out: false,
    range_stove: false,
    toilet: false,
    shower: false,
    bathroom_sink: false,
    tv: false,
    am_fm_radio: false,
    cd_player: false,
    electric_generator: false,
    trailer_connector_adapter: false,
    towable_electrical_service: false,
    trailer_ball_size: '',
    anti_sway_provided: '',
    dual_battery: false,
    hitch_provided: false,
    campsite_electrical_service: false,
    fresh_water_tank: false,
    temp_control_hot_cold_supply: false,
    fire_extinguisher: false,
    per_night_price: '',
    per_week_price: '',
    per_month_price: '',
    pickup_time: '',
    drop_off_time: '',
    minimum_trip_length: '',
    security_deposit: '',
    cancellation_policy: '',
    mileage_charges: '',
    custom_mileage_charge: '',
    generator_charges: '',
    custom_generator_charge: '',
    images: []
  })

  useEffect(() => {
    window.initMap = () => setGmapsLoaded(true)
    if (path) {
      handleChange('activeTab', path === '/signup' ? 0 : 1)
    }
    if (user) {
      // navigate('/')
    }
  }, [path, user])

  const {
    first_name,
    last_name,
    loading,
    email,
    dob,
    phone,
    step,
    name,
    type,
    address,
    stationary,
    year,
    make,
    model,
    length,
    sleeping_capacity,
    dry_weight,
    gross_weight,
    note,
    pet_friendly,
    wheelchair_accessible,
    delivery,
    smoking_allowed,
    roof_air_conditioning,
    hot_and_cold_water,
    dvd,
    microwave,
    refrigerator,
    kitchen_sink,
    slide_out,
    range_stove,
    toilet,
    shower,
    bathroom_sink,
    tv,
    am_fm_radio,
    cd_player,
    electric_generator,
    trailer_connector_adapter,
    towable_electrical_service,
    trailer_ball_size,
    anti_sway_provided,
    dual_battery,
    hitch_provided,
    campsite_electrical_service,
    fresh_water_tank,
    temp_control_hot_cold_supply,
    fire_extinguisher,
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
    images,
    total_beds,
    total_bunks,
    cargo_weight
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    if (step === 5) {
      handleSubmitData()
      return
    }
    handleChange('step', step + 1)
  }

  const handleBack = () => {
    if (step === 0) {
      navigate(-1)
    } else {
      handleChange('step', step - 1)
    }
  }

  const handleSubmitData = async () => {
    try {
      handleChange('loading', true)
      const payload = new FormData()
      payload.append('name', name)
      payload.append('type', type)
      payload.append('address', address)
      payload.append('stationary', stationary)
      payload.append('year', year)
      payload.append('make', make)
      payload.append('model', model)
      payload.append('length', length)
      payload.append('sleeping_capacity', sleeping_capacity)
      payload.append('dry_weight', dry_weight)
      payload.append('gross_weight', gross_weight)
      payload.append('note', note)
      payload.append('pet_friendly', pet_friendly)
      payload.append('wheelchair_accessible', wheelchair_accessible)
      payload.append('delivery', delivery)
      payload.append('smoking_allowed', smoking_allowed)
      payload.append('roof_air_conditioning', roof_air_conditioning)
      payload.append('hot_and_cold_water', hot_and_cold_water)
      payload.append('dvd', dvd)
      payload.append('microwave', microwave)
      payload.append('refrigerator', refrigerator)
      payload.append('kitchen_sink', kitchen_sink)
      payload.append('slide_out', slide_out)
      payload.append('range_stove', range_stove)
      payload.append('toilet', toilet)
      payload.append('shower', shower)
      payload.append('bathroom_sink', bathroom_sink)
      payload.append('tv', tv)
      payload.append('am_fm_radio', am_fm_radio)
      payload.append('cd_player', cd_player)
      payload.append('electric_generator', electric_generator)
      payload.append('trailer_connector_adapter', trailer_connector_adapter)
      payload.append('towable_electrical_service', towable_electrical_service)
      payload.append('trailer_ball_size', trailer_ball_size)
      payload.append('anti_sway_provided', anti_sway_provided)
      payload.append('dual_battery', dual_battery)
      payload.append('hitch_provided', hitch_provided)
      payload.append('campsite_electrical_service', campsite_electrical_service)
      payload.append('fresh_water_tank', fresh_water_tank)
      payload.append('total_beds', total_beds)
      payload.append('total_bunks', total_bunks)
      payload.append('cargo_weight', cargo_weight)
      payload.append(
        'temp_control_hot_cold_supply',
        temp_control_hot_cold_supply
      )
      payload.append('fire_extinguisher', fire_extinguisher)
      payload.append('per_night_price', per_night_price)
      payload.append('per_week_price', per_week_price)
      payload.append('per_month_price', per_month_price)
      payload.append('pickup_time', pickup_time)
      payload.append('drop_off_time', drop_off_time)
      payload.append('minimum_trip_length', minimum_trip_length)
      payload.append('security_deposit', security_deposit)
      payload.append('cancellation_policy', cancellation_policy)
      payload.append('mileage_charges', mileage_charges)
      payload.append('custom_mileage_charge', custom_mileage_charge)
      payload.append('generator_charges', generator_charges)
      payload.append('custom_generator_charge', custom_generator_charge)
      images?.length > 0 &&
        images.map((image, index) =>
          payload.append(`images[${index}]image`, image)
        )
      const res = await createRV(payload)
      enqueueSnackbar(`Your RV Created!`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
      handleChange('loading', false)
      navigate('/')
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        alert(`Error: ${errorText[0]}`)
      } else {
        alert(`Error: ${error}`)
      }
    }
  }

  const selectRVOptions = () => {
    return (
      <>
        <option value={''}>Select</option>
        <option value={'Class A motorhome'}>Class A motorhome</option>
        <option value={'Class B motorhome'}>Class B motorhome</option>
        <option value={'Class C motorhome'}>Class C motorhome</option>
        <option value={'Travel trailer'}>Travel trailer</option>
        <option value={'Fifth wheel'}>Fifth wheel</option>
        <option value={'Pop-up camper'}>Pop-up camper</option>
        <option value={'Toy Hauler'}>Toy Hauler</option>
      </>
    )
  }

  const disabled =
    step === 5
      ? images?.length < 3
      : step === 4
      ? !per_night_price ||
        !per_week_price ||
        !per_month_price ||
        !minimum_trip_length ||
        !pickup_time ||
        !drop_off_time ||
        !security_deposit ||
        !cancellation_policy ||
        !mileage_charges ||
        !generator_charges
      : step === 3
      ? !name || !note || !total_beds || !total_bunks || !cargo_weight
      : step === 2
      ? !type ||
        !year ||
        !make ||
        !model ||
        !length ||
        !sleeping_capacity ||
        !dry_weight ||
        !gross_weight
      : step === 1
      ? !address
      : false

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={8} className='loginPaper p-4'>
              {step === 0 && (
                <>
                  <p className='font-18 font-bold600 text-center text_primary'>
                    You Can Earn Money Renting Your RV
                  </p>
                  <Divider className={'mt-2'} />
                  <AppInput
                    label={'Selcet your RV'}
                    value={type}
                    selectOptions={selectRVOptions()}
                    select
                    inputWidthFull
                    name={'type'}
                    onChange={handleChange}
                    className='mb-3 mt-3'
                    placeholder={'Selcet your RV'}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sm={6}>
                      <AppInput
                        className='mb-4 mt-3'
                        label={'Name'}
                        value={first_name}
                        name={'first_name'}
                        onChange={handleChange}
                        placeholder={'Name'}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                      <AppInput
                        label={'Last name'}
                        value={last_name}
                        name={'last_name'}
                        onChange={handleChange}
                        className='mb-3 mt-3'
                        placeholder={'Last name '}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                      <AppInput
                        className='mb-4 mt-3'
                        label={'Email address'}
                        value={email}
                        name={'email'}
                        onChange={handleChange}
                        placeholder={'Email address'}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              {step === 1 && (
                <>
                  <AutoComplete
                    apiKey='AIzaSyCaT232NT6_PEylByOmJLtt012HUUMSpGQ'
                    className='locationSearch'
                    defaultValue={address}
                    onPlaceSelected={place => {
                      handleChange('address', place?.formatted_address)
                    }}
                    placeholder='Full address?'
                  />
                  <div className='d-flex align-items-center mt-2 mb-3'>
                    <span className='mr-2'>Stationary rental ?</span>
                    <AppSwitch
                      {...label}
                      checked={stationary}
                      onClick={() => handleChange('stationary', !stationary)}
                    />
                  </div>

                  <p className='font-14 text_primary mb-5'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent cursus pretium augue, id posuere nisl vehicula
                    hendrerit. Phasellus elementum purus ligula, et scelerisque
                    diam viverra eu. Phasellus consectetur commodo volutpat.
                  </p>
                </>
              )}
              {step === 2 && (
                <AddDetails
                  first_name={first_name}
                  last_name={last_name}
                  email={email}
                  address={address}
                  dob={dob}
                  phone={phone}
                  type={type}
                  year={year}
                  make={make}
                  model={model}
                  length={length}
                  sleeping_capacity={sleeping_capacity}
                  dry_weight={dry_weight}
                  gross_weight={gross_weight}
                  handleChange={handleChange}
                />
              )}
              {step === 3 && (
                <Listing
                  name={name}
                  note={note}
                  total_beds={total_beds}
                  total_bunks={total_bunks}
                  cargo_weight={cargo_weight}
                  pet_friendly={pet_friendly}
                  wheelchair_accessible={wheelchair_accessible}
                  delivery={delivery}
                  smoking_allowed={smoking_allowed}
                  roof_air_conditioning={roof_air_conditioning}
                  hot_and_cold_water={hot_and_cold_water}
                  dvd={dvd}
                  microwave={microwave}
                  refrigerator={refrigerator}
                  kitchen_sink={kitchen_sink}
                  slide_out={slide_out}
                  range_stove={range_stove}
                  toilet={toilet}
                  shower={shower}
                  bathroom_sink={bathroom_sink}
                  tv={tv}
                  am_fm_radio={am_fm_radio}
                  cd_player={cd_player}
                  electric_generator={electric_generator}
                  trailer_connector_adapter={trailer_connector_adapter}
                  towable_electrical_service={towable_electrical_service}
                  trailer_ball_size={trailer_ball_size}
                  anti_sway_provided={anti_sway_provided}
                  dual_battery={dual_battery}
                  hitch_provided={hitch_provided}
                  campsite_electrical_service={campsite_electrical_service}
                  fresh_water_tank={fresh_water_tank}
                  temp_control_hot_cold_supply={temp_control_hot_cold_supply}
                  fire_extinguisher={fire_extinguisher}
                  handleChange={handleChange}
                />
              )}
              {step === 4 && (
                <Pricing
                  per_night_price={per_night_price}
                  per_week_price={per_week_price}
                  per_month_price={per_month_price}
                  pickup_time={pickup_time}
                  drop_off_time={drop_off_time}
                  minimum_trip_length={minimum_trip_length}
                  security_deposit={security_deposit}
                  cancellation_policy={cancellation_policy}
                  mileage_charges={mileage_charges}
                  custom_mileage_charge={custom_mileage_charge}
                  generator_charges={generator_charges}
                  custom_generator_charge={custom_generator_charge}
                  handleChange={handleChange}
                />
              )}
              {step === 5 && (
                <AddPhotos images={images} handleChange={handleChange} />
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={'Back'}
                    onClick={handleBack}
                    color={'rgba(168, 124, 81, 1)'}
                    borderColor={'rgba(168, 124, 81, 1)'}
                    backgroundColor={'#fff'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppButton
                    title={step ? 'Continue' : 'Get started'}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={disabled}
                    backgroundColor={'rgba(168, 124, 81, 1)'}
                    color={'#fff'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
