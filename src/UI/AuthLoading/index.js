import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import Toast from 'react-native-simple-toast'
import { getProfile } from '../../api/auth'
import Colors from '../../res/Theme/Colors'
import AppContext from '../../Utils/Context'

function AuthLoading ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {
    setUser,
    setAdminProfile,
    _getAllSchedules,
    _getEarnings,
    _getleaveRequest
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
      console.warn('userData', user)
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
