import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { AuthNavigator } from './src/Navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'
import './src/protos'
import AppContext from './src/Utils/Context'
import { MenuProvider } from 'react-native-popup-menu'

const App = () => {
  const [user, setUser] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  })

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        adminProfile,
        setAdminProfile
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
