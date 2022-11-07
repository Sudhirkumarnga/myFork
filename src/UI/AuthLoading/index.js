import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native'
import Toast from 'react-native-simple-toast'
import { getProfile } from '../../api/auth'
import Colors from '../../res/Theme/Colors'
import AppContext from '../../Utils/Context'
import messaging from '@react-native-firebase/messaging'

function AuthLoading ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {
    setUser,
    setAdminProfile,
    _getAllSchedules,
    _getEarnings,
    _getleaveRequest,
    _readDevice,
    _getNotification
    // _getJourneys,
    // _getMyAddresses
  } = context

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const user = await AsyncStorage.getItem('user')
      const res = await getProfile(token)
      let userData
      if (user) {
        userData = JSON.parse(user)
        setUser(userData)
      }
      _getNotification()
      console.warn('userData', res?.data?.response)
      if (res?.data?.response) {
        setAdminProfile(res?.data?.response)
      }

      if (userData?.role === 'Organization Admin') {
        _getleaveRequest()
      }

      if (
        userData?.role === 'Organization Admin' &&
        !res?.data?.response?.personal_information?.first_name
      ) {
        navigation.navigate('businessProfileCreation')
        return
      } else if (
        userData?.role !== 'Organization Admin' &&
        !res?.data?.response?.emergency_contact?.first_name
      ) {
        navigation.navigate('EmployeeProfileScene')
        return
      }
      if (userData?.role === 'Organization Admin') {
        navigation.navigate('home')
        return
      } else {
        navigation.navigate('homeEmployee')
        return
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  useEffect(() => {
    _bootstrapAsync()
    navigation.addListener('focus', () => {
      _bootstrapAsync()
    })
  }, [])
  useEffect(() => {
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage)
    })

    return unsubscribe
  }, [])

  async function registerAppWithFCM () {
    const getToken = await messaging().getToken()
    await messaging().registerDeviceForRemoteMessages()
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('user')
    const userData = JSON.parse(user)
    const payloadRead = {
      device_id: '', // Send if you can otherwise remove field
      registration_id: getToken,
      active: true,
      name: userData?.first_name,
      type: Platform.OS
    }
    if (token && user) {
      _readDevice(payloadRead)
    }
  }

  async function requestUserPermission () {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    registerAppWithFCM()
    if (enabled) {
    }
  }

  const _bootstrapAsync = async () => {
    const userUID = await AsyncStorage.getItem('token')
    if (userUID) {
      _getProfile()
      _getAllSchedules()
      _getEarnings()
    } else {
      navigation.navigate('chooseEnv')
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={Colors.WHITE} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.BACKGROUND_BG,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default AuthLoading
