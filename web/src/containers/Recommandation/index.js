// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useCallback, useContext, useRef, useState } from 'react'
import { HomeFooter, AppInput, HomeHeader } from '../../components'
import { Element } from 'react-scroll'
import { Grid, Paper, Switch, TextField } from '@mui/material'
import ReactStars from 'react-stars'
import Bus1 from '../../assets/images/Bus1.png'
import { styled } from '@mui/material/styles'
import heartWhite from '../../assets/svg/heartWhite.svg'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { Link } from 'react-router-dom'
import AppContext from '../../Context'

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

export default function Recommandation ({}) {
  const { listRVS } = useContext(AppContext)
  const [state, setState] = useState({
    showMap: false
  })

  const { showMap } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA8qkmVxCJuE2_LSU14ogM1vjnoEsRi_Iw'
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback (map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback (map) {
    setMap(null)
  }, [])
  const label = { inputProps: { 'aria-label': 'Switch demo' } }


  return (
    <div>
      <HomeHeader />
      <Element name='Element1' className='element height75Mobile'>
        <section className=''>
          <Grid container justifyContent={'center'} className={'mt-4'}>
            <Paper sx={{ width: '100%' }}>
              <Grid container alignItems={'center'} sx={{ pl: 4, pt: 4 }}>
                <div>Home / Terms and conditions</div>
              </Grid>
              <Grid container className='mt-3 pb-4 pl-4 pr-5 pm-3'>
                <Grid container spacing={3} className=' mb-4 mt-2'>
                  <Grid md={6} xs={12} item>
                    <AppInput variant={'filled'} placeholder={'Where to?'} />
                  </Grid>
                  <Grid
                    md={6}
                    xs={12}
                    item
                    spacing={2}
                    container
                    className='d-flex justify-content-between'
                  >
                    <Grid md={4} xs={12} item>
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
                    <Grid md={4} xs={12} item>
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
                    <Grid md={4} xs={12} item>
                      <select className='dropdown'>
                        <option>Guest</option>
                        <option>Guest</option>
                        <option>Guest</option>
                      </select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container className={'mb-3'} spacing={2}>
                  <Grid md={5} xs={12} item container spacing={2}>
                    <Grid md={4} xs={12} item>
                      <select className='dropdown'>
                        <option>Guest</option>
                        <option>Guest</option>
                        <option>Guest</option>
                      </select>
                    </Grid>
                    <Grid md={4} xs={12} item>
                      <select className='dropdown'>
                        <option>Guest</option>
                        <option>Guest</option>
                        <option>Guest</option>
                      </select>
                    </Grid>
                    <Grid md={4} xs={12} item>
                      <select className='dropdown'>
                        <option>Guest</option>
                        <option>Guest</option>
                        <option>Guest</option>
                      </select>
                    </Grid>
                  </Grid>
                  <Grid md={7} xs={12} item container spacing={2}>
                    <Grid md={3} xs={12} item>
                      <div className='buttonDeliveryActive'>Delivery</div>
                    </Grid>
                    <Grid md={3} xs={12} item>
                      <div className='buttonDelivery'>Allow Pets</div>
                    </Grid>
                    <Grid md={3} xs={12} item>
                      <Link to={'/more-filter'}>
                        <div className='buttonDelivery'>More filters</div>
                      </Link>
                    </Grid>
                    <Grid md={3} xs={12} item>
                      <div className='d-flex align-items-center mt-2'>
                        <span className='mr-2'>Show on the map:</span>
                        <IOSSwitch
                          {...label}
                          checked={showMap}
                          onClick={() => handleChange('showMap', !showMap)}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </section>
      </Element>
      <section className='howitwork mb-5'>
        <div className='ml-4'>
          <Grid container spacing={3}>
            <Grid md={showMap ? 8 : 12} xs={12} item container spacing={3}>
              {listRVS?.map((rv, index) => (
                <Grid key={index} item md={4} sm={6} xs={12}>
                  <div className='paperList'>
                    <div className='heartWhite'>
                      <img src={heartWhite} />
                    </div>
                    <img
                      src={rv.images?.length > 0 ? rv.images[0]?.image : Bus1}
                      className={'rvImage'}
                    />
                    <div className='listallRVcard'>
                      <div className='text_primary mb-2 font-18'>
                        {rv?.name}
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
                      <div className='font-14 text_primary'>
                        Drivables / {rv?.year} / {rv?.length} ft / Port Orchard,
                        WA / Sleeps {rv?.sleeping_capacity}
                      </div>
                      <div className='priceBox'>
                        ${rv?.per_night_price}/
                        <span className='font-14'>night</span>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
            {showMap && (
              <Grid md={4} xs={12} item>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{
                      width: '95%',
                      height: '97%'
                    }}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {/* Child components, such as markers, info windows, etc. */}
                    <></>
                  </GoogleMap>
                ) : (
                  <></>
                )}
              </Grid>
            )}
          </Grid>
        </div>
      </section>

      <HomeFooter showCOntactUsMobile />
      {/* <MainFooter /> */}
    </div>
  )
}
