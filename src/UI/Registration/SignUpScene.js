import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from "react-native"
import { BaseScene, Button, Forms, PrimaryTextInput } from "../Common"
import { Fonts, Colors, Images } from "../../res"
import { AsyncHelper } from "../../Utils"

export default class LoginScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isFormValid: false,
      env: "",
      forms: Forms.fields("signUp")
    }
    this.isFormValid = this.isFormValid.bind(this)
  }

  async componentDidMount() {
    const env = await AsyncHelper.getEnv()
    this.setState({
      env,
      forms:
        env == "employee" ? Forms.fields("signUpEmp") : Forms.fields("signUp")
    })
  }

  isFormValid() {
    let error = null
    this.state.forms.map(i => {
      if (!this[i.key].isValid()) {
        error = i.key
        return true
      }
      return false
    })
    if (error) {
      this.setState({ isFormValid: false })
      return false
    }
    this.setState({ isFormValid: true })
    return true
  }

  onSubmit() {
    if (this.isFormValid()) {
      let params = {}
      this.state.forEach(i => {
        if (this[i.key].isValid()) {
          params[i.key] = this[i.key].text()
        }
      })
      console.log(params)
    }
  }

  renderTextInput() {
    return this.state.forms.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
        />
      )
    })
  }

  renderFooterButton() {
    return <Button title={this.ls("signUp")} style={styles.footerButton} />
  }

  renderTermsView() {
    return (
      <View style={styles.termsContainer}>
        <TouchableOpacity
          onPress={() =>
            this.setState({ termsConditions: !this.state.termsConditions })
          }
        >
          <Image {...Images.checkbox} />
        </TouchableOpacity>
        <Text style={styles.textStyle}>
          {"I have read "}
          <Text style={styles.linkStyle} onPress={this.props.onTermsPress}>
            {"Terms & Conditions"}
          </Text>
          <Text style={styles.textStyle}>{" and "}</Text>
          <Text style={styles.linkStyle} onPress={this.props.onPrivacyPress}>
            {"Privacy Policy"}
          </Text>
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            height: Dimensions.get("window").height
          }}
        >
          <Text style={styles.title}>{this.ls("signUp")}</Text>
          <View style={{ height: "5%" }} />
          {this.renderTextInput()}
          {this.renderTermsView()}
          {this.renderFooterButton()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  title: {
    ...Fonts.poppinsRegular(28),
    color: Colors.BLACK,
    textAlign: "center",
    marginTop: "20%"
  },
  footerButton: {
    marginTop: "8%"
  },
  forgotPwdText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    marginRight: 20
  },
  termsContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 20,
    padding: 20
  },
  textStyle: {
    ...Fonts.poppinsRegular(12),
    marginLeft: 8,
    color: Colors.BLACK
  },
  linkStyle: {
    ...Fonts.poppinsRegular(12),
    color: Colors.BUTTON_BG
  }
})
