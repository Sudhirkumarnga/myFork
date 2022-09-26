import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { BaseScene, Header, Button } from "../Common"
import Cell from "./Cell"
import SubscriptionModal from "./SubscriptionModal"
import { Colors, Fonts } from "../../res"

export default class AllSubscriptionScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: "false"
    }
  }

  renderButton() {
    return <Button style={styles.footerButton} title={this.ls("subscribe")} />
  }

  renderContent() {
    return (
      <View style={styles.childContainer}>
        <Text style={styles.title}>{this.ls("chooseSubscription")}</Text>
        {[1, 2, 3].map(item => (
          <Cell onPress={() => this.setState({ isVisible: true })} />
        ))}
        {this.renderButton()}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <SubscriptionModal
          isVisible={this.state.isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}
        />
        {this.renderContent()}
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
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR,
    marginVertical: 20
  },
  childContainer: {
    flex: 1,
    padding: 20
  },
  footerButton: {
    marginTop: "10%",
    width: "100%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  }
})
