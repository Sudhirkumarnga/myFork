import moment from "moment-timezone"
import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Colors, Fonts } from "../../res"
import userProfile from "../../res/Images/common/sample.png"
import groupAvatar from "../../res/Images/common/groupAvatar.png"

function MessageCell({ navigation, item, user }) {
  const renderTime = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: 10,
          width: "25%",
          top: 8
        }}
      >
        <Text style={styles.yearText}>
          {Array.isArray(item?.messages) &&
            item?.messages?.length > 0 &&
            moment(
              item?.messages?.length > 0 &&
                item?.messages[item?.messages?.length - 1]?.timeStamp
            ).fromNow()}
        </Text>
      </View>
    )
  }

  const renderMessage = () => {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <Text style={styles.yearText}>
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
        </Text>
      </View>
    )
  }

  const renderTitle = () => {
    return (
      <Text style={styles.title}>
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
      </Text>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() =>
        navigation.navigate(
          item?.type === "group" ? "GroupMessageChat" : "MessageChat",
          { messageuid: item?.id }
        )
      }
    >
      <Image
        source={
          item?.type === "group"
            ? groupAvatar
            : item?.senderId === user?.id ||
              item?.senderId === user?.employee_id
            ? item?.receiver?.personal_information?.profile_image
              ? { uri: item?.receiver?.personal_information?.profile_image }
              : userProfile
            : item?.sender?.personal_information?.profile_image
            ? { uri: item?.sender?.personal_information?.profile_image }
            : userProfile
        }
        style={{
          width: 50,
          height: 50,
          borderRadius: 10,
          resizeMode: "cover"
        }}
      />
      <View style={{ alignItems: "flex-start", width: "75%", flex: 0.8 }}>
        {renderTitle()}
        {renderMessage()}
      </View>
      {renderTime()}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderBottomWidth: 1.5,
    borderColor: Colors.DARK_GREY,
    flexDirection: "row",
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around"
  },
  title: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BLACK
  },
  depedentContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    flex: 0.5
  },
  amount: {
    ...Fonts.poppinsMedium(26),
    color: Colors.TEXT_COLOR
  },
  yearText: {
    ...Fonts.poppinsRegular(10),
    color: Colors.LIGHT_TEXT_COLOR,
    marginTop: 5
  }
})

export default MessageCell
