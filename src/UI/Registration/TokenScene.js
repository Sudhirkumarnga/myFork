import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput
} from "react-native"
import { BaseScene, Button, PrimaryTextInput, Forms } from "../Common"
import { Fonts, Colors } from "../../res"

const accountSid = "AGi8DgnxfLmfRpV52swENuuo1cVkEP4r5q"
const authToken = "830e190d3f256ce62d0d1469c566d146"

export default class TokenScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      seconds: 60,
      text: "",
      code: 0,
      disabled: true,
      confirmResult: null
    }
  }

  onEnterDigit(text, index) {
    const regex = /^[0-9]*$/
    if (regex.test(text)) {
      if (text && index != 3) {
        this.setState(
          { code: index != 0 ? this.state.code + text : text, text: text },
          () => {
            this[index + 1].focus()
          }
        )
      } else {
        this.setState({ disabled: false, code: this.state.code + text })
        //this.verifyCode(this.state.code + text);
      }
    } else {
      this[index].focus()
    }
  }

  renderTextInput() {
    return (
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {[0, 1, 2, 3].map((item, index) => {
          return (
            <TextInput
              style={styles.textInput}
              ref={ref => {
                this[item] = ref
              }}
              maxLength={1}
              onChangeText={text => this.onEnterDigit(text, index)}
              onKeyPress={({ nativeEvent }) => {
                nativeEvent.key === "Backspace" && this.onBackPressed(index)
              }}
              autoFocus={index == 0}
              keyboardType="numeric"
            />
          )
        })}
      </View>
    )
  }

  renderFooterButton() {
    return <Button title={this.ls("submit")} style={styles.footerButton} />
  }

  renderResendButton() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20
        }}
      >
        <Text style={styles.cancelText}>{this.ls("resendToken")}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <ImageBackground
        source={this.images("splashBg").source}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Image
            source={this.images("appLogo").source}
            style={{ height: 30, alignSelf: "center" }}
            resizeMode="contain"
          />
          <View style={styles.childContainer}>
            <Text style={styles.title}>{this.ls("tokenInput")}</Text>
            <Text style={styles.description}>{this.ls("enterCode")}</Text>
            <View style={{ height: "6%" }} />
            {this.renderTextInput()}
            {this.renderFooterButton()}
            {this.renderResendButton()}
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    ...Fonts.poppinsRegular(28),
    color: Colors.BLACK,
    textAlign: "center",
    marginTop: "20%"
  },
  childContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: "20%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BLUR_TEXT,
    marginVertical: 10
  },
  footerButton: {
    marginTop: "15%"
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
  textInput: {
    height: 80,
    width: 60,
    borderRadius: 10,
    color: Colors.TEXT_INPUT_COLOR,
    padding: 10,
    ...Fonts.poppinsRegular(24),
    borderWidth: 1,
    backgroundColor: Colors.TEXT_INPUT_BG,
    borderColor: Colors.TEXT_INPUT_BORDER,
    marginHorizontal: 8,
    paddingHorizontal: 20
  }
})
