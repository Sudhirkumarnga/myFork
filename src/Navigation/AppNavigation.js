import * as React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import {
  LoginScene,
  SplashScene,
  ChooseEnvScene,
  RegistrationScene,
  ForgotPasswordScene,
  PrivacyPolicyScene,
  TermsPrivacyScene,
  TokenScene,
  ProfileScene,
  BusinessProfileScene,
  AllSubscriptionScene,
  AddEmployeeScene,
  AllWorksiteScene,
  WorksiteDetailScene,
  AddWorksiteScene,
  CreateTaskScene,
  ChangePassword,
  FeedbackScene,
  CardDetailScene,
  PaymentScene,
  NewMessageScene
} from "../UI"
import { drawerNavigator } from "./DrawerNavigation"
import { TabBar } from "./TabBar"
const Stack = createStackNavigator()

export const AuthNavigator = props => {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: false }}
      initialRouteName={"addEmployee"}
      headerMode="none"
    >
      <Stack.Screen name={"splash"} component={SplashScene} />
      <Stack.Screen name={"chooseEnv"} component={ChooseEnvScene} />

      <Stack.Screen name={"registration"} component={RegistrationScene} />
      <Stack.Screen name={"login"} component={LoginScene} />
      <Stack.Screen name={"tokenScene"} component={TokenScene} />
      <Stack.Screen name={"forgotPwd"} component={ForgotPasswordScene} />
      <Stack.Screen name={"privacyPolicy"} component={PrivacyPolicyScene} />
      <Stack.Screen name={"termsPrivacy"} component={TermsPrivacyScene} />
      <Stack.Screen name={"profileCreation"} component={ProfileScene} />
      <Stack.Screen
        name={"businessProfileCreation"}
        component={BusinessProfileScene}
      />
      <Stack.Screen name={"tab"} component={TabBar} />

      <Stack.Screen name={"home"} component={drawerNavigator} />
      <Stack.Screen name={"allSubscription"} component={AllSubscriptionScene} />
      <Stack.Screen name={"addEmployee"} component={AddEmployeeScene} />
      <Stack.Screen name={"allWorksite"} component={AllWorksiteScene} />
      <Stack.Screen name={"worksiteDetail"} component={WorksiteDetailScene} />
      <Stack.Screen name={"addWorksite"} component={AddWorksiteScene} />
      <Stack.Screen name={"createTask"} component={CreateTaskScene} />

      {/* Settings Screens */}
      <Stack.Screen name={"changePassword"} component={ChangePassword} />
      <Stack.Screen name={"feedbackScene"} component={FeedbackScene} />
      <Stack.Screen name={"paymentScene"} component={PaymentScene} />
      <Stack.Screen name={"cardDetail"} component={CardDetailScene} />
      <Stack.Screen name={"newMessage"} component={NewMessageScene} />
    </Stack.Navigator>
  )
}
