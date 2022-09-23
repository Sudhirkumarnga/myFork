import React from "react"
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  Image
} from "react-native"
import { Colors, Images } from "../res"
import CCInput from "react-native-credit-card-input/src/CCInput"

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black"
  },
  rightInputView: {
    position: "absolute",
    right: 25,
    top: 32
  }
})

CCInput.prototype.renderRightInputView = function () {
  return (
    <TouchableOpacity style={s.rightInputView}>
      <Image
        {...Images.payment}
        style={{
          height: 16,
          width: 22,
          resizeMode: "contain",
          tintColor: Colors.HOME_DES
        }}
      />
    </TouchableOpacity>
  )
}

CCInput.prototype.render = function () {
  const {
    label,
    value,
    placeholder,
    status,
    keyboardType,
    containerStyle,
    inputStyle,
    labelStyle,
    validColor,
    invalidColor,
    placeholderColor,
    additionalInputProps,
    rightImage
  } = this.props
  return (
    <TouchableOpacity onPress={this.focus} activeOpacity={0.99}>
      <View style={[containerStyle]}>
        {!!label && <Text style={[labelStyle]}>{label}</Text>}

        <TextInput
          ref="input"
          {...additionalInputProps}
          keyboardType={keyboardType}
          autoCapitalise="words"
          autoCorrect={false}
          style={[
            s.baseInputStyle,
            inputStyle,
            validColor && status === "valid"
              ? { color: validColor }
              : invalidColor && status === "invalid"
              ? { color: invalidColor }
              : {}
          ]}
          underlineColorAndroid={"transparent"}
          placeholderTextColor={placeholderColor}
          placeholder={placeholder}
          value={value}
          onFocus={this._onFocus}
          onChangeText={this._onChange}
        />
        {rightImage && this.renderRightInputView()}
      </View>
    </TouchableOpacity>
  )
}
