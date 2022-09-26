import React, { Component } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { BaseScene, Button, PrimaryTextInput, Forms, Header } from "../Common"
import { Fonts, Colors } from "../../res"

export default class ChangePassword extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      confirmPassword: "",
      isFormValid: false
    }
    this.setForms()
    this.isFormValid = this.isFormValid.bind(this)
  }

  setForms(field) {
    this.forms = Forms.fields("changePassword")
  }

  isFormValid() {
    let error = null
    this.forms.map(i => {
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
    let error = null
    let params = {}
    if (!this.password.isValid()) {
      error = "Please enter valid password"
    } else if (this.state.password != this.state.confirmPassword) {
      error = "Password does not match"
    }
    if (error) {
      alert(error)
    } else {
      params = {
        old_password: this.state.oldPassword,
        new_password: this.state.password
      }
      //   this.postForm(params)
    }
  }

  renderCancelButton() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20
        }}
        onPress={() => this.props.navigation.goBack()}
      >
        <Text style={styles.cancelText}>{this.ls("cancel")}</Text>
      </TouchableOpacity>
    )
  }

  renderTextInput() {
    return (
      <View>
        <PrimaryTextInput
          ref={o => (this.confirmPassword = o)}
          label="Current Password"
          correctPassword={this.state.passwordValidation}
          onChangeText={text => this.setState({ oldPassword: text })}
        />
        {this.forms.map(item => {
          return (
            <PrimaryTextInput
              {...item}
              onChangeText={text => this.isFormValid(text, "password")}
              ref={o => (this[item.key] = o)}
            />
          )
        })}
        <PrimaryTextInput
          onChangeText={text => this.isFormValid(text, "confirmPassword")}
          ref={o => (this.confirmPassword = o)}
          label="Confirm Password"
          correctPassword={this.state.passwordValidation}
        />
      </View>
    )
  }

  renderFooterButton() {
    return (
      <Button
        title={this.ls("changePassword")}
        style={styles.footerButton}
        onPress={this.props.onPress}
      />
    )
  }
  renderHeader() {
    return (
      <Header
        title={this.ls("changePassword")}
        leftButton
        leftIcon={this.images("leftArrow")}
        onLeftPress={() => this.props.navigation.goBack()}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={{ paddingTop: 30 }}>
          {this.renderTextInput()}
          {this.renderFooterButton()}
          {this.renderCancelButton()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  title: {
    ...Fonts.poppinsRegular(28),
    color: Colors.BLACK,
    textAlign: "center",
    marginTop: "20%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BLUR_TEXT,
    marginVertical: 10
  },
  footerButton: {
    marginTop: "15%",
    width: "90%"
  },
  forgotPwdText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    marginRight: 20
  },
  cancelText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG
  }
})
