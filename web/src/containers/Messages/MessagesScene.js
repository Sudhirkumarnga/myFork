import React, { useContext, useEffect, useState } from "react"
import MessageCell from "./MessageCell"
import AppContext from "../../Context"
import { Layout } from "../../components"
import { getDatabase, ref, onValue } from "firebase/database"
import { database } from "../../utils/firebase"
import { useNavigate } from "react-router-dom"
export default function MessagesScene({}) {
  const context = useContext(AppContext)
  const navigate = useNavigate()
  const { user } = context
  const db = database
  const [state, setState] = useState({
    loading: false,
    List: [],
    allList: [],
    unread: [],
    searchText: ""
  })

  const { loading, allList, unread, List, searchText } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    getMessages()
    return () => {
      handleChange("List", [])
      handleChange("allList", [])
    }
  }, [])

  const snapshotToArray = snapshot =>
    Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }))

  const getMessages = async () => {
    try {
      handleChange("loading", true)
      const starCountRef = ref(db, "Messages")
      onValue(starCountRef, snapshot => {
        if (snapshot.val()) {
          const messages = snapshotToArray(snapshot.val())
          handleChange("allList", messages)
          unreadList(messages)
          handleChange("loading", false)
          handleChange("List", messages)
        } else {
          handleChange("loading", false)
        }
      })
    } catch (error) {
      handleChange("loading", false)
    }
  }

  const sortByDate = data => {
    return data?.sort(function (a, b) {
      return (
        new Date(
          b?.messages && b?.messages?.length > 0
            ? b?.messages[b?.messages?.length - 1]?.timeStamp
            : b?.timeStamp
        ) -
        new Date(
          a?.messages && a?.messages?.length > 0
            ? a?.messages[a?.messages?.length - 1]?.timeStamp
            : a?.timeStamp
        )
      )
    })
  }

  const unreadList = messages => {
    const unread = messages?.filter(
      item =>
        (item?.receiverId === user?.id && item?.receiverRead > 0) ||
        (item?.senderId === user?.id && item?.senderRead > 0)
    )
    handleChange("unread", unread)
  }

  const sortByUser = data => {
    return data?.filter(
      item =>
        item?.senderId === user?.id ||
        item?.receiverId === user?.id ||
        item?.senderId === user?.employee_id ||
        item?.receiverId === user?.employee_id ||
        (item?.type === "group" &&
          item?.participentIds?.some(
            e => e === user?.id || e === user?.employee_id
          ))
    )
  }

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = allList?.filter(entry =>
        entry?.type === "group"
          ? entry?.name?.includes(value)
          : entry?.senderId !== user?.id
          ? `${
              entry?.sender?.personal_information?.first_name +
              entry?.sender?.personal_information?.last_name
            }`?.includes(value)
          : `${
              entry?.receiver?.personal_information?.first_name +
              entry?.receiver?.personal_information?.last_name
            }`?.includes(value)
      )
      handleChange("List", filtered)
    } else {
      handleChange("List", allList)
    }
  }

  const renderContent = () => {
    return (
      <div className="mt-4">
        {/* {loading && <ActivityIndicator size="small" color={Colors.BUTTON_BG} />} */}
        {List?.length > 0 &&
          sortByUser(sortByDate(List))?.map((item, index) => (
            <MessageCell key={index} item={item} user={user} />
          ))}
      </div>
    )
  }

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">Messages</div>
            </div>
            <div>
              <div
                className="text_primary font-bold500 c-pointer"
                onClick={() => navigate("/users")}
              >
                New message
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </Layout>
    </div>
  )
}
