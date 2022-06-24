import React from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native"
import { BaseScene, Header } from "../Common"
import { Fonts, Colors } from "../../res"

export default class SettingScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          icon: "lock",
          screen: "changePassword",
          title: "Change Password"
        },
        {
          icon: "lock",
          screen: "paymentScene",
          title: "Payments"
        },
        {
          icon: "terms",
          screen: "termsPrivacy",
          title: "Terms & Conditions"
        },
        {
          icon: "privacy",
          screen: "privacyPolicy",
          title: "Privacy Policy"
        },
        {
          icon: "chat",
          screen: "feedbackScene",
          title: "Support/Send Feedback"
        },
        {
          icon: "logout",
          screen: "SettingScene",
          title: "Logout"
        },
        {
          icon: "delete",
          screen: "SettingScene",
          title: "Delete account"
        }
      ]
    }
  }

  renderContent() {
    return (
      <FlatList
        data={this.state.data}
        style={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              marginVertical: 5
            }}
            onPress={() => this.props.navigation.navigate(item.screen)}
          >
            <Image
              {...this.images(item.icon)}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.ls("settings")}
          leftButton
          onLeftPress={() => this.props.navigation.goBack()}
        />
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  text: {
    ...Fonts.poppinsRegular(18),
    color: Colors.TEXT_COLOR,
    marginHorizontal: 20
  },
  childContainer: {
    flex: 1,
    padding: 20
  },
  footerButton: {
    marginTop: "15%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  }
})
