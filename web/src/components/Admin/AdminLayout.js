import React, { useEffect } from "react"
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
import AdminHeader from "../Header/AdminHeader"
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

function AdminLayoutContent({ children }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const { setUser, _getAdminData } = useContext(AppContext)
  const [open, setOpen] = React.useState(true)

  useEffect(() => {
    _getAdminData()
  }, [])

  const handleListItemClick = (route, index) => {
    navigate(route)
  }

  const onlogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    enqueueSnackbar(`Logout!`, {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      }
    })
    navigate("/login")
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
                selected={location.pathname.includes("/admin-users")}
                onClick={() => handleListItemClick("/admin-users", 1)}
                className={
                  location.pathname.includes("/admin-users")
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <ListItemText primary="Users" />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === "/admin-subscriptions"}
                onClick={() => handleListItemClick("/admin-subscriptions", 2)}
                className={
                  location.pathname === "/admin-subscriptions"
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <ListItemText primary="Subscriptions" />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === "/admin-feedback"}
                onClick={() => handleListItemClick("/admin-feedback", 2)}
                className={
                  location.pathname === "/admin-feedback"
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <ListItemText primary="Feedback" />
              </ListItemButton>
              <ListItemButton
                selected={location.pathname === "/admin-analytics"}
                onClick={() => window.open("https://console.firebase.google.com/u/0/project/cleanr-1e54f/overview")}
                className={
                  location.pathname === "/admin-analytics"
                    ? "listButtonActive"
                    : "listButton"
                }
              >
                <ListItemText primary="Analytics" />
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
        <AdminHeader />
        <Box sx={{ p: 5 }}>{children}</Box>
        {/* <MainFooter /> */}
      </Box>
    </Box>
  )
}

export default function AdminLayout({ children }) {
  return <AdminLayoutContent children={children} />
}
