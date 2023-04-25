import * as React from "react"
import { styled } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import MuiDrawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import Portfolio from "../../assets/svg/sidebar/Payroll.svg"
import Home from "../../assets/svg/sidebar/Home.svg"
import Offers from "../../assets/svg/sidebar/Message.svg"
import Profile from "../../assets/svg/sidebar/Schedular.svg"
import DashboardHeader from "../Header/DashboardHeader"
import MainFooter from "../Footer"
import { useSnackbar } from "notistack"
import { ReactComponent as LogoText } from "../../assets/svg/LogoText.svg"

const drawerWidth = 250

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: "#313131",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    })
  }
}))

function LayoutContent({ children, noFooter }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const UserType = localStorage.getItem("UserType")
  const { setUser, _getUpcomingShift, _getProfile, _getEarnings } =
    useContext(AppContext)
  const [open, setOpen] = React.useState(true)
  const [open1, setOpen1] = React.useState(false)
  const token = localStorage.getItem("token")

  React.useEffect(() => {
    if (!token) {
      navigate("/")
    } else {
      const user = localStorage.getItem("user")
      const userData = JSON.parse(user)
      setUser(userData)
      _getUpcomingShift()
      _getProfile()
      _getEarnings("")
    }
  }, [])

  const handleListItemClick = (route, index) => {
    navigate(route)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className="drawerClass"
        classes={{ paper: "drawerClass" }}
        open={open}
      >
        <div>
          {open && (
            <List component="nav" style={{ height: "100vh" }}>
              <LogoText
                style={{ marginLeft: 15, marginTop: 10, marginBottom: 50 }}
              />
              <ListItemButton
                selected={location.pathname.includes("/dashboard")}
                onClick={() => handleListItemClick("/dashboard", 1)}
                className={
                  location.pathname.includes("/dashboard")
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <img
                  src={Home}
                  className={
                    location.pathname.includes("/dashboard")
                      ? "iconDashboardActive"
                      : "iconDashboard"
                  }
                />
                <ListItemText primary="Home" />
              </ListItemButton>
              {UserType === "admin" ? (
                <>
                  <ListItemButton
                    selected={location.pathname === "/payroll"}
                    onClick={() => handleListItemClick("/payroll", 2)}
                    className={
                      location.pathname === "/payroll"
                        ? "listButtonActive"
                        : "listButton"
                    }
                  >
                    <img
                      src={Portfolio}
                      className={
                        location.pathname.includes("/payroll")
                          ? "iconDashboardActive"
                          : "iconDashboard"
                      }
                    />
                    <ListItemText primary="Payroll" />
                  </ListItemButton>
                  <ListItemButton
                    selected={location.pathname === "/scheduler"}
                    onClick={() => handleListItemClick("/scheduler", 2)}
                    className={
                      location.pathname === "/scheduler"
                        ? "listButtonActive"
                        : "listButton"
                    }
                  >
                    <img
                      src={Offers}
                      className={
                        location.pathname.includes("/scheduler")
                          ? "iconDashboardActive"
                          : "iconDashboard"
                      }
                    />
                    <ListItemText primary="Scheduler" />
                  </ListItemButton>
                </>
              ) : (
                <>
                  <ListItemButton
                    selected={location.pathname === "/scheduler"}
                    onClick={() => handleListItemClick("/scheduler", 2)}
                    className={
                      location.pathname === "/scheduler"
                        ? "listButtonActive"
                        : "listButton"
                    }
                  >
                    <img
                      src={Offers}
                      className={
                        location.pathname.includes("/scheduler")
                          ? "iconDashboardActive"
                          : "iconDashboard"
                      }
                    />
                    <ListItemText primary="Schedule" />
                  </ListItemButton>
                  <ListItemButton
                    selected={location.pathname === "/earnings"}
                    onClick={() => handleListItemClick("/earnings", 2)}
                    className={
                      location.pathname === "/earnings"
                        ? "listButtonActive"
                        : "listButton"
                    }
                  >
                    <img
                      src={Portfolio}
                      className={
                        location.pathname.includes("/earnings")
                          ? "iconDashboardActive"
                          : "iconDashboard"
                      }
                    />
                    <ListItemText primary="My Earnings" />
                  </ListItemButton>
                </>
              )}

              <ListItemButton
                selected={location.pathname.includes("/messages")}
                onClick={() => handleListItemClick("/messages", 3)}
                className={
                  location.pathname.includes("/messages")
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <img
                  src={Profile}
                  className={
                    location.pathname.includes("/messages")
                      ? "iconDashboardActive"
                      : "iconDashboard"
                  }
                />
                <ListItemText primary="Messages" />
              </ListItemButton>
            </List>
          )}
        </div>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === "light"
              ? theme.palette.white
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          // p: 5,
          overflow: "auto"
        }}
      >
        <DashboardHeader />
        <Box sx={{ p: 5 }}>{children}</Box>
        {!noFooter && <MainFooter />}
      </Box>
    </Box>
  )
}

export default function Layout({ children, noFooter }) {
  return <LayoutContent children={children} noFooter />
}
