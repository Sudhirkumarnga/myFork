import React, { useContext, useEffect, useState } from "react"
import userProfile from "../../assets/images/sample.png"
import groupIcon from "../../assets/svg/group.svg"
import { getAllEmployee } from "../../api/business"
import { Layout } from "../../components"
import { CircularProgress } from "@mui/material"
import { COLOR, COLORS, COLORSS } from "../../constants"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import AppContext from "../../Context"
import { useNavigate } from "react-router-dom"
import { onValue, ref, update } from "firebase/database"
import { database } from "../../utils/firebase"

export default function NewMessageScene({}) {
  const navigate = useNavigate()
  const { user, adminProfile } = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const [state, setState] = useState({
    loading: false,
    allEmployee: [],
    List: [],
    searchText: ""
  })
  const { loading, searchText, allEmployee, List } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    _getAllEmployee()
  }, [])

  const _getAllEmployee = async () => {
    try {
      handleChange("loading", true)
      const token = localStorage.getItem("token")
      const res = await getAllEmployee(token)
      handleChange("loading", false)
      handleChange("allEmployee", res?.data?.results)
      handleChange("List", res?.data?.results)
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

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = allEmployee?.filter(entry =>
        entry?.senderId !== user?.id
          ? `${
              entry?.personal_information?.first_name +
              entry?.personal_information?.last_name
            }`?.includes(value)
          : `${
              entry?.personal_information?.first_name +
              entry?.personal_information?.last_name
            }`?.includes(value)
      )
      handleChange("List", filtered)
    } else {
      handleChange("List", allEmployee)
    }
  }

  const sortByUser = data => {
    return data?.filter(item => item?.id !== user?.employee_id)
  }

  const createMessageList = item => {
    const id = `${user?.id}_${item?.id}`
    const rid = `${item?.id}_${user?.id}`
    const db = database

    onValue(
      ref(db, "Messages/" + id),
      snapshot => {
        if (snapshot.val()) {
          let value = {
            sender: { ...user, ...adminProfile },
            senderId: user?.id,
            id: id,
            timeStamp: Date.now(),
            receiverRead: 0,
            receiverId: item.id,
            receiver: item
          }
          const updateRef = ref(db, `Messages/${id}`)
          update(updateRef, value)
            .then(res => {
              navigate(`/messages/${id}`)
            })
            .catch(err => {
              alert("Something went wrong!")
            })
        } else {
          onValue(
            ref(db, "Messages/" + rid),
            snapshot => {
              if (snapshot.val()) {
                let value = {
                  sender: user,
                  senderId: user?.id,
                  id: rid,
                  timeStamp: Date.now(),
                  receiverRead: 0,
                  receiverId: item.id,
                  receiver: item
                }
                const updateRef = ref(db, `Messages/${rid}`)
                update(updateRef, value)
                  .then(res => {
                    navigate(`/messages/${rid}`)
                  })
                  .catch(err => {
                    alert("Something went wrong!")
                  })
              } else {
                let value = {
                  sender: user,
                  senderId: user?.id,
                  id: id,
                  timeStamp: Date.now(),
                  receiverRead: 0,
                  receiverId: item.id,
                  receiver: item
                }
                const updateRef = ref(db, `Messages/${id}`)
                update(updateRef, value)
                  .then(res => {
                    navigate(`/messages/${id}`)
                  })
                  .catch(err => {
                    alert("Something went wrong!")
                  })
              }
            },
            { onlyOnce: true }
          )
        }
      },
      { onlyOnce: true }
    )
  }

  const renderContent = () => {
    return (
      <div>
        <div className="headingrowBetween border-bottom pb-3">
          <div>
            <div className="heading">New Message</div>
          </div>
          <div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                borderBottomWidth: 1,
                borderBottomColor: COLORS.greyButton,
                paddingBottom: 10,
                cursor: "pointer"
              }}
              onClick={() => navigate("/users/group")}
            >
              <img src={groupIcon} />
              <div
                style={{
                  color: COLORS.primary,
                  marginLeft: 10
                }}
              >
                Group message
              </div>
            </div>
          </div>
        </div>
        {/* <div style={{ width: "90%", marginTop: 10 }}>
          
          </div>
        </div> */}
        <div className="heading mt-4 mb-4">Suggested</div>
        {loading && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <CircularProgress
              size={16}
              sx={{ widows: 15, height: 15, color: COLORS.primary }}
            />
          </div>
        )}
        {sortByUser(List).map((item, index) => (
          <div
            key={index}
            onClick={() => createMessageList(item)}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
              borderBottom: "1px solid #eee",
              paddingBottom: 10
            }}
          >
            <img
              src={
                item?.personal_information?.profile_image
                  ? item?.personal_information?.profile_image
                  : userProfile
              }
              style={{
                borderRadius: 5,
                width: 50,
                height: 50,
                marginRight: 20
              }}
            />
            <div>
              {item?.personal_information?.first_name +
                " " +
                item?.personal_information?.last_name}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <Layout>{renderContent()}</Layout>
}
