import { Divider } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/svg/logo.svg'
import twitterIcon from '../../assets/svg/twitter.svg'
import linkedinIcon from '../../assets/svg/linkedin.svg'
import facebookIcon from '../../assets/svg/facebook.svg'
import instagramIcon from '../../assets/svg/instagram.svg'

export default function HomeFooter ({
  showCOntactUsMobile,
  displayMobileHide
}) {
  return (
    <div>
      {/* <!--Home footer--> */}
      <footer className='home_footer'>
        <div className='container phm-0 maxWidthMobile'>
          <div className='row mt-5 mb-5'>
            <div className={`col-md-3`}>
              <a href='#'>
                {' '}
                <img src={Logo} />
              </a>
            </div>
            <div className='col-md-3'>
              <div className='text_primary font-weight-bold font-24'>
                Company
              </div>
              <div className='text_primary mt-2'>About us</div>
              <Link to={'/contact-us'}>
                <div className='text_primary mt-2'>Contact us</div>
              </Link>
              <Link to={'/terms-conditions'}>
                <div className='text_primary mt-2'>Terms & conditions</div>
              </Link>
              <Link to={'/privacy-policy'}>
                <div className='text_primary mt-2'>Privacy policy</div>
              </Link>
            </div>
            <div className='col-md-3'>
              <div className='text_primary font-weight-bold font-24'>
                Support
              </div>
              <div className='text_primary mt-2'>How it works</div>
            </div>
            <div className='col-md-3'>
              <div className='text_primary font-weight-bold font-24'>
                Connect with us
              </div>
              <div className='mt-2'>
                <img src={twitterIcon} className={'socialIcon'} /> Twitter
              </div>
              <div className='mt-2'>
                <img src={linkedinIcon} className={'socialIcon'} /> Linkedin
              </div>
              <div className='mt-2'>
                <img src={facebookIcon} className={'socialIcon'} /> Facebook
              </div>
              <div className='mt-2'>
                <img src={instagramIcon} className={'socialIcon'} /> Instagram
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
