import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { AuthNavigator } from './src/Navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'
import './src/protos'
import AppContext from './src/Utils/Context'
import { MenuProvider } from 'react-native-popup-menu'
import { getAllSchedules, getEarnings } from './src/api/business'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { getCities, getCountries, getStates } from './src/api/auth'

const App = () => {
  const [user, setUser] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [earnings, setEarnings] = useState([])
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  })

  const _getCountries = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const countries = await getCountries(token)
      const cities = await getCities(token)
      const states = await getStates(token)
      setCountries(countries?.data?.results)
      setCities(cities?.data?.results)
      setStates(states?.data?.results)
    } catch (error) {
      const showWError = Object.values(error.response?.data?.error)
      Toast.show(`Error: ${showWError[0]}`)
    }
  }

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

  const _getEarnings = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getEarnings(token)
      setEarnings(res?.data)
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
        _getAllSchedules,
        _getCountries,
        countries,
        cities,
        states,
        earnings,
        _getEarnings
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
