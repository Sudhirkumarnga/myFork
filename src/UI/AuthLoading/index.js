import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useEffect, useState } from "react"
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Alert,
  Text
} from "react-native"
import Toast from "react-native-simple-toast"
import { getProfile } from "../../api/auth"
import Colors from "../../res/Theme/Colors"
import AppContext from "../../Utils/Context"
import messaging from "@react-native-firebase/messaging"
import AsyncHelper from "../../Utils/AsyncHelper"
import { Fonts } from "../../res"
import Button from "../Common/Button"

function AuthLoading({ navigation }) {
  const [popUp, setPopUp] = useState(false)
  const [localUser, setLocalUser] = useState(null)
  // Context
  const context = useContext(AppContext)
  const {
    setUser,
    setAdminProfile,
    _getAllSchedules,
    _getEarnings,
    _getleaveRequest,
    _readDevice,
    _getNotification,
    _getCountries
    // _getMyAddresses
  } = context

  const _getProfile = async () => {
    try {
      const env = await AsyncHelper.getEnv()
      const token = await AsyncStorage.getItem("token")
      const user = await AsyncStorage.getItem("user")
      let userData
      if (user) {
        userData = JSON.parse(user)
        setUser(userData)
        setLocalUser(userData)
      }
      console.warn("userData", userData)
      const res = await getProfile(token)
      _getNotification()
      console.warn("res?.data?.response", res?.data?.response)
      if (res?.data?.response) {
        setAdminProfile(res?.data?.response)
      }

      if (userData?.role === "Organization Admin") {
        _getleaveRequest()
      }

      if (
        userData?.role === "Organization Admin" &&
        !res?.data?.response?.personal_information?.first_name
      ) {
        navigation.navigate("businessProfileCreation")
        return
      } else if (
        env === "employee" &&
        userData?.role !== "Organization Admin" &&
        !res?.data?.response?.business_information &&
        !res?.data?.response?.emergency_contact?.first_name
      ) {
        navigation.navigate("EmployeeProfileScene")
        return
      }
      if (
        (env === "admin" && userData?.role === "Organization Admin") ||
        (res?.data?.response?.business_information &&
          res?.data?.response?.emergency_contact?.first_name)
      ) {
        navigation.navigate("home")
        return
      } else if (env === "employee") {
        navigation.navigate("homeEmployee")
        return
      } else {
        setPopUp(true)
        return
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      if (errorText[0] === "Business Subscription currently is not active.") {
        setPopUp(true)
      } else {
        Toast.show(`Error: ${errorText[0]}`)
      }
    }
  }

  useEffect(async () => {
    const env = await AsyncHelper.getEnv()
    console.warn("env", env)
    setLocalUser(env)
    _bootstrapAsync()
    navigation.addListener("focus", () => {
      _bootstrapAsync()
    })
  }, [])
  useEffect(() => {
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage))
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Message handled in the background!", remoteMessage)
    })

    return unsubscribe
  }, [])

  async function registerAppWithFCM() {
    await messaging().deleteToken()
    const getToken = await messaging().getToken()
    await messaging().registerDeviceForRemoteMessages()
    const token = await AsyncStorage.getItem("token")
    const user = await AsyncStorage.getItem("user")
    const userData = JSON.parse(user)
    const payloadRead = {
      device_id: getToken, // Send if you can otherwise remove field
      registration_id: getToken,
      active: true,
      name: userData?.first_name,
      type: Platform.OS
    }
    if (token && user) {
      _readDevice(payloadRead)
    }
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    registerAppWithFCM()
    if (enabled) {
    }
  }

  const _bootstrapAsync = async () => {
    const userUID = await AsyncStorage.getItem("token")
    if (userUID) {
      _getCountries()
      _getProfile()
      _getAllSchedules()
      _getEarnings()
    } else {
      navigation.navigate("chooseEnv")
    }
  }
  console.log("localUser", localUser)

  const logout = async () => {
    setUser(null)
    setPopUp(false)
    setLocalUser(null)
    setAdminProfile(null)
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    navigation.navigate("chooseEnv")
  }

  return (
    <View style={styles.container}>
      {popUp ? (
        <View style={{ width: "90%" }}>
          <Text
            style={{
              ...Fonts.poppinsRegular(16),
              color: Colors.WHITE,
              width: "100%"
            }}
          >
            {localUser === "admin"
              ? "There was an issue processing your monthly subscription, please visit https://Cleanr.pro/subscription to review your plan and to continue using CleanR"
              : " It looks like there is an issue with the subscription to CleanR - please contact your administrator - our apologies for the inconvenience"}
          </Text>
          <Button title={"Logout"} onPress={logout} />
        </View>
      ) : (
        <ActivityIndicator size="large" color={Colors.WHITE} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.BACKGROUND_BG,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default AuthLoading
