import * as React from "react"
import { Image, StyleSheet } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import {
  SettingScene,
  SplashScene,
  RegistrationScene,
  ForgotPasswordScene,
  PrivacyPolicyScene,
  TermsPrivacyScene,
  TokenScene,
  ProfileScene,
  AllSubscriptionScene,
  AddEmployeeScene,
  AllWorksiteScene,
  WorksiteDetailScene,
  AddWorksiteScene,
  CreateTaskScene,
  RequestLeaveScene,
  HomeScene,
  EmployeeListScene
} from "../UI"
import { TabBar } from "./TabBar"

import CustomDrawer from "./CustomDrawer"
import { Images, Fonts, Colors } from "../res"

const Drawer = createDrawerNavigator()

export const drawerNavigator = props => {
  const defaultOptions = (focussed, color, icon) => {
    const imageName = `list`
    return (
      <Image
        {...Images[icon]}
        style={{ height: 20, width: 20, resizeMode: "contain" }}
      />
    )
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ swipeEnabled: true }}
      drawerContentOptions={{
        itemStyle: styles.drawerRow,
        activeTintColor: Colors.DRAWER_TINT_COLOR,
        activeBackgroundColor: "transparent",
        labelStyle: styles.drawerText,
      }}
    >
      <Drawer.Screen
        name={"My Profile"}
        component={TabBar}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "profile")
        }}
      />
      <Drawer.Screen
        name={"Employee list"}
        component={EmployeeListScene}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "list")
        }}
      />
      <Drawer.Screen
        name={"Worksites"}
        component={HomeScene}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "worksites")
        }}
      />
      <Drawer.Screen
        name={"Report"}
        component={HomeScene}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "report")
        }}
      />
      <Drawer.Screen
        name={"Timer off Requests"}
        component={RequestLeaveScene}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "timer")
        }}
      />
      <Drawer.Screen
        name={"Settings"}
        component={SettingScene}
        options={{
          drawerIcon: ({ focussed, color }) =>
            defaultOptions(focussed, color, "settings")
        }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerRow: {
    height: 50
  },
  drawerText: {
    ...Fonts.poppinsRegular(16),
    color: Colors.TEXT_COLOR,
    fontWeight: "normal"
  }
})
