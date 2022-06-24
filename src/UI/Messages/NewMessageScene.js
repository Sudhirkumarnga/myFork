import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native"
import { BaseScene, Header, PrimaryTextInput } from "../Common"
import { Fonts, Colors } from "../../res"

const screenWidth = Dimensions.get("window").width

export default class NewMessageScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log(this.state.selectedIndex)
    this.animatedLeftMargin = new Animated.Value(0)
  }

  renderSearchInput() {
    return (
      <PrimaryTextInput
        ref={o => (this["search"] = o)}
        label={this.ls("searchConversation")}
        onChangeText={() => {}}
        rightIcon={{ ...this.images("search") }}
      />
    )
  }

  renderContent() {
    return (
      <View style={styles.childContainerStyle}>{this.renderSearchInput()}</View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.ls("newMessage")}
          leftButton
          onLeftPress={() => this.props.navigation.goBack()}
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
    ...Fonts.poppinsRegular(18),
    color: "white",
    textAlign: "center",
    marginVertical: 10
  },
  sliderContainer: {
    flexDirection: "row",
    width: screenWidth,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.BUTTON_BG
  },
  touchable: {
    borderBottomColor: Colors.WHITE,
    borderBottomWidth: 2,
    paddingHorizontal: 30
  },
  childContainerStyle: {
    paddingVertical: 20
  },
  animatedViewStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: screenWidth * 2,
    flex: 1,
    marginTop: 2,
    marginLeft: 0
  }
})
