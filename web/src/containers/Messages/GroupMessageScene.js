import React, { useContext, useEffect, useState } from "react"
import userProfile from "../../assets/images/sample.png"
// import groupIcon from "../../res/Svgs/group.svg"
import { getAllEmployee } from "../../api/business"
import { AppInput, Layout } from "../../components"
import { Checkbox, CircularProgress } from "@mui/material"
import { COLORS } from "../../constants"
import { CloseOutlined } from "@mui/icons-material"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { database } from "../../utils/firebase"
import { push, ref, update } from "firebase/database"
import { useNavigate } from "react-router-dom"
import AppContext from "../../Context"

export default function GroupMessageScene() {
  const { user, adminProfile } = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [state, setState] = useState({
    loading: false,
    loadingCreate: false,
    allEmployee: [],
    participents: [],
    List: [],
    searchText: "",
    groupName: ""
  })
  const {
    loading,
    searchText,
    allEmployee,
    List,
    participents,
    groupName,
    loadingCreate
  } = state

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

  const sortByUser = data => {
    return data?.filter(item => item?.id !== user?.employee_id)
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

  const getParticipentsIDs = () => {
    const lists = []
    for (let i = 0; i < participents.length; i++) {
      const element = participents[i]
      lists.push(element?.id)
    }
    return lists
  }

  const createMessageList = () => {
    handleChange("loadingCreate", true)
    const db = database
    const uid = push(ref(db, "Messages")).key
    let value = {
      sender: user,
      senderId: user?.id,
      id: uid,
      name: groupName,
      type: "group",
      timeStamp: Date.now(),
      receiverRead: 0,
      participentIds: [user?.id, ...getParticipentsIDs()],
      participents: [{ ...user, ...adminProfile }, ...participents]
    }
    const updateRef = ref(db, `Messages/${uid}`)
    update(updateRef, value)
      .then(res => {
        navigate(`/messages/group/${uid}`)
        handleChange("loadingCreate", false)
      })
      .catch(err => {
        handleChange("loadingCreate", false)
        alert("Something went wrong!")
      })
  }

  const renderSearchInput = () => {
    return (
      <div>
        {/* <AppInput
          placeholder={"Search for people"}
          value={searchText}
          name={"searchText"}
          onChange={(key, value) => filtered("searchText", value)}
        /> */}
        <AppInput
          placeholder={"Group name"}
          onChange={(key, value) => handleChange("groupName", value)}
          value={groupName}
          name={"groupName"}
        />
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div>
        <div className="d-flex">
          {participents?.length > 0 && (
            <div className="d-flex width80">
              {participents?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: 30
                  }}
                >
                  <div
                    onClick={() => {
                      const removed = participents?.filter(
                        e => e?.id !== item?.id
                      )
                      handleChange("participents", removed)
                    }}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 30,
                      marginBottom: -10,
                      zIndex: 9999,
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#C1C1C1"
                    }}
                  >
                    <CloseOutlined sx={{ zIndex: 9999 }} />
                  </div>
                  <img
                    src={
                      item?.personal_information?.profile_image
                        ? item?.personal_information?.profile_image
                        : userProfile
                    }
                    style={{
                      borderRadius: 5,
                      width: 40,
                      zIndex: -2,
                      height: 40
                    }}
                  />
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 5
                    }}
                  >
                    {item?.personal_information?.first_name +
                      " " +
                      item?.personal_information?.last_name}
                  </div>
                </div>
              ))}
            </div>
          )}
          {renderSearchInput()}
        </div>
        {participents?.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              flexDirection: "row"
            }}
          >
            {loadingCreate && (
              <CircularProgress
                size={16}
                sx={{ widows: 15, height: 15, color: COLORS.primary }}
              />
            )}
            <div
              style={{
                textAlign: "right",
                cursor: "pointer",
                color: groupName ? COLORS.primary : COLORS.greyButton
              }}
              onClick={(groupName || !loadingCreate) && createMessageList}
            >
              Create group
            </div>
          </div>
        )}
        <div className="heading">Suggested</div>
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
            // onPress={() => createMessageList(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              borderBottom: "1px solid #eee",
              paddingBottom: 10
            }}
          >
            <div style={{ flexDirection: "row", alignItems: "center" }}>
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
            <Checkbox
              checked={participents?.some(e => e?.id === item?.id)}
              onClick={() => {
                if (participents?.some(e => e?.id === item?.id)) {
                  const removed = participents?.filter(e => e?.id !== item?.id)
                  handleChange("participents", removed)
                } else {
                  handleChange("participents", [...participents, item])
                }
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Layout noFooter>
      <div className="headingrowBetween border-bottom pb-3">
        <div>
          <div className="heading">Group Message</div>
        </div>
      </div>
      {renderContent()}
    </Layout>
  )
}
