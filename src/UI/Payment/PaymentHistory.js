import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native"
import { BaseScene, Button, PrimaryTextInput, Forms } from "../Common"
import { Fonts, Colors } from "../../res"
import PaymentHistoryCell from "./PaymentHistoryCell"

export default class PaymentHistory extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isFormValid: false
    }
  }

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
        <Text style={styles.description}>April 28, 2022</Text>
      </View>
    )
  }

  renderTitle() {
    return <Text style={styles.title}>{"**** **** **** 1234"}</Text>
  }

  renderCell(item) {
    return (
      <TouchableOpacity
        style={[styles.cellContainer, this.props.style]}
        onPress={this.props.onPress}
      >
        <Image {...this.images("visa")} />
        <View style={{ alignItems: "flex-start" }}>
          {this.renderTitle()}
          {this.renderAmount()}
        </View>
        {this.renderRadioButton()}
      </TouchableOpacity>
    )
  }

  renderPaymentCards() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={[1, 1, 1]}
        renderItem={item => <PaymentHistoryCell />}
      />
    )
  }

  render() {
    return <View style={styles.container}>{this.renderPaymentCards()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20
  },
  cellContainer: {
    margin: 5,
    height: 80,
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignItems: "center"
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
    marginTop: "5%"
  },
  footerWhiteButton: {
    marginTop: "5%",
    width: "100%",
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
