import React, { useContext, useEffect } from "react"
import { Provider } from "react-redux"
import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  configureStore,
  createReducer,
  combineReducers
} from "@reduxjs/toolkit"
import { AuthNavigator } from "./src/Navigation/AppNavigation"
import SplashScreen from "react-native-splash-screen"
import { modules, reducers, hooks, initialRoute } from "@modules"
import { connectors } from "@store"
import "./src/protos"

const Stack = createStackNavigator()

import { GlobalOptionsContext, OptionsContext, getOptions } from "@options"

const getNavigation = (modules, screens, initialRoute) => {
  const Navigation = () => {
    const routes = modules.concat(screens).map(mod => {
      const pakage = mod.package
      const name = mod.value.title
      const Navigator = mod.value.navigator
      const Component = () => {
        return (
          <OptionsContext.Provider value={getOptions(pakage)}>
            <Navigator />
          </OptionsContext.Provider>
        )
      }
      return <Stack.Screen key={name} name={name} component={Component} />
    })

    const screenOptions = { headerShown: true }

    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    )
  }
  return Navigation
}

const getStore = globalState => {
  const appReducer = createReducer(globalState, _ => {
    return globalState
  })

  const reducer = combineReducers({
    app: appReducer,
    ...reducers,
    ...connectors
  })

  return configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
  })
}

const App = () => {
  const global = useContext(GlobalOptionsContext)
  const store = getStore(global)

  let effects = {}
  hooks.map(hook => {
    effects[hook.name] = hook.value()
  })

  useEffect(() => {
    setTimeout(() => {
      console.log("hello")
      SplashScreen.hide()
    }, 2000)
  })

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  )
}

export default App
