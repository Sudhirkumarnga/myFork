import React, { useContext, useEffect, useState } from "react"
import { update, ref, onValue } from "firebase/database"

// import { COLORS, FONT1REGULAR, FONT2REGULAR } from '../../constants'
import userProfile from "../../assets/images/sample.png"
import moment from "moment"
import sendIcon from "../../assets/svg/sendIcon.svg"
import smileIcon from "../../assets/svg/smileIcon.svg"
import insertIcon from "../../assets/svg/galleryIcon.svg"
import AppContext from "../../Context"
import { useRef } from "react"
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"
import { useSnackbar } from "notistack"
import { COLORS } from "../../constants"
import { useParams } from "react-router-dom"
import { database } from "../../utils/firebase"
import { Layout } from "../../components"
import { CircularProgress } from "@mui/material"
import EmojiPicker from "emoji-picker-react"
function MessageChat({ navigation }) {
  const { id: messageuid } = useParams()
  const db = database
  const divRef = useRef(null)
  const inputRef = useRef()
  const fileRef = useRef()
  const { enqueueSnackbar } = useSnackbar()
  // Context
  const context = useContext(AppContext)
  const { user } = context
  const [file, setFile] = useState()

  let scrollView
  const [state, setState] = useState({
    listHeight: 0,
    scrollViewHeight: 0,
    uploading: false,
    messages: [],
    messageText: "",
    messageData: null
  })

  const { messageData, show } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const onClickEmoji = emoji => {
    setState(prevState => ({
      ...prevState,
      messageText: prevState.messageText + emoji?.emoji
    }))
  }

  const handleUploadClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = e => {
    if (!e.target.files) {
      return
    }
    _uploadImage(e.target.files[0])
  }

  useEffect(() => {
    if (user && messageuid) {
      const starCountRef = ref(db, `Messages/${messageuid}`)
      onValue(starCountRef, snapshot => {
        if (snapshot.val()) {
          if (
            snapshot.val()?.senderId === user?.id ||
            snapshot.val()?.senderId === user?.employee_id
          ) {
            const updateRef = ref(db, `Messages/${messageuid}`)
            update(updateRef, { senderRead: 0 }).then(res => {
              const getRef = ref(db, `Messages/${messageuid}`)
              onValue(getRef, snapshot => {
                if (snapshot.val()) {
                  // getMessages()
                  console.log(
                    "snapshot.val().messages",
                    snapshot.val()?.messages
                  )
                  setState(prevState => ({
                    ...prevState,
                    messages: snapshot.val().messages || [],
                    messageData: snapshot.val()
                  }))
                  divRef.current?.scrollIntoView({
                    behavior: "smooth"
                  })
                }
              })
            })
          }
          if (
            snapshot.val()?.receiverId === user?.id ||
            snapshot.val()?.receiverId === user?.employee_id
          ) {
            const updateRef = ref(db, `Messages/${messageuid}`)
            update(updateRef, { receiverRead: 0 }).then(res => {
              const getRef = ref(db, `Messages/${messageuid}`)
              onValue(getRef, snapshot => {
                if (snapshot.val()) {
                  // getMessages()
                  setState(prevState => ({
                    ...prevState,
                    messages: snapshot.val()?.messages || [],
                    messageData: snapshot.val()
                  }))
                  divRef.current?.scrollIntoView({
                    behavior: "smooth"
                  })
                }
              })
            })
          }
        }
      })
    }
  }, [user])

  const _uploadImage = async file => {
    console.log("file", file)
    handleChange("uploading", true)
    const storage = getStorage()
    const innerstorageRef = storageRef(storage, "Chat/" + file?.name)

    const uploadTask = uploadBytesResumable(innerstorageRef, file)

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log("Upload is " + progress + "% done")
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused")
            break
          case "running":
            console.log("Upload is running")
            break
        }
      },
      error => {
        // Handle unsuccessful uploads
        handleChange("uploading", false)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          console.log("File available at", downloadURL)
          onSend(downloadURL, "image")
          handleChange("uploading", false)
        })
      }
    )
    // handleChange("uploading", false)
  }

  function onlySpaces(str) {
    return /^\s*$/.test(str)
  }

  const onSend = (text, type) => {
    if (onlySpaces(text || state.messageText)) {
      enqueueSnackbar(`Please enter any character`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      return
    }
    const data = {
      text: text || state.messageText,
      timeStamp: Date.now(),
      type: type || "text",
      senderId: user?.id
    }
    let messages = state.messages.concat(data)
    const values = {
      messages,
      senderRead:
        state?.messageData?.senderRead > 0
          ? Number(state.messageData.senderRead) + 1
          : 1,
      receiverRead:
        state?.messageData?.receiverRead > 0
          ? Number(state.messageData.receiverRead) + 1
          : 1
    }

    console.log("messages", values)

    update(ref(db, `Messages/${messageuid}`), values)
      .then(res => {
        setState(prevState => ({
          ...prevState,
          loading: false,
          messageText: ""
        }))
        divRef.current?.scrollIntoView({
          behavior: "smooth"
        })
      })
      .catch(err => {
        console.log(err)
        enqueueSnackbar(`Something went wrong!`, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      })
  }

  const _handleKeyDown = e => {
    if (e.key === "Enter" && state.messageText) {
      onSend()
    }
  }

  return (
    <Layout noFooter>
      <div
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center"
          // backgroundColor: COLORS.backgroud
        }}
      >
        <div
          style={{
            height: 60,
            backgroundColor: COLORS.white,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              paddingBottom: 20,
              display: "flex",
              flexDirection: "row",
              marginTop: -30,
              marginBottom: 20,
              borderBottom: "1px solid #eee",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <img
              style={{
                width: 40,
                borderRadius: 10,
                height: 40,
                marginRight: 10,
                marginLeft: 20
              }}
              // resizeMode="cover"
              src={
                messageData?.senderId === user?.id ||
                messageData?.senderId === user?.employee_id
                  ? messageData?.receiver?.personal_information
                      ?.profile_image || messageData?.receiver?.profile_image
                    ? messageData?.receiver?.personal_information
                        ?.profile_image || messageData?.receiver?.profile_image
                    : userProfile
                  : messageData?.sender?.personal_information?.profile_image ||
                    messageData?.sender?.profile_image
                  ? messageData?.sender?.personal_information?.profile_image ||
                    messageData?.sender?.profile_image
                  : userProfile
              }
            />
            <div style={{ color: COLORS.darkBlack, width: "80%" }}>
              {messageData
                ? messageData?.senderId === user?.id ||
                  messageData?.senderId === user?.employee_id
                  ? (messageData?.receiver?.personal_information?.first_name ||
                      messageData?.receiver?.first_name) +
                    " " +
                    (messageData?.receiver?.personal_information?.last_name ||
                      messageData?.receiver?.last_name)
                  : messageData?.sender?.name ||
                    messageData?.sender?.first_name +
                      " " +
                      messageData?.sender?.last_name
                : ""}
            </div>
          </div>
        </div>
        <div>
          <div
            // keyboardShouldPersistTaps={"handled"}
            // contentContainerStyle={{
            //   justifyContent: "flex-end",
            //   borderTopWidth: 1,
            //   // borderTopColor: COLORS.borderColor1,
            //   alignItems: "center",
            //   flex: 1
            // }}
            style={{
              width: "100%"
              // backgroundColor: COLORS.white,
            }}
          >
            <div className="messageBoxHeight">
              {state.messages?.map((item, index) => {
                if (item?.senderId !== user?.id) {
                  return (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        marginVertical: 10
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "flex-end",
                          paddingBottom: 10
                        }}
                      >
                        <img
                          style={{
                            width: 40,
                            borderRadius: 10,
                            height: 40,
                            marginRight: 10
                          }}
                          // resizeMode="cover"
                          src={
                            messageData?.senderId === user?.id
                              ? messageData?.receiver?.personal_information
                                  ?.profile_image
                                ? messageData?.receiver?.personal_information
                                    ?.profile_image
                                : userProfile
                              : messageData?.sender?.personal_information
                                  ?.profile_image
                              ? messageData?.sender?.personal_information
                                  ?.profile_image
                              : userProfile
                          }
                        />
                        <div
                          style={{
                            backgroundColor: "rgba(22, 167, 155, 0.1)",
                            maxWidth: "80%",
                            borderRadius: 10,
                            padding: 15
                          }}
                        >
                          {item?.type === "image" ? (
                            <img
                              src={item?.text}
                              style={{
                                width: 200,
                                height: 200,
                                resizeMode: "contain"
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                color: COLORS.darkBlack
                              }}
                            >
                              {item?.text}
                            </div>
                          )}
                          <div
                            style={{
                              width: "100%",
                              alignItems: "flex-end",
                              marginTop: 10
                            }}
                          >
                            <div
                              style={{
                                marginTop: 5
                              }}
                            >
                              {moment(item?.timeStamp).fromNow()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        marginVertical: 10,
                        paddingRight: 10,
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "flex-end"
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "flex-end",
                          // maxWidth: "85%",
                          alignItems: "flex-end",
                          paddingBottom: 10
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#16A79B",
                            maxWidth: "85%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            borderRadius: 10,
                            borderBottomRightRadius: 0,
                            padding: 10
                          }}
                        >
                          {item?.type === "image" ? (
                            <img
                              src={item?.text}
                              style={{
                                width: 200,
                                height: 200,
                                resizeMode: "contain"
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                color: COLORS.white,
                                // lineHeight: 20,
                                height: "auto",
                                width: "100%"
                                // ...Fonts.poppinsRegular(12)
                              }}
                            >
                              {item?.text}
                            </div>
                          )}
                          <div
                            style={{
                              color: COLORS.white,
                              fontSize: 12,
                              marginTop: 5
                            }}
                          >
                            {moment(item?.timeStamp).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
              <div id={"el"} ref={divRef}></div>
            </div>
            {state?.uploading && (
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
                  size={15}
                  sx={{ widows: 15, height: 15, color: COLORS.primary }}
                />
              </div>
            )}
            {show && (
              <div className="EmojiPicker">
                <EmojiPicker onEmojiClick={onClickEmoji} showPreview={false} />
              </div>
            )}
            <div
              style={{
                width: "100%",
                flexDirection: "row",
                display: "flex",
                borderTop: "1px solid #eee",
                marginTop: 10,
                paddingTop: 20,
                alignItems: "center",
                justifyContent: "space-between",
                height: 70,
                backgroundColor: COLORS.white
              }}
            >
              <img
                src={insertIcon}
                className="c-pointer"
                onClick={handleUploadClick}
              />
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img
                src={smileIcon}
                className="c-pointer"
                onClick={() => {
                  inputRef.current?.blur()
                  handleChange("show", !show)
                }}
              />
              <div
                style={{
                  width: "85%",
                  display: "flex",
                  borderRadius: 5,
                  backgroundColor: "#F7F7F7",
                  padding: "0 15px",
                  height: 55,
                  justifyContent: "space-between",
                  border: "1px solid #CECECE"
                }}
              >
                <input
                  ref={inputRef}
                  // placeholderTextColor="#58595B"
                  onFocus={() => handleChange("show", false)}
                  onChange={message => {
                    setState(prevState => ({
                      ...prevState,
                      messageText: message.target.value
                    }))
                  }}
                  onKeyDown={_handleKeyDown}
                  value={state.messageText}
                  placeholder={"Write a message"}
                  style={{
                    border: "none",
                    backgroundColor: "#F7F7F7",
                    color: "#000",
                    height: 50,
                    width: "100%"
                  }}
                />
              </div>
              <img
                src={sendIcon}
                className="c-pointer"
                onClick={() => {
                  state.messageText ? onSend() : console.log("")
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MessageChat
