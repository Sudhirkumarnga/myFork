// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import {
  HomeFooter,
  AppInput,
  HomeHeader,
  AppButton,
  Loader
} from '../../components'
import {
  Divider,
  Grid,
  Paper,
  Modal,
  Box,
  TextField,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl
} from '@mui/material'
import ReactStars from 'react-stars'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import share from '../../assets/svg/share.svg'
import heart from '../../assets/svg/heart.svg'
import UserProfile from '../../assets/svg/userProfile.svg'
import check from '../../assets/svg/check.svg'
import cross from '../../assets/svg/cross.svg'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import Slider from 'react-slick'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuote, getRVDetail } from '../../api/rvlisting'
import { Link, Element } from 'react-scroll'
import { addDays } from 'date-fns'
import { DateRange } from 'react-date-range'
import moment from 'moment'
const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  slidesToShow: 3,
  speed: 500
}

const center = {
  lat: -3.745,
  lng: -38.523
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
}

export default function Home ({}) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ])
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA8qkmVxCJuE2_LSU14ogM1vjnoEsRi_Iw'
  })
  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback (map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback (map) {
    setMap(null)
  }, [])
  const [state, setState] = useState({
    openBooking: false,
    rvData: null,
    loading: false,
    unavailability: [],
    showPrice: '1',
    pickup_date: new Date(),
    dropoff_date: new Date(),
    quote: null,
    number_of_days: 1
  })

  const {
    openBooking,
    loading,
    rvData,
    unavailability,
    showPrice,
    dropoff_date,
    pickup_date,
    quote,
    number_of_days
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    if (id) {
      _getRVDetail()
    }
  }, [id])

  const _getRVDetail = async () => {
    try {
      handleChange('loading', true)
      const res = await getRVDetail(id)
      handleChange('rvData', res?.data)

      const datesSelected = []
      res?.data?.unavailability?.forEach(element => {
        const body = {
          startDate: new Date(element?.start_date),
          endDate: new Date(element?.end_date),
          key: 'selection'
        }
        datesSelected.push(body)
      })
      handleChange('unavailability', datesSelected)
      handleChange('loading', false)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }
  const _getQuote = async newValue => {
    try {
      handleChange('loadingQuote', true)
      const payload = {
        pickup_date: moment(pickup_date).format('YYYY-MM-DD'),
        dropoff_date: moment(newValue).format('YYYY-MM-DD'),
        rv: rvData?.id
      }
      const res = await getQuote(payload, id)
      handleChange('quote', res?.data)
      var a = moment(pickup_date)
      var b = moment(newValue)
      const c = a.diff(b, 'days') // =1

      handleChange('number_of_days', c)
      handleChange('loadingQuote', false)
    } catch (error) {
      handleChange('loadingQuote', false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const handleClose = () => {
    handleChange('openBooking', false)
  }

  const ruleList = [
    'Etiam ut odio facilisis, commodo libero ac, dapibus tellus.',
    'Nulla eu aliquet nisl. Commodo liberoSuspendisse aliquet tellus.',
    'Ut posuere vestibulum aliquam.',
    'Etiam ut odio facilisis, commodo libero ac, dapibus tellus.',
    'Nulla eu aliquet nisl. Commodo liberoSuspendisse aliquet tellus.',
    'Ut posuere vestibulum aliquam.'
  ]

  const ratingList = [
    { text: 'Accuracy', rating: '5' },
    { text: 'Amenities', rating: '5' },
    { text: 'Rental Value', rating: '5' },
    { text: 'Pick Up', rating: '5' },
    { text: 'Cleanliness', rating: '5' },
    { text: 'Communication', rating: '5' }
  ]
  const coments = [
    {
      coment:
        'This was a great experience, the rental unit was absolutely beautiful. It said on the rental agreement to bring my own hitch ball adapter. However, on the day of pickup my ball adapter ended up breaking. The owner was quick to respond and offered to lend me his for the trip. The owner was also very quick to respond prior to pickup and during the trip when we had questions about the rental unit.'
    },
    {
      coment:
        'Great to work with for pick-up and drop-off. Unit was clean and very well stocked. I would recommend renting.'
    }
  ]

  if (loading) {
    return <Loader />
  }

  console.log('rvData', rvData)

  return (
    <div>
      <HomeHeader />
      <section className=''>
        <Paper>
          <Slider {...settings}>
            {rvData?.images?.map(image => (
              <img
                key={image?.id}
                src={image?.image}
                className={'rvimageslider'}
              />
            ))}
          </Slider>
          <div className='container rowButtons'>
            <Grid container spacing={2}>
              <Grid item md={5} xs={12} spacing={2} container>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test1'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Description
                  </Link>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test2'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Amenities{' '}
                  </Link>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test3'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Reviews{' '}
                  </Link>
                </Grid>
              </Grid>
              <Grid item md={7} xs={12} spacing={2} container>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test4'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Rules and policies{' '}
                  </Link>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test5'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Rates and Availability
                  </Link>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Link
                    activeClass='active'
                    to='test6'
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className='buttonDeliveryDetails'
                  >
                    Map{' '}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </section>

      <section className='howitwork'>
        <div className='container'>
          <div className='d-flex justify-content-between'>
            <div>
              <p className='font-30 text_primary'>{rvData?.name}</p>
              <p className='font-14 text_primary'>
                Class {rvData?.type} / Year: {rvData?.year}
              </p>
            </div>
            <div>
              <img src={heart} className={'mr-3 c-pointer'} />
              <img src={share} className={'c-pointer'} />
            </div>
          </div>
          <Grid container spacing={2} className={'mt-4'}>
            <Grid item md={4} sm={6} xs={12}>
              <div className='text_primary font-18 font-weight-bold'>
                Summary
              </div>
              <div className='howitworkdescription'>
                {rvData?.address} / Sleeps {rvData?.sleeping_capacity} /{' '}
                {rvData?.year} / Travel Trailer/ 24.0ft
              </div>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <div className='text_primary font-18 font-weight-bold'>
                Cleanliness
              </div>
              <Grid container alignItems={'center'}>
                <div className='listpool font-16 mr-2'>5</div>
                <ReactStars
                  count={5}
                  value={5}
                  // onChange={ratingChanged}
                  size={24}
                  color2={'#a87c51'}
                />
              </Grid>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <div className='text_primary font-18 font-weight-bold'>
                Delivery Options
              </div>
              <div className='howitworkdescription'>
                $50 round trip for the first 20 miles + $3/mile up to 60 miles
              </div>
            </Grid>
          </Grid>
          <Element name='test1'>
            <Grid container spacing={3} className={'mt-2 mb-5'}>
              <Grid item md={8} xs={12}>
                <Paper
                  sx={{ p: 4, boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)' }}
                >
                  <div className='text_primary font-18 mb-3'>Description</div>
                  <div className='font-14 text_primary'>{rvData?.note}</div>
                </Paper>
              </Grid>
              <Grid item md={4} xs={12}>
                <Paper
                  sx={{ p: 4, boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)' }}
                >
                  <div className='d-flex align-items-center'>
                    <img src={UserProfile} className={'usericon'} />
                    <div className='text_primary font-18 ml-3'>
                      Alek Johanson
                    </div>
                  </div>
                  <div className='contactOwner mt-3'>
                    <AppButton
                      title={'Contact the owner'}
                      borderColor={'rgba(168, 124, 81, 1)'}
                      backgroundColor={'transparent'}
                      color={'rgba(168, 124, 81, 1)'}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Element>
          <Element name='test2'>
            <p className='font-30 text_primary mt-4'>Amenities </p>
            <p className='font-18 text_primary mt-4'>RV details </p>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Year: {rvData?.year}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Manufacturer: {rvData?.manufacturer}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Make: {rvData?.make}
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Model: {rvData?.model}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Class: {rvData?.type}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Sleeps: {rvData?.sleeping_capacity}
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Number of bunk beds: {rvData?.total_bunks}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Total number of beds: {rvData?.total_beds}
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Slides: {rvData?.slide_out}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Length: {rvData?.length} ft
                </div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Towable features </p>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Gross weight: {rvData?.gross_weight} lbs
                </div>
                <div className='text_primary font-14 mt-1'>
                  Cargo weight: {rvData?.cargo_weight} lbs
                </div>
                <div className='text_primary font-14 mt-1'>
                  Dry weight: {rvData?.dry_weight} lbs
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Trailer connector type: {rvData?.trailer_connector_type}
                </div>
                {rvData?.trailer_connector_adapter && (
                  <div className='text_primary font-14 mt-1'>
                    Trailer connecter adapter
                  </div>
                )}
                {/* <div className='text_primary font-14 mt-1'>provided: {rvData?.hitch_provided ? 'Yes' : 'No'}</div> */}
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Electrical service:{' '}
                  {rvData?.towable_electrical_service ? 'Yes' : 'No'}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Trailer ball size: {rvData?.trailer_ball_size} Anti-sway
                </div>
                <div className='text_primary font-14 mt-1'>
                  provided: {rvData?.anti_sway_provided ? 'Yes' : 'No'}
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Dual Battery: {rvData?.dual_battery ? 'Yes' : 'No'}
                </div>
                <div className='text_primary font-14 mt-1'>
                  Hitch provided: {rvData?.hitch_provided ? 'Yes' : 'No'}
                </div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Campsite essentials </p>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  {rvData?.campsite_electrical_service ? (
                    <img src={check} className={'mr-2'} />
                  ) : (
                    <img src={cross} className={'mr-2'} />
                  )}
                  Electrical Service: -
                </div>
                <div className='text_primary font-14 mt-1'>
                  {rvData?.fresh_water_tank ? (
                    <img src={check} className={'mr-2'} />
                  ) : (
                    <img src={cross} className={'mr-2'} />
                  )}
                  Fresh Water Tank: 30.0 gal
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  {rvData?.length > 0 ? (
                    <img src={check} className={'mr-2'} />
                  ) : (
                    <img src={cross} className={'mr-2'} />
                  )}
                  Length: {rvData?.length || 0} ft
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  {rvData?.electric_generator ? (
                    <img src={check} className={'mr-2'} />
                  ) : (
                    <img src={cross} className={'mr-2'} />
                  )}
                  Electric Generator: {rvData?.generator_charges || '-'}
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  <img src={check} className={'mr-2'} />
                  Hot and Cold Water Supp:{' '}
                  {rvData?.hot_and_cold_water ? 'Yes' : 'No'}
                </div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Kitchen </p>
            <Grid container spacing={2}>
              {(rvData?.kitchen_sink || rvData?.refrigerator) && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Refrigerator</div>
                  <div className='text_primary font-14 mt-1'>Kitchen Sink</div>
                </Grid>
              )}
              {rvData?.slide_out && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Slide Out</div>
                </Grid>
              )}
              {rvData?.microwave && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Microwave</div>
                </Grid>
              )}
              {rvData?.range_stove && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Range (Stove)</div>
                </Grid>
              )}
            </Grid>
            <p className='font-18 text_primary mt-5'>Bathroom</p>
            <Grid container spacing={2}>
              {rvData?.toilet && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Toilet</div>
                </Grid>
              )}
              {rvData?.shower && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Shower</div>
                </Grid>
              )}
              {rvData?.bathroom_sink && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>Bathroom Sink</div>
                </Grid>
              )}
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'></div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Temperature control</p>
            <Grid container spacing={2}>
              {rvData?.temp_control_hot_cold_supply && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>
                    Hot & Cold Water Supply
                  </div>
                </Grid>
              )}
              {rvData?.roof_air_conditioning && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>
                    Roof Air Conditioning
                  </div>
                </Grid>
              )}
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'></div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'></div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Entertainment</p>
            <Grid container spacing={2}>
              {rvData?.tv && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>TV</div>
                </Grid>
              )}
              {rvData?.dvd && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>DVD Player</div>
                </Grid>
              )}
              {rvData?.am_fm_radio && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>AM/FM Radio</div>
                </Grid>
              )}
              {rvData?.cd_player && (
                <Grid item md={3} sm={6} xs={12}>
                  <div className='text_primary font-14 mt-1'>CD Player</div>
                </Grid>
              )}
            </Grid>
            <p className='font-18 text_primary mt-5'>More</p>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  Fire Extinguisher
                </div>
              </Grid>
            </Grid>
          </Element>
          <Element name='test3'>
            <p className='font-30 text_primary mt-5'>Reviews </p>
            <p className='font-18 text_primary mt-2 mb-2'>
              Rating per parameters
            </p>
            <Grid container spacing={2}>
              {ratingList.map((rating, index) => (
                <Grid
                  key={index}
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  container
                  justifyContent={'space-between'}
                >
                  <div className='text_primary font-14 mt-1'>{rating.text}</div>
                  <div className='d-flex align-items-center'>
                    <div className='listpool font-16 mr-2'>{rating.rating}</div>
                    <ReactStars
                      count={5}
                      value={Number(rating.rating)}
                      // onChange={ratingChanged}
                      size={24}
                      color2={'#a87c51'}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
            <p className='font-30 text_primary mt-5'>Comments </p>
            {coments.map((coment, index) => (
              <Grid key={index} container className={'mt-2 mb-3'}>
                <Paper
                  sx={{
                    width: '100%',
                    p: 4,
                    boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center'>
                      <img src={UserProfile} className={'usericon'} />
                      <div className='ml-3'>
                        <div className='text_primary font-18 '>
                          Alek Johanson
                        </div>
                        <div className='text_primary06 font-14'>March 2022</div>
                      </div>
                    </div>
                    <ReactStars
                      count={5}
                      value={5}
                      // onChange={ratingChanged}
                      size={24}
                      color2={'#a87c51'}
                    />
                  </div>
                  <div className='font-14 text_primary06 lineHight30 mt-3'>
                    {coment.coment}
                  </div>
                </Paper>
              </Grid>
            ))}
            <p className='font-24 text_primary mt-4'>Leave a comment </p>
            <Grid container className={'mt-2 mb-3'}>
              <Paper
                sx={{
                  width: '100%',
                  height: 250,
                  p: 1,
                  border: 'none',
                  boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)'
                }}
              >
                <AppInput
                  inputWidthFull
                  backgroundColor={'#fff'}
                  border={'none'}
                  placeholder={'Text'}
                  multiline
                />
              </Paper>
            </Grid>
            <Grid container className='mb-5'>
              <Grid item md={3} sm={6} xs={12}>
                <AppButton
                  title={'Leave a comment'}
                  backgroundColor={'rgba(168, 124, 81, 1)'}
                  color={'#fff'}
                />
              </Grid>
            </Grid>
          </Element>
          <Element name='test4'>
            <p className='font-30 text_primary mt-5'>Rules and policies </p>
            <Grid container spacing={3} className={'mt-2 mb-5'}>
              <Grid item md={6} xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div className='text_primary font-18 '>
                    Pick up time:{' '}
                    <span className='text_secondary'>
                      {rvData?.pickup_time}
                    </span>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={6} xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '12px 12px 30px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div className='text_primary font-18'>
                    Drop of time:{' '}
                    <span className='text_secondary'>
                      {rvData?.drop_off_time}
                    </span>
                  </div>
                </Paper>
              </Grid>
            </Grid>
            <p className='font-24 text_primary mt-4'>Cancellation Policy </p>
            <ul>
              <li className='liDots'>
                Etiam ut odio facilisis, commodo libero ac, dapibus tellus
              </li>
              <li className='liDots'>
                Nulla eu aliquet nisl. Commodo liberoSuspendisse aliquet tellus
                eget sagittis porttitor.
              </li>
              <li className='liDots'>
                Ut posuere vestibulum aliquam. Quisque consequat est in ligula.
              </li>
            </ul>
            <p className='font-14 text_primary06 mt-4'>
              {rvData?.cancellation_policy}
            </p>
            <p className='font-18 text_primary mt-5'>Security deposit </p>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <div className='text_primary font-14 mt-1'>
                  ${rvData?.security_deposit}
                </div>
              </Grid>
            </Grid>
            <p className='font-18 text_primary mt-5'>Rental rules </p>
            <Grid container spacing={2} className={'mt-1 mb-5'}>
              {ruleList.map((rule, index) => (
                <Grid key={index} item sm={6} xs={12} container>
                  <img src={check} className={'mr-2'} />
                  <div className='text_primary font-14'>{rule}</div>
                </Grid>
              ))}
            </Grid>
          </Element>
          <Element name='test5'>
            <p className='font-30 text_primary mt-4'>Rates & Availability </p>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Price per night</div>
                <div className='font-24 text_primary'>
                  ${rvData?.per_night_price}
                </div>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Price per week</div>
                <div className='font-24 text_primary'>
                  ${rvData?.per_week_price}
                </div>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Price per month</div>
                <div className='font-24 text_primary'>
                  ${rvData?.per_month_price}
                </div>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Rental fees</div>
                <div className='font-24 text_primary'>
                  ${rvData?.per_night_price}
                </div>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Mileage</div>
                <div className='font-24 text_primary'>
                  {rvData?.mileage_charges}
                </div>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <div className='text_primary font-14'>Post trip fees </div>
                <div className='font-24 text_primary'>
                  ${rvData?.per_night_price}
                </div>
              </Grid>
            </Grid>
          </Element>
          <p className='font-24 text_primary mt-4'>Availability </p>
          {unavailability.length > 0 && (
            <DateRange
              onChange={item =>
                handleChange('unavailability', [
                  ...unavailability,
                  item.selection
                ])
              }
              className='calender'
              showSelectionPreview={false}
              editableDateInputs={false}
              showDateDisplay={false}
              startDatePlaceholder={false}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={unavailability}
              direction='horizontal'
            />
          )}
          <Element name='test6'>
            <p className='font-30 text_primary mt-4'>Map view </p>
            <Grid container sx={{ height: 400 }}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '100%',
                    marginTop: 20
                  }}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  <></>
                </GoogleMap>
              ) : (
                <></>
              )}
            </Grid>
          </Element>
          <Grid container spacing={2} className={'mt-5'}>
            <Grid item md={3} sm={6} xs={12}>
              <AppButton
                title={'Back'}
                borderColor={'rgba(168, 124, 81, 1)'}
                backgroundColor={'transparent'}
                color={'rgba(168, 124, 81, 1)'}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <AppButton
                title={'Ask owner'}
                borderColor={'rgba(168, 124, 81, 1)'}
                backgroundColor={'transparent'}
                color={'rgba(168, 124, 81, 1)'}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <AppButton
                title={'Cancel booking'}
                borderColor={'rgba(168, 124, 81, 1)'}
                backgroundColor={'transparent'}
                color={'rgba(168, 124, 81, 1)'}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <AppButton
                title={'Make a booking'}
                onClick={() => handleChange('openBooking', true)}
                backgroundColor={'rgba(168, 124, 81, 1)'}
                color={'#fff'}
              />
            </Grid>
          </Grid>
        </div>
      </section>
      <Modal
        open={openBooking}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Grid container justifyContent={'space-between'}>
            <p className='font-30 font-bold text_secondary'>
              $
              {showPrice === '1'
                ? rvData?.per_night_price
                : showPrice === '2'
                ? rvData?.per_week_price
                : rvData?.per_month_price}
            </p>
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='female'
                  row
                  value={showPrice}
                  onChange={value =>
                    handleChange('showPrice', value.target.value)
                  }
                  name='radio-buttons-group'
                >
                  <FormControlLabel
                    value='1'
                    control={<Radio className='text_secondary' />}
                    label='per night'
                  />
                  <FormControlLabel
                    value='2'
                    control={<Radio className='text_secondary' />}
                    label='per week'
                  />
                  <FormControlLabel
                    value='3'
                    control={<Radio className='text_secondary' />}
                    label='per month'
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Divider />
          <Grid container spacing={3} className='mb-4 mt-2'>
            <Grid md={6} xs={12} item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  style={{ width: '100%' }}
                  label={false}
                  value={pickup_date}
                  minDate={new Date()}
                  onChange={newValue => {
                    handleChange('pickup_date', newValue)
                  }}
                  renderInput={params => (
                    <TextField sx={{ width: '100%' }} {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid md={6} xs={12} item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  minDate={new Date(pickup_date)}
                  label={false}
                  OpenPickerButtonProps={false}
                  value={dropoff_date}
                  onChange={newValue => {
                    handleChange('dropoff_date', newValue)
                    _getQuote(newValue)
                  }}
                  renderInput={params => (
                    <TextField sx={{ width: '100%' }} {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {quote && (
            <>
              <p className='mb-3 font-18 text_secondary'>Total price</p>

              <Divider />
              <Grid className='rowBetween pt-2 pb-3'>
                <p className='font-16 text_primary'>
                  ${rvData?.per_night_price} x {Math.abs(number_of_days)}{' '}
                  Nights:
                </p>
                <p className='font-16 text_primary'>${quote?.sub_total}</p>
              </Grid>
              <Divider />
              <Grid className='rowBetween pt-2 pb-3'>
                <p className='font-16 text_primary'>Taxes and fees:</p>
                <p className='font-16 text_primary'>${quote?.taxes_and_fees}</p>
              </Grid>
              <Divider />
              <Grid className='rowBetween pt-2 pb-3'>
                <p className='font-16 font-bold text_secondary'>Total</p>
                <p className='font-16 font-bold text_secondary'>
                  ${quote?.total}
                </p>
              </Grid>
            </>
          )}
          <Divider className='mb-3' />
          <AppButton
            title='Book'
            disabled={!quote}
            onClick={() =>
              navigate(
                `/booking/${rvData?.id}?from=${moment(pickup_date).unix()}&to=${moment(dropoff_date).unix()}`
              )
            }
            color={'#fff'}
            backgroundColor={'rgba(168, 124, 81, 1)'}
          />
        </Box>
      </Modal>
      <HomeFooter showCOntactUsMobile />
      {/* <MainFooter /> */}
    </div>
  )
}
