import * as React from 'react'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router-dom'
import AppContext from '../../Context'
import { useContext } from 'react'
import Notification from '../../assets/svg/Notification.svg'
import Portfolio from '../../assets/svg/Portfolio.svg'
import Home from '../../assets/svg/Home.svg'
import Exit from '../../assets/svg/Exit.svg'
import Settings from '../../assets/svg/Settings.svg'
import Offers from '../../assets/svg/Offers.svg'
import Profile from '../../assets/svg/Profile.svg'
import DashboardHeader from '../Header/DashboardHeader'
import MainFooter from '../Footer'
import { useSnackbar } from 'notistack'

const drawerWidth = 250

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#313131',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

function LayoutContent ({ children }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const { setUser } = useContext(AppContext)
  const [open, setOpen] = React.useState(true)
  const [open1, setOpen1] = React.useState(false)

  const handleListItemClick = (route, index) => {
    navigate(route)
  }
  const handleListItemClickInbox = () => {
    setOpen1(!open1)
  }
  const onlogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    enqueueSnackbar(`Logout!`, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      }
    })
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant='permanent'
        className='drawerClass'
        classes={{ paper: 'drawerClass' }}
        open={open}
      >
        <div>
          {open && (
            <List component='nav' style={{ height: '100vh' }}>
              <div className='d-flex align-items-center'>
                <div className='logo1' />
                <div className='logoText1' />
              </div>
              <ListItemButton
                selected={
                  location.pathname === '/dashboard/spot-price' ||
                  location.pathname === '/dashboard/retail-value' ||
                  location.pathname === '/dashboard/makeoffers'
                }
                onClick={() => handleListItemClick('/dashboard/spot-price', 1)}
                className={
                  location.pathname === '/dashboard/spot-price' ||
                  location.pathname === '/dashboard/retail-value' ||
                  location.pathname === '/dashboard/makeoffers'
                    ? 'listButtonActive'
                    : 'listButton'
                }
              >
                <img src={Home} className='iconDashboard' />
                <ListItemText primary='Home' />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === '/dashboard/portfolio'}
                onClick={() => handleListItemClick('/dashboard/portfolio', 2)}
                className={
                  location.pathname === '/dashboard/portfolio'
                    ? 'listButtonActive'
                    : 'listButton'
                }
              >
                <img src={Portfolio} className='iconDashboard' />
                <ListItemText primary='My Portfolio' />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === '/dashboard/offers'}
                onClick={() => handleListItemClick('/dashboard/offers', 2)}
                className={
                  location.pathname === '/dashboard/offers'
                    ? 'listButtonActive'
                    : 'listButton'
                }
              >
                <img src={Offers} className='iconDashboard' />
                <ListItemText primary='My Offers' />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === '/dashboard/profile'}
                onClick={() => handleListItemClick('/dashboard/profile', 3)}
                className={
                  location.pathname === '/dashboard/profile'
                    ? 'listButtonActive'
                    : 'listButton'
                }
              >
                <img src={Profile} className='iconDashboard' />
                <ListItemText primary='Profile' />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === '/dashboard/notifications'}
                onClick={() =>
                  handleListItemClick('/dashboard/notifications', 4)
                }
                className={
                  location.pathname === '/dashboard/notifications'
                    ? 'listButtonActive'
                    : 'listButton'
                }
              >
                <img src={Notification} className='iconDashboard' />
                <ListItemText primary='Notification' />
              </ListItemButton>
              <div className='bottomFix'>
                <ListItemButton
                  selected={location.pathname === '/settings'}
                  onClick={() => handleListItemClick('/settings', 3)}
                  className={
                    location.pathname === '/settings'
                      ? 'listButtonActive'
                      : 'listButton'
                  }
                >
                  <img src={Settings} className='iconDashboard' />
                  <ListItemText primary='Settings' />
                </ListItemButton>
                <ListItemButton
                  // selected={location.pathname === '/dashboard/notifications'}
                  onClick={onlogout}
                  className={'listButton'}
                >
                  <img src={Exit} className='iconDashboard' />
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </div>
            </List>
          )}
        </div>
      </Drawer>
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.white
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          // p: 5,
          overflow: 'auto'
        }}
      >
        <DashboardHeader />
        <Box sx={{ p: 5 }}>{children}</Box>
        <MainFooter />
      </Box>
    </Box>
  )
}

export default function Layout ({ children }) {
  return <LayoutContent children={children} />
}
