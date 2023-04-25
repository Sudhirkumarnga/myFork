import React, { useContext, useState } from "react"
// import LogoutModal from "./LogoutModal"
// import DeleteModal from "./DeleteModal"
import { deleteAccount } from "../../api/auth"
import deleteIcon from "../../assets/svg/settings/delete.svg"
import feedbackIcon from "../../assets/svg/settings/feedback.svg"
import lockIcon from "../../assets/svg/settings/lock.svg"
import logoutIcon from "../../assets/svg/settings/logout.svg"
import paymentsIcon from "../../assets/svg/settings/payments.svg"
import privacyIcon from "../../assets/svg/settings/privacy.svg"
import termsIcon from "../../assets/svg/settings/terms.svg"
import AppContext from "../../Context"
import { useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack"
import { AppButton, Layout } from "../../components"
import { Dialog, Divider } from "@mui/material"
import { COLORS } from "../../constants"

export default function Settings({}) {
  const { setAdminProfile, setUser } = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const UserType = localStorage.getItem("UserType")
  const navigate = useNavigate()
  const [state, setState] = useState({
    visible: false,
    visible1: false,
    loadingDelete: false,
    data: [
      {
        icon: lockIcon,
        route: "/change-password",
        title: "Change Password"
      },
      {
        icon: paymentsIcon,
        route: "/subscription",
        title: "Payments"
      },
      {
        icon: termsIcon,
        link: "https://cleanr.pro/terms-and-conditions",
        title: "Terms & Conditions"
      },
      {
        icon: privacyIcon,
        link: "https://cleanr.pro/privacy-policy",
        title: "Privacy Policy"
      },
      {
        icon: feedbackIcon,
        route: "/feedback",
        title: "Support/Send Feedback"
      },
      {
        icon: logoutIcon,
        title: "Logout"
      },
      {
        icon: deleteIcon,
        title: "Delete account"
      }
    ],
    data1: [
      {
        icon: lockIcon,
        route: "/change-password",
        title: "Change Password"
      },
      {
        icon: termsIcon,
        link: "https://cleanr.pro/terms-and-conditions",
        title: "Terms & Conditions"
      },
      {
        icon: privacyIcon,
        link: "https://cleanr.pro/privacy-policy",
        title: "Privacy Policy"
      },
      {
        icon: feedbackIcon,
        route: "/feedback",
        title: "Support/Send Feedback"
      },
      {
        icon: logoutIcon,
        title: "Logout"
      },
      {
        icon: deleteIcon,
        title: "Delete account"
      }
    ]
  })

  const { visible, visible1, loadingDelete } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const logout = () => {
    // setUser(null)
    // setAdminProfile(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("UserType")
    navigate("/")
  }

  const _deleteAccount = async () => {
    try {
      handleChange("loadingDelete", true)
      await deleteAccount(token)
      logout()
      handleChange("loadingDelete", false)
      enqueueSnackbar(`Account has been deleted`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    } catch (error) {
      handleChange("loadingDelete", false)
      enqueueSnackbar(`Error: ${error.message}`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const openLink = async link => {
    window.open(link, "_blank")
  }

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">Settings</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          {(UserType === "admin" ? state.data : state.data1)?.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  flexDirection: "row",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  marginVertical: 5
                }}
                onClick={() =>
                  item.link
                    ? openLink(item?.link)
                    : item.title === "Logout"
                    ? handleChange("visible", true)
                    : item.title === "Delete account"
                    ? handleChange("visible1", true)
                    : navigate(item.route)
                }
              >
                <img
                  src={item.icon}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 20,
                    resizeMode: "contain"
                  }}
                />
                <div>{item.title}</div>
              </div>
            )
          )}
          {/* <LogoutModal
        visible={this.state.visible}
        onCancel={() => this.setState({ visible: false })}
        logout={this.logout}
        />
        <DeleteModal
        visible={state.visible1}
        loading={state.loadingDelete}
        onCancel={() => setState({ visible1: false })}
        logout={_deleteAccount}
      /> */}
        </div>
      </Layout>
      <Dialog onClose={() => handleChange("visible", false)} open={visible}>
        <div className={"zipModal"}>
          <div className="logoutText">Are you sure you want to logout?</div>
          <AppButton
            backgroundColor={COLORS.primary}
            onClick={logout}
            color={COLORS.white}
            title={"Yes"}
          />
          <AppButton
            backgroundColor={COLORS.white}
            className={"mt-2"}
            onClick={() => handleChange("visible", false)}
            borderColor={COLORS.white}
            color={COLORS.primary}
            title={"Cancel"}
          />
        </div>
      </Dialog>
      <Dialog onClose={() => handleChange("visible1", false)} open={visible1}>
        <div className={"zipModal"}>
          <div className="logoutText">
            Are you sure you want to delete account?
          </div>
          <AppButton
            onClick={_deleteAccount}
            loading={loadingDelete}
            backgroundColor={COLORS.primary}
            color={COLORS.white}
            title={"Yes"}
          />
          <AppButton
            backgroundColor={COLORS.white}
            className={"mt-2"}
            onClick={() => handleChange("visible1", false)}
            borderColor={COLORS.white}
            color={COLORS.primary}
            title={"Cancel"}
          />
        </div>
      </Dialog>
    </div>
  )
}
