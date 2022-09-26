// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { AppInput, AppButton, Layout, Label } from '../../components'
import { Button, Grid, TextField } from '@mui/material'
import { COLORS } from '../../constants'
import rightArrow from '../../assets/svg/rightArrow.svg'
import avatar from '../../assets/images/avatar.png'
import { useNavigate } from 'react-router-dom'
import { createProfile, updateProfile } from '../../api/auth'
import AppContext from '../../Context'
import { FileUploader } from 'react-drag-drop-files'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { useContext } from 'react'
import { useState } from 'react'

const fileTypes = ['JPEG', 'JPG', 'PNG']

export default function Profile ({}) {
  const { user, _getProfile } = useContext(AppContext)
  const [state, setState] = useState({
    activeTab: 0,
    email: user?.email || '',
    bio: user?.bio || '',
    city: user?.city || '',
    zip_code: user?.zip_code || '',
    date_of_birth: user?.date_of_birth || new Date(),
    address: user?.address || '',
    loading: false,
    loadingSignup: false,
    checked: false,
    isEdit: false,
    pictureURL: user?.picture || '',
    picture: ''
  })

  const {
    first_name,
    bio,
    email,
    zip_code,
    loading,
    city,
    address,
    date_of_birth,
    picture,
    isEdit,
    pictureURL
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleUpdate = async () => {
    try {
      handleChange('loading', true)
      const payload = new FormData()
      payload.append('first_name', first_name)
      payload.append('bio', bio)
      payload.append('email', email)
      payload.append('zip_code', zip_code)
      payload.append('city', city)
      payload.append('address', address)
      payload.append(
        'date_of_birth',
        moment(date_of_birth).format('YYYY-MM-DD')
      )
      payload.append('picture', picture)
      await updateProfile(user?.id, payload)
      handleChange('loading', false)
      _getProfile()
      handleChange('isEdit', false)
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
  const cityOptions = () => {
    return (
      <>
        <option value={''}>Select City</option>
        <option value={'New York'}>New York</option>
        <option value={'Texas'}>Texas</option>
      </>
    )
  }

  const zipOptions = () => {
    return (
      <>
        <option value={''}>Select Zip Code</option>
        <option value={'10001'}>10001</option>
        <option value={'10002'}>10002</option>
      </>
    )
  }

  const handleChangeImage = file => {
    if (file) {
      handleChange('avatar', file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      handleChange('picture', file)
      reader.onloadend = function (e) {
        handleChange('pictureURL', reader.result)
      }
    }
  }
  const editProfile = () => {
    handleChange('first_name', user?.first_name)
    handleChange('bio', user?.bio)
    handleChange('email', user?.email)
    handleChange('zip_code', user?.zip_code)
    handleChange('city', user?.city)
    handleChange('address', user?.address)
    handleChange('date_of_birth', user?.date_of_birth)
    handleChange('isEdit', true)
  }
  return (
    <div>
      <Layout>
        <div className='container divCenter'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={6} lg={5} className='loginPaper'>
              <div className='avatarDiv mb-3'>
                <img
                  src={pictureURL || user?.picture || avatar}
                  className={'avatar'}
                />
                {isEdit && (
                  <FileUploader
                    multiple={false}
                    handleChange={handleChangeImage}
                    onDrag={handleChangeImage}
                    name='file1'
                    types={fileTypes}
                    className={'dragndropDiv1'}
                    children={
                      <AppButton
                        title={'Upload'}
                        backgroundColor={COLORS.white}
                        color={COLORS.primary}
                        borderRadius={50}
                        borderColor={COLORS.primary}
                        width={120}
                        height={40}
                        className={'mt-4'}
                      />
                    }
                  />
                )}
              </div>
              {isEdit ? (
                <AppInput
                  label={'Full Name'}
                  value={first_name}
                  name={'first_name'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  placeholder={'Enter Fullname'}
                />
              ) : (
                <>
                  <Label text={'Full Name'} />
                  <div className='profileText'>{user?.first_name}</div>
                </>
              )}
              {isEdit ? (
                <AppInput
                  label={'Email'}
                  value={email}
                  name={'email'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  placeholder={'Enter Email'}
                />
              ) : (
                <>
                  <Label text={'Email'} />
                  <div className='profileText'>{user?.email}</div>
                </>
              )}
              {isEdit ? (
                <AppInput
                  label={'Bio'}
                  value={bio}
                  name={'bio'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  multiline
                  height={150}
                  placeholder={'Enter Bio'}
                />
              ) : (
                <>
                  <Label text={'Bio'} />
                  <div className='profileText'>{user?.bio}</div>
                </>
              )}
              {isEdit ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={false}
                    inputFormat='MM/dd/yyyy'
                    maxDate={Date.now()}
                    value={date_of_birth}
                    onChange={value =>
                      handleChange(
                        'date_of_birth',
                        moment(value).format('YYYY-MM-DD')
                      )
                    }
                    renderInput={params => (
                      <>
                        <Label text={'Date of Birth'} />
                        <TextField
                          className={'inputHeight1'}
                          sx={{ width: '100%' }}
                          {...params}
                        />
                      </>
                    )}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Label text={'Date of Birth'} />
                  <div className='profileText'>{user?.date_of_birth}</div>
                </>
              )}
              {isEdit ? (
                <AppInput
                  label={'Address'}
                  value={address}
                  name={'address'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  placeholder={'Enter Address'}
                />
              ) : (
                <>
                  <Label text={'Address'} />
                  <div className='profileText'>{user?.address}</div>
                </>
              )}
              {isEdit ? (
                <AppInput
                  label={'City'}
                  value={city}
                  // select
                  // selectOptions={cityOptions()}
                  name={'city'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  placeholder={'Enter City'}
                />
              ) : (
                <>
                  <Label text={'City'} />
                  <div className='profileText'>{user?.city}</div>
                </>
              )}
              {isEdit ? (
                <AppInput
                  label={'Zip Code'}
                  value={zip_code}
                  // select
                  // selectOptions={zipOptions()}
                  name={'zip_code'}
                  onChange={handleChange}
                  className='mb-3 mt-3'
                  placeholder={'Enter Zip Code'}
                />
              ) : (
                <>
                  <Label text={'Zip Code'} />
                  <div className='profileText'>{user?.zip_code}</div>
                </>
              )}
              <AppButton
                title={!isEdit ? 'Edit' : 'Save'}
                onClick={() => (isEdit ? handleUpdate() : editProfile())}
                loading={loading}
                // disabled={}
                backgroundColor={COLORS.primary}
                color={'#fff'}
              />
              {isEdit && (
                <Button
                  // onClick={handleUpdate}
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    backgroundColor: COLORS.white,
                    borderColor: COLORS.primary,
                    marginTop: 20,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    color: COLORS.primary,
                    textTransform: 'capitalize',
                    height: 50
                  }}
                >
                  <div
                    style={{ width: '90%' }}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div>Change Password</div>
                    <img src={rightArrow} />
                  </div>
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
