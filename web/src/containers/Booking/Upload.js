// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react'
import {
  AppButton,
  AppInput,
  HomeFooter,
  HomeHeader,
  Layout
} from '../../components'
import { Grid, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { createFeedback, loginUser, signupUser } from '../../api/auth'
import AppContext from '../../Context'
import { useContext } from 'react'
import { COLORS } from '../../constants'
import uploadIcon from '../../assets/svg/uploadIcon.svg'
import deleteIcon from '../../assets/svg/delete.svg'
import { FileUploader } from 'react-drag-drop-files'

const fileTypes = [
  'JPEG',
  'PNG',
  'GIF',
  'MP4',
  'PDF',
  'PSD',
  'AI',
  'Word',
  'PPT'
]

export default function Upload ({}) {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const path = window.location.pathname
  const [files, setFile] = useState([])
  const [state, setState] = useState({
    activeTab: 0,
    email: '',
    password: '',
    emailSignup: '',
    passwordSignup: '',
    message: '',
    loading: false,
    loadingSignup: false,
  })

  const {
    activeTab,
    email,
    password,
    loading,
    emailSignup,
    passwordSignup,
    loadingSignup,
    message
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleTab = value => {
    if (value === 0) {
      navigate('/signup')
    } else {
      navigate('/login')
    }
    handleChange('activeTab', value)
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

  const handleSignup = async () => {
    try {
      handleChange('loadingSignup', true)
      const payload = {
        message
      }
      const res = await createFeedback(payload)
      handleChange('loadingSignup', false)
      handleChange('message', '')
      alert('Feedback has been submitted')
      navigate(-1)
    } catch (error) {
      handleChange('loadingSignup', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        alert(`Error: ${errorText[0]}`)
      } else {
        alert(`Error: ${error}`)
      }
    }
  }

  const handleChangeImage = file => {
    if (file) {
      for (let i = 0; i < file.length; i++) {
        const element = file[i]
        const reader = new FileReader()
        reader.readAsDataURL(element)
        handleChange('picture', element)
        reader.onloadend = function (e) {
          //   handleChange('pictureURL', reader.result)
          setFile(pre => [...pre, { name: element?.name, url: reader.result }])
        }
      }
    }
  }


  return (
    <div>
      <Layout>
        <div className='container minheight80vh'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={6} className='loginPaper p-4'>
              <FileUploader
                multiple={true}
                handleChange={handleChangeImage}
                onDrag={handleChangeImage}
                name='files'
                types={fileTypes}
                className={'dragndropDiv1'}
                children={
                  <div className='dragContainer'>
                    <img src={uploadIcon} />
                    <p className='text_primary text-center font-bold font-18 mt-3'>
                      Drag & drop files or Browse
                    </p>
                    <p className='text_primary text-center font-14 mb-3'>
                      Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI,
                      Word, PPT
                    </p>
                  </div>
                }
              />
              {files.length > 0 && (
                <>
                <p className='text_primary font-bold font-14 mt-3'>
                    Uploaded
                    </p>
                  {files?.map((file, index) => {
                    return (
                      <Button
                        key={index}
                        // onClick={() => navigate(setting.route)}
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
                          <div>{file?.name}</div>
                          <img src={deleteIcon} />
                        </div>
                      </Button>
                    )
                  })}
                </>
              )}

              <AppButton
                title={'Upload Invoice'}
                onClick={handleSignup}
                loading={loadingSignup}
                disabled={!message}
                className={'mt-4'}
                backgroundColor={COLORS.primary}
                color={'#fff'}
              />
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
