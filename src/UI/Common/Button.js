import React from "react"
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Fonts, Colors } from "../../res"
import BaseComponent from "./BaseComponent"

class Button extends BaseComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        disabled={this.props.disabled}
        style={[
          styles.container,
          this.props.style,
          {
            opacity: this.props.disabled ? 0.7 : 1,
            backgroundColor: this.props.isWhiteBg
              ? Colors.WHITE
              : Colors.BUTTON_BG
          }
        ]}
      >
        <Image {...this.images(this.props.icon)} />
        <Text
          style={[
            this.props.textStyle,
            styles.text,
            {
              color: this.props.isWhiteBg ? Colors.BLACK : Colors.WHITE,
              marginLeft: this.props.icon ? 10 : 0
            }
          ]}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row"
  },
  text: {
    color: Colors.WHITE,
    ...Fonts.poppinsRegular(16)
  }
})
export default Button
