import React, { Component } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Colors, Fonts } from "../../res"
import { BaseComponent } from "../Common"

class Cell extends BaseComponent {
  renderRadioButton() {
    return (
      <View
        style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
      >
        <Image {...this.images("radio")} />
      </View>
    )
  }

  renderAmount() {
    return (
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.amount}>9.99</Text>
        <Text style={styles.yearText}>$/year</Text>
      </View>
    )
  }

  renderTitle() {
    return <Text style={styles.title}>{"Basic Offer"}</Text>
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        {this.renderTitle()}
        {this.renderAmount()}
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
    justifyContent: "space-around"
  },
  title: {
    ...Fonts.poppinsRegular(20),
    color: Colors.TEXT_COLOR
  },
  depedentContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    flex: 0.6
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

export default Cell
