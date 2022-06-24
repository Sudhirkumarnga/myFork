import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { BaseScene, Header, Button } from "../Common"
import { Colors, Fonts } from "../../res"

export default class AllWorksiteScene extends BaseScene {
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
        <Text style={styles.title}>{this.ls("listWorksites")}</Text>
        {[1, 2, 3].map(item => (
          <View style={styles.cellContainer}>
            <View>
              <Text style={styles.cellTitle}>Worksite no 1</Text>
              <Text style={styles.description}>Worksite location:</Text>
            </View>
            <TouchableOpacity style={{ justifyContent: "flex-end" }}>
              <Text
                style={[styles.cellTitle, { color: Colors.LIGHT_TEXT_COLOR }]}
              >
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={this.ls("worksites")} leftButton />
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
    color: "#818080",
    textAlign: "left",
    marginTop: 10,
    lineHeight: 24
  },
  cellContainer: {
    height: 70,
    borderBottomWidth: 0.8,
    margin: 10,
    borderColor: Colors.TEXT_INPUT_BORDER,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  cellTitle: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  }
})
