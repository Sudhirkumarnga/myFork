import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { AuthNavigator } from './src/Navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'
import './src/protos'
import AppContext from './src/Utils/Context'

const App = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  })

  return (
    <AppContext.Provider
      value={{
        user,
        setUser
      }}
    >
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App
