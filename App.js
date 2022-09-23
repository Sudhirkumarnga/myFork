import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { AuthNavigator } from './src/Navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'
import './src/protos'
import AppContext from './src/Utils/Context'
import { MenuProvider } from 'react-native-popup-menu'
import { getAllSchedules } from './src/api/business'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'

const App = () => {
  const [user, setUser] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const [schedules, setSchedules] = useState([])
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  })

  const _getAllSchedules = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ''
      const res = await getAllSchedules(qs, token)
      console.warn('getAllWorksites', res?.data)
      setSchedules(res?.data?.response)
    } catch (error) {
      const showWError = Object.values(error.response?.data?.error)
      if (showWError.length > 0) {
        Toast.show(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        Toast.show(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        adminProfile,
        setAdminProfile,
        schedules,
        _getAllSchedules
      }}
    >
      <MenuProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </MenuProvider>
    </AppContext.Provider>
  )
}

export default App
