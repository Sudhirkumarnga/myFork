// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useContext, useEffect, useState } from 'react'
import {
  HomeFooter,
  AppInput,
  HomeHeader,
  AppButton,
  MainFooter
} from '../../components'
import { Element } from 'react-scroll'
import { Divider, Grid, Paper, TextField } from '@mui/material'
import ReactStars from 'react-stars'
import Bus1 from '../../assets/images/Bus1.png'
import stars from '../../assets/svg/stars.svg'
import bus from '../../assets/svg/bus.svg'
import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
import people from '../../assets/svg/people.svg'
import headphone from '../../assets/svg/headphone.svg'
import { useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { COLORS } from '../../constants'

export default function MainHome ({}) {
  const navigate = useNavigate()
  const { listRVS } = useContext(AppContext)
  const [state, setState] = useState({
    splash: true
  })

  const { splash } = state
  useEffect(() => {
    setTimeout(() => {
      handleChange('splash', false)
    }, 3000)
  }, [])

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const types = [
    { image: stars, title: 'More 5-star ratings' },
    { image: people, title: 'Real people here help 24/7' },
    { image: headphone, title: '24/7 assistance & insurance' }
  ]

  const handleSearch = () => {
    navigate('/recommandation')
  }

  return (
    <div className='home'>
      <Logo />
      {!splash && (
        <Grid container direction='column' alignItems={'center'} className=''>
          <div className='text-white text-center font-16 mt-5 mb-5'>I am a</div>
          <AppButton
            title={'Business Admin'}
            className={'mb-3'}
            onClick={() => navigate('/login')}
            width={300}
          />
          <AppButton
            title={'Employee'}
            width={300}
            onClick={() => navigate('/login')}
          />
        </Grid>
      )}
    </div>
  )
}
