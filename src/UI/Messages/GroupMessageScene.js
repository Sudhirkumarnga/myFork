import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native"
import { Header, PrimaryTextInput } from "../Common"
import { Fonts, Images } from "../../res"
import Colors from "../../res/Theme/Colors"
import userProfile from "../../res/Images/common/sample.png"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import groupIcon from "../../res/Svgs/group.svg"
import database from "@react-native-firebase/database"
import { SvgXml } from "react-native-svg"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getAllEmployee } from "../../api/business"
import Toast from "react-native-simple-toast"
import AppContext from "../../Utils/Context"
import { Icon } from "react-native-elements"

const screenWidth = Dimensions.get("window").width

export default function GroupMessageScene({ navigation }) {
  const { user, adminProfile } = useContext(AppContext)
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

  useFocusEffect(
    useCallback(() => {
      _getAllEmployee()
    }, [])
  )
  // console.warn('allEmployee',allEmployee);
  const _getAllEmployee = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const res = await getAllEmployee(token)
      handleChange("loading", false)
      handleChange("allEmployee", res?.data?.results)
      handleChange("List", res?.data?.results)
    } catch (error) {
      handleChange("loading", false)
      console.warn("err", error?.response?.data)
      const showWError = Object.values(error.response?.data?.error)
      if (showWError.length > 0) {
        Toast.show(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        Toast.show(`Error: ${JSON.stringify(error)}`)
      }
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
          ? entry?.personal_information?.first_name?.includes(value)
          : entry?.personal_information?.first_name?.includes(value)
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
    const db = database()
    const uid = db.ref("Messages").push().key
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
    db.ref("Messages/" + uid)
      .update(value)
      .then(res => {
        navigation.navigate("GroupMessageChat", { messageuid: uid })
        handleChange("loadingCreate", false)
      })
      .catch(err => {
        handleChange("loadingCreate", false)
        Toast.show("Something went wrong!")
      })
  }

  const renderSearchInput = () => {
    return (
      <>
        <PrimaryTextInput
          label={"Search for people"}
          value={searchText}
          onChangeText={value => filtered("searchText", value)}
          rightIcon={{ ...Images.search }}
        />
        <PrimaryTextInput
          label={"Group name"}
          onChangeText={value => handleChange("groupName", value)}
          value={groupName}
        />
      </>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.childContainerStyle}>
        {renderSearchInput()}
        <FlatList
          data={participents}
          horizontal
          style={{ width: "100%", paddingLeft: "5%" }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{ marginTop: 10, alignItems: "center", marginRight: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  const removed = participents?.filter(e => e?.id !== item?.id)
                  handleChange("participents", removed)
                }}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: -30,
                  marginBottom: -10,
                  zIndex: 33,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#C1C1C1"
                }}
              >
                <Icon name="close" type="antdesign" size={14} />
              </TouchableOpacity>
              <Image
                source={
                  item?.personal_information?.profile_image
                    ? { uri: item?.personal_information?.profile_image }
                    : userProfile
                }
                style={{
                  borderRadius: 5,
                  width: 40,
                  height: 40
                }}
              />
              <Text
                style={{
                  ...Fonts.poppinsRegular(12),
                  textAlign: "center",
                  width: 60,
                  marginTop: 5
                }}
              >
                {item?.personal_information?.first_name +
                  " " +
                  item?.personal_information?.last_name}
              </Text>
            </View>
          )}
        />
        {participents?.length > 0 && (
          <View
            style={{
              width: "90%",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              flexDirection: "row"
            }}
          >
            {loadingCreate && (
              <ActivityIndicator
                size={"small"}
                color={Colors.BACKGROUND_BG}
                style={{ marginRight: 10 }}
              />
            )}
            <TouchableOpacity
              disabled={!groupName || loadingCreate}
              onPress={createMessageList}
            >
              <Text
                style={{
                  color: !groupName ? Colors.BLUR_TEXT : Colors.BACKGROUND_BG,
                  ...Fonts.poppinsRegular(14)
                }}
              >
                Create group
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ width: "90%", marginTop: 10 }}></View>
        <Text
          style={{ ...Fonts.poppinsRegular(18), width: "90%", marginTop: 10 }}
        >
          Suggested
        </Text>
        {loading && <ActivityIndicator size="small" color={Colors.BUTTON_BG} />}
        <FlatList
          data={sortByUser(List)}
          style={{ width: "90%", marginTop: 20 }}
          renderItem={({ item, index }) => (
            <View
              key={index}
              // onPress={() => createMessageList(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderBottomColor: Colors.TEXT_INPUT_BG
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={
                    item?.personal_information?.profile_image
                      ? { uri: item?.personal_information?.profile_image }
                      : userProfile
                  }
                  style={{
                    borderRadius: 5,
                    width: 50,
                    height: 50,
                    marginRight: 20
                  }}
                />
                <Text style={{ ...Fonts.poppinsRegular(12) }}>
                  {item?.personal_information?.first_name +
                    " " +
                    item?.personal_information?.last_name}
                </Text>
              </View>
              <BouncyCheckbox
                size={25}
                fillColor={Colors.BACKGROUND_BG}
                unfillColor={Colors.WHITE}
                disableBuiltInState
                innerIconStyle={{
                  borderColor: Colors.BLUR_TEXT,
                  borderRadius: 5,
                  marginBottom: 2
                }}
                iconStyle={{
                  borderColor: Colors.BLUR_TEXT,
                  borderRadius: 5,
                  marginBottom: 2
                }}
                isChecked={participents?.some(e => e?.id === item?.id)}
                onPress={() => {
                  if (participents?.some(e => e?.id === item?.id)) {
                    const removed = participents?.filter(
                      e => e?.id !== item?.id
                    )
                    handleChange("participents", removed)
                  } else {
                    handleChange("participents", [...participents, item])
                  }
                }}
              />
            </View>
          )}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={"Group message"}
        leftButton
        onLeftPress={() => navigation.goBack()}
      />
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  title: {
    ...Fonts.poppinsRegular(18),
    color: "white",
    textAlign: "center",
    marginVertical: 10
  },
  sliderContainer: {
    flexDirection: "row",
    width: screenWidth,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.BUTTON_BG
  },
  touchable: {
    borderBottomColor: Colors.WHITE,
    borderBottomWidth: 2,
    paddingHorizontal: 30
  },
  childContainerStyle: {
    paddingVertical: 20,
    alignItems: "center"
  },
  animatedViewStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: screenWidth * 2,
    flex: 1,
    marginTop: 2,
    marginLeft: 0
  }
})
