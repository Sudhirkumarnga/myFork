import React, { Component } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { BaseScene, Button, PrimaryTextInput, Forms } from "../Common"
import { Fonts, Colors } from "../../res"
import PaymentCell from "./PaymentCell"

export default class PaymentMethod extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderPaymentCards() {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={[1, 1, 1]}
        renderItem={item => <PaymentCell />}
      />
    )
  }

  renderFooterButtons() {
    return (
      <View style={{}}>
        <Button
          style={[styles.footerWhiteButton]}
          title={this.ls("deletePayment")}
          icon={"delete"}
          isWhiteBg
          textStyle={{ color: Colors.BUTTON_BG }}
        />
        <Button style={styles.footerButton} title={this.ls("changePayment")} />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPaymentCards()}
        {this.renderFooterButtons()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20
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
