import moment from "moment"
import React from "react"
import userProfile from "../../assets/images/sample.png"
import groupAvatar from "../../assets/images/groupAvatar.png"
import { useNavigate } from "react-router-dom"

export default function MessageCell({ item, user }) {
  const navigate = useNavigate()
  const renderTime = () => {
    return (
      <div
        style={{
          // justifyContent: "center",
          // alignItems: "center",
          // display: "flex",
          // position: "absolute",
          // right: 10,
          width: "20%",
          textAlign: "right"
          // top: 8
        }}
      >
        <div className="font-12">
          {Array.isArray(item?.messages) &&
            item?.messages?.length > 0 &&
            moment(
              item?.messages?.length > 0 &&
                item?.messages[item?.messages?.length - 1]?.timeStamp
            ).fromNow()}
        </div>
      </div>
    )
  }

  const renderMessage = () => {
    return (
      <div style={{ alignItems: "flex-start" }}>
        <div className="font-14 text-grey">
          {item?.messages &&
          Array.isArray(item?.messages) &&
          item?.messages &&
          item?.messages?.length > 0 &&
          item?.messages[item?.messages?.length - 1]?.type === "image"
            ? "Image"
            : item?.messages?.length > 0 &&
              item?.messages[item?.messages?.length - 1]?.text?.length > 40
            ? item?.messages[item?.messages?.length - 1]?.text?.slice(0, 40) +
              " ...."
            : Array.isArray(item?.messages) &&
              item?.messages?.length > 0 &&
              item?.messages[item?.messages?.length - 1]?.text}
        </div>
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="text-black font-16">
        {item?.type === "group"
          ? item?.name
          : item?.senderId === user?.id || item?.senderId === user?.employee_id
          ? (item?.receiver?.personal_information?.first_name ||
              item?.receiver?.first_name) +
            " " +
            (item?.receiver?.personal_information?.last_name ||
              item?.receiver?.last_name)
          : (item?.sender?.personal_information?.first_name ||
              item?.sender?.first_name) +
            " " +
            (item?.sender?.personal_information?.last_name ||
              item?.sender?.last_name)}
      </div>
    )
  }

  return (
    <div
      className="messagelist"
      onClick={() =>
        navigate(
          item?.type === "group"
            ? `/messages/group/${item?.id}`
            : `/messages/${item?.id}`
        )
      }
    >
      <img
        src={
          item?.type === "group"
            ? groupAvatar
            : item?.senderId === user?.id ||
              item?.senderId === user?.employee_id
            ? item?.receiver?.personal_information?.profile_image
              ? item?.receiver?.personal_information?.profile_image
              : userProfile
            : item?.sender?.personal_information?.profile_image
            ? item?.sender?.personal_information?.profile_image
            : userProfile
        }
        style={{
          width: 50,
          height: 50,
          borderRadius: 10,
          marginRight: 15,
          resizeMode: "cover"
        }}
      />
      <div style={{ alignItems: "flex-start", width: "80%" }}>
        {renderTitle()}
        {renderMessage()}
      </div>
      {renderTime()}
    </div>
  )
}
