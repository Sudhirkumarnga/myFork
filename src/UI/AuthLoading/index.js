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
    setAdminProfile
    // _getProfile,
    // _getOrders,
    // _getJourneys,
    // _getMyAddresses
  } = context

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getProfile(token)
      console.warn('res?.data?.response',res?.data?.response);
      if (res?.data?.response) {
        setAdminProfile(res?.data?.response)
      }
      if (!res?.data?.response?.personal_information?.first_name) {
        navigation.navigate('businessProfileCreation')
      } else {
        navigation.navigate('home')
      }
    } catch (error) {
      console.warn('error', error)
      this.handleChange('loading', false, true)
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
    // const user = await AsyncStorage.getItem('user')
    if (userUID) {
      _getProfile()
      // const userData = JSON.parse(user)
      // setUser(userData)
      // _getProfile()
      // navigation.navigate('home')
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
