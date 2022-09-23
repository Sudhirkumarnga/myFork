// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useRef, useState } from 'react'
import { AppButton, AppInput, HomeFooter, HomeHeader } from '../../components'
import { Grid, Tab, Tabs, Typography, Box, Checkbox } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import uploadphoto from '../../assets/svg/uploadphoto.svg'
import videoupload from '../../assets/svg/videoupload.svg'

export default function UploadPhoto ({}) {
  const imageRef = useRef()
  const videoRef = useRef()
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [state, setState] = useState({
    image1: '',
    video1: '',
    loading: false,
    loadingSignup: false,
    checked: false
  })

  useEffect(() => {
    if (path) {
      handleChange('activeTab', path === '/signup' ? 0 : 1)
    }
    if (user) {
      navigate('/')
    }
  }, [path, user])

  const { video1, email, password, loading, image1 } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const selectFile = () => {
    imageRef.current.click()
  }

  const selectFile1 = () => {
    videoRef.current.click()
  }

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = e => {
        handleChange('image1', e.target.result)
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  const onVideoChange = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = e => {
        handleChange('video1', e.target.result)
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  const handleLogin = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      localStorage.setItem('token', res?.data?.token)
      localStorage.setItem('user', JSON.stringify(res?.data?.user))
      handleChange('loading', false)
      setUser(res?.data?.user)
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

  return (
    <div>
      <HomeHeader />
      <section>
        <div className='container divCenter loginContainer'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={4} className='loginPaper p-4'>
              <p className='text_primary font-bold font-18 mb-3'>
                Upload photo
              </p>
              <div onClick={selectFile} className='add_grp_image_div1'>
                {image1 && <img src={image1} className='add_grp_image' />}
                <input
                  type='file'
                  onChange={onImageChange}
                  ref={imageRef}
                  accept='image/*'
                  style={{ display: 'none' }}
                  className='filetype'
                  id='group_image'
                />
                {!image1 && (
                  <div className='uploadPhoto'>
                    <img src={uploadphoto} />
                    <p className='text_secondary font-18 mt-2'>Upload photo</p>
                  </div>
                )}
              </div>
              <div onClick={selectFile1} className='add_grp_image_div1 mt-4'>
                {video1 && <video src={video1} className='add_grp_image' />}
                <input
                  type='file'
                  onChange={onVideoChange}
                  accept='video/*'
                  ref={videoRef}
                  style={{ display: 'none' }}
                  className='filetype'
                  id='group_image'
                />
                {!video1 && (
                  <div className='uploadPhoto'>
                    <img src={videoupload} />
                    <p className='text_secondary font-18 mt-2'>Upload video</p>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
