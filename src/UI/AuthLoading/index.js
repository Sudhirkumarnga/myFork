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
    _getEarnings
    // _getOrders,
    // _getJourneys,
    // _getMyAddresses
  } = context

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const user = await AsyncStorage.getItem('user')
      const res = await getProfile(token)
      const userData = JSON.parse(user)
      console.warn('userData', userData)
      if (userData) {
        setUser(userData)
      }
      if (res?.data?.response) {
        setAdminProfile(res?.data?.response)
      }
      if (!res?.data?.response?.personal_information?.first_name) {
        navigation.navigate('businessProfileCreation')
      } else if (userData?.role === 'Organization Admin') {
        navigation.navigate('home')
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
