import React from 'react'
import { Divider, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

export default function MainFooter () {
  let date = new Date().getFullYear()
  return (
    <div>
      {/* <!--Main footer--> */}
      <footer className='common_footer'>
        <div className='container'>
          <Grid container justifyContent={'space-between'}>
            <div className='mb-4 mt-4 font-bold text_primary text-center'>
              © 2021. All Rights Reserved.
            </div>
            <div className='mb-4 mt-4 d-flex font-bold text-center'>
              <div className='mr-5 c-pointer'>
                <Link className='text_primary' to={'/terms-conditions'}>Terms & Conditions</Link>
              </div>
              <div className='c-pointer'>
                <Link className='text_primary' to={'/privacy-policy'}>Privacy Policy</Link>
              </div>
            </div>
          </Grid>
        </div>
      </footer>
    </div>
  )
}
