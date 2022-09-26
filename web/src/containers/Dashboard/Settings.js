// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { AppInput, AppButton, Layout, Label } from '../../components'
import { Button, Grid, TextField } from '@mui/material'
import { COLORS } from '../../constants'
import rightArrow from '../../assets/svg/rightArrow.svg'
import Trash_Full from '../../assets/svg/Trash_Full.svg'
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

export default function Settings ({}) {
  const navigate = useNavigate()
  const { user, _getProfile } = useContext(AppContext)
  const [state, setState] = useState({})

  const {} = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const settingList = [
    { title: 'Terms and Conditions', route: '/terms-conditions' },
    { title: 'Privacy Policy', route: '/privacy-policy' },
    { title: 'Support/Send Feedback', route: '/feedback' },
    { title: 'Change Password', route: '/change-password' }
  ]
  return (
    <div>
      <Layout>
        <div className='container minheight80vh'>
          <Grid container justifyContent={'center'}>
            <Grid item xs={10} sm={10} md={6} lg={5} className=''>
              {settingList.map((setting, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(setting.route)}
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
                    <div>{setting.title}</div>
                    <img src={rightArrow} />
                  </div>
                </Button>
              ))}
              <Button
                  // onClick={() => navigate(setting.route)}
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    backgroundColor: COLORS.white,
                    borderColor: COLORS.darkRed,
                    marginTop: 200,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    color: COLORS.darkRed,
                    textTransform: 'capitalize',
                    height: 50
                  }}
                >
                  <div
                    style={{ width: '90%' }}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div>{'Delete Account'}</div>
                    <img src={Trash_Full} />
                  </div>
                </Button>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
