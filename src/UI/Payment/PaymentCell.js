import React, { Component } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Colors, Fonts } from "../../res"
import { BaseComponent } from "../Common"

class PaymentCell extends BaseComponent {
  renderRadioButton() {
    return (
      <View
        style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}
      >
        <Image {...this.images("radio")} />
      </View>
    )
  }

  renderAmount() {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <Text style={styles.yearText}>Expires 10/24</Text>
      </View>
    )
  }

  renderTitle() {
    return <Text style={styles.title}>{"**** **** **** 1234"}</Text>
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <Image {...this.images("visa")} />
        <View style={{ alignItems: "flex-start", flex: 0.5 }}>
          {this.renderTitle()}
          {this.renderAmount()}
        </View>
        {this.renderRadioButton()}
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    borderWidth: 1.5,
    borderColor: Colors.DARK_GREY,
    flexDirection: "row",
    padding: 5,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around"
  },
  title: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BLACK
  },
  depedentContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    flex: 0.5
  },
  amount: {
    ...Fonts.poppinsMedium(26),
    color: Colors.TEXT_COLOR
  },
  yearText: {
    ...Fonts.poppinsRegular(12),
    color: Colors.LIGHT_TEXT_COLOR
  }
})

export default PaymentCell
