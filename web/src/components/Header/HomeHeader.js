import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import lockIcon from '../../assets/svg/lock.svg'
import {ReactComponent as LogoText} from '../../assets/svg/LogoText.svg'
import UserProfile from '../../assets/svg/userProfile.svg'
import 'rsuite/dist/rsuite.min.css'
import AppContext from '../../Context'
import AppButton from '../AppButton'
import { COLORS } from '../../constants'

export default function HomeHeader ({}) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  let userData = localStorage.getItem('userData')
  const { user, setUser } = useContext(AppContext)
  userData = JSON.parse(userData)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <header className='login_nav home_nav'>
        <div className={`ml-5`}>
          <div className='col-12'>
            <div className='row justify-content-between mt-2 mb-2'>
              <div className='d-flex align-items-center'>
                <Link to={'/'}>
                  <div className='d-flex align-items-center'>
                    <LogoText />
                  </div>
                </Link>
                {/* <li>
                  <Link to={'/about-us'}>
                    <div className='listpool ml-5'>About Us</div>
                  </Link>
                </li>
                <li>
                  <Link to={'/contact-us'}>
                  <div className='listpool ml-5'>Contact Us</div>
                  </Link>
                </li>
                <li>
                  <div className='listpool ml-5'>Resources</div>
                </li> */}
              </div>

              {/* <ul className='row align-items-center'>
                {user ? (
                  <>
                    <li>
                      <div className='listpool mr-4'>{user?.name}</div>
                    </li>
                    <li onClick={handleClick} className='listpool mr-4'>
                      <img src={UserProfile} className={'c-pointer'} />
                    </li>
                  </>
                ) : (
                  <>
                    <Link to={'/login'}>
                      <li>
                        <div className='listpool mr-4'>
                          <img src={lockIcon} style={{ marginBottom: 2 }} /> Log
                          in
                        </div>
                      </li>
                    </Link>
                    <Link to={'/signup'}>
                      <li>
                        <AppButton
                          title={'Sign up'}
                          backgroundColor={COLORS.primary}
                          color={COLORS.white}
                          height={40}
                          className='mr-4'
                        />
                      </li>
                    </Link>
                  </>
                )}
              </ul> */}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
