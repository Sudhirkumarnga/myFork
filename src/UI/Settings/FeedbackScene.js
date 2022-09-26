import React, { Component } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { BaseScene, Button, PrimaryTextInput, Forms, Header } from "../Common"
import { ImagePickerAndUploader } from "../../Utils"
import { Fonts, Colors } from "../../res"

export default class FeedbackScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      image: {},
      userImage: false,
      password: "",
      confirmPassword: "",
      isFormValid: false
    }
    this.setForms()
    this.isFormValid = this.isFormValid.bind(this)
  }

  setForms(field) {
    this.forms = Forms.fields("feedback")
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

  handleAWSUpload() {
    const config = {
      width: 300,
      height: 150,
      cropping: true
    }
    ImagePickerAndUploader.pickAndUpload(config)
      .then(response => {
        console.warn(response)
        this.setState({
          image: {
            uri: response.image.path,
            width: response.image.width,
            height: response.image.height,
            mime: response.image.mime
          },
          userImage: true
        })
      })
      .catch(error => {
        alert(error.message)
      })
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
    const props = {
      dropdown: true,
      items: [{ value: "Workite number 1", label: "Workite number 1" }]
    }
    return (
      <View>
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
          ref={o => (this.worksite = o)}
          label="Worksite"
          {...props}
          onChangeText={worksite => this.setState({ worksite })}
        />
        <PrimaryTextInput
          onChangeText={text => this.isFormValid(text, "confirmPassword")}
          ref={o => (this.message = o)}
          label="Message"
          inputStyle={{ height: 100 }}
          multiline
        />
      </View>
    )
  }

  renderUploadButton() {
    return (
      <Button
        style={[styles.footerWhiteButton]}
        isWhiteBg
        icon={"upload"}
        title={this.ls("uploadMedia")}
        onPress={() => this.handleAWSUpload()}
      />
    )
  }

  renderFooterButton() {
    return (
      <Button
        title={this.ls("submit")}
        style={styles.footerButton}
        onPress={this.props.onPress}
      />
    )
  }
  renderHeader() {
    return (
      <Header
        title={this.ls("worksiteFeedback")}
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
          {this.renderUploadButton()}
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
  },
  footerWhiteButton: {
    marginTop: "5%",
    width: "90%",
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
