import React, { useContext, useEffect, useState } from "react"
import NotificationIcon from "../../assets/images/notificationIcon.png"
import moment from "moment"
import { readNotification } from "../../api/auth"
import AppContext from "../../Context"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { Checkbox, CircularProgress, Divider } from "@mui/material"
import { Layout } from "../../components"
import { COLORS } from "../../constants"

const Notifications = () => {
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const { notifications, _getNotification } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    readed: [],
    unreaded: []
  }) // Karachi

  const { loading, unreaded, readed } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    _getNotification()
  }, [])

  useEffect(() => {
    if (notifications?.length > 0) {
      const readed = notifications?.filter(e => e.is_read === true)
      const unreaded = notifications?.filter(e => e.is_read === false)
      handleChange("readed", readed)
      handleChange("unreaded", unreaded)
    } else {
      handleChange("readed", [])
      handleChange("unreaded", [])
    }
  }, [notifications])

  const _readNotification = async id => {
    try {
      handleChange("loading", true)
      await readNotification(id, token)
      handleChange("loading", false)
      _getNotification()
    } catch (error) {
      handleChange("loading", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const _renderItem = (item, index) => {
    return (
      <div key={index}>
        <div className="d-flex mb-3">
          <div>
            <img
              style={{ width: 50 }}
              src={item?.image ? item?.image : NotificationIcon}
            />
          </div>
          <div
            style={{
              width: "95%",
              marginLeft: 10,
              alignItems: "flex-start"
            }}
          >
            <div
              style={{
                width: "100%",
                flexDirection: "row",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  width: "80%",
                  fontSize: 13
                }}
              >
                {item?.description}
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="d-flex">
                  {!item?.is_read && <div className="dot" />}
                  <div>
                    <div className="font-12">
                      {moment.utc(item?.created_at).local().fromNow()}
                    </div>
                  </div>
                </div>
                {!item?.is_read && (
                  <div>
                    <Checkbox
                      onClick={() => _readNotification(item?.id)}
                      checked={false}
                      defaultChecked={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Layout noFooter>
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">{"Notifications"}</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          <div className="rowBetween mb-3">
            <div className="d-flex align-items-center">
              <div>New</div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 15,
                  marginTop: -5,
                  backgroundColor: "#F84F31",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div className="font-12 text-white">{unreaded?.length}</div>
              </div>
            </div>
            <div className="job">Mark as read</div>
          </div>
          {/* {loading && <CircularProgress />} */}
          {unreaded?.map((item, index) => _renderItem(item, index))}
          <div style={{ alignItems: "flex-start", width: "90%" }}>
            <div className="mb-3">Reviewed</div>
          </div>
          {readed?.map((item, index) => _renderItem(item, index))}
        </div>
      </Layout>
    </div>
  )
}

export default Notifications
