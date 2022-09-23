import React, { Component } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Colors, Fonts } from "../../res"
import { BaseComponent } from "../Common"

class PaymentHistoryCell extends BaseComponent {
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
    return <View style={{ alignItems: "flex-start" }}></View>
  }

  renderAmount() {
    return (
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.amount}>9.99</Text>
        <Text style={styles.yearText}>View Details</Text>
      </View>
    )
  }

  renderTitle() {
    return <Text style={styles.title}>{"Basic Subscription"}</Text>
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <View style={styles.orangeView} />
        <View style={{ alignItems: "flex-start", flex: 0.6 }}>
          {this.renderTitle()}
          <Text style={styles.yearText}>April 28, 2022</Text>
        </View>
        <View>{this.renderAmount()}</View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderColor: Colors.PAYMENT_CELL_BORDER,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingVertical: 20
  },
  title: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  },
  depedentContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    flex: 0.5
  },
  amount: {
    ...Fonts.poppinsMedium(16),
    color: Colors.TEXT_COLOR
  },
  yearText: {
    ...Fonts.poppinsRegular(12),
    color: Colors.LIGHT_TEXT_COLOR,
    marginTop: 10
  },
  orangeView: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFD6B0"
  }
})

export default PaymentHistoryCell
