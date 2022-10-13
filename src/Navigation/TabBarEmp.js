import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import {
  MessagesScene,
  RequestLeaveScene,
  HomeEmp,
  EmployeeListScene,
  AllWorksiteScene,
  Scheduler,
  MyEarningsScene,
  WorksiteMapScene,
} from '../UI'
import { Fonts, Colors } from '../res'
import Images from '../res/Images'
import { createStackNavigator } from "@react-navigation/stack"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function HomeStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name='HomeEmp' component={HomeEmp} />
      <Stack.Screen name='EmployeeListScene' component={EmployeeListScene} />
      <Stack.Screen name='AllWorksiteScene' component={AllWorksiteScene} />
      <Stack.Screen name='WorksiteMapScene' component={WorksiteMapScene} />
      <Stack.Screen name='RequestLeaveScene' component={RequestLeaveScene} />
    </Stack.Navigator>
  )
}

const defaultOptions = (focussed, color, icon) => {
  return (
    <Image
      {...Images[icon]}
      style={{
        height: 20,
        resizeMode: 'contain',
        width: 22,
        tintColor: color
      }}
    />
  )
}
export const TabBar = props => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.BUTTON_BG,
          height: 60,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        },
        labelStyle: styles.drawerText,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: Colors.GREY_COLOR
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, 'home')
        }}
      />
      <Tab.Screen
        name='Scheduler'
        component={Scheduler}
        options={{
          tabBarIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, 'scheduler')
        }}
      />
      <Tab.Screen
        name='My Earnings'
        component={MyEarningsScene}
        options={{
          tabBarIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, 'earnings')
        }}
      />
      
      <Tab.Screen
        name='Messages'
        component={MessagesScene}
        options={{
          tabBarIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, 'messages')
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerRow: {
    height: 50
  },
  drawerText: {
    ...Fonts.poppinsRegular(18),
    color: Colors.TEXT_COLOR,
    fontWeight: 'normal'
  }
})
