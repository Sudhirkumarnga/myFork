import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity
} from "react-native"
import { BaseScene, Header } from "../Common"
import { Fonts, Colors } from "../../res"
import PaymentHistory from "./PaymentHistory"
import PaymentMethod from "./PaymentMethod"
const screenWidth = Dimensions.get("window").width

export default class PaymentScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      slideValues: ["paymentHistory", "paymentMethod"],
      selectedIndex: 0
    }
    this.onSegmentedChange = this.onSegmentedChange.bind(this)
  }

  componentDidMount() {
    console.log(this.state.selectedIndex)
    this.animatedLeftMargin = new Animated.Value(0)
  }

  onSegmentedChange(index) {
    this.setState({ selectedIndex: index })
    this.slidePane(index == 0 ? "left" : "right", index)
  }

  slidePane(direction, index) {
    let theLeftMargin
    if (direction === "right") {
      theLeftMargin = parseInt("-" + screenWidth) * index
      Animated.timing(this.animatedLeftMargin, {
        toValue: theLeftMargin,
        duration: 500
      }).start()
    } else {
      Animated.timing(this.animatedLeftMargin, {
        toValue: 0,
        duration: 500
      }).start()
    }
  }

  renderSlider() {
    const styleContainer = {
      borderBottomColor: "#A8A8A8",
      borderBottomWidth: 5,
      paddingHorizontal: 30,
      marginHorizontal: 20
    }
    return (
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={
            this.state.selectedIndex == 0
              ? styleContainer
              : { paddingHorizontal: 30 }
          }
          onPress={() => this.onSegmentedChange(0)}
        >
          <Text
            style={[
              styles.title,
              { opacity: this.state.selectedIndex != 0 ? 0.5 : 1 }
            ]}
          >
            {this.ls("paymentHistory")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            this.state.selectedIndex == 1
              ? styleContainer
              : { paddingHorizontal: 30 }
          }
          onPress={() => this.onSegmentedChange(1)}
        >
          <Text
            style={[
              styles.title,
              { opacity: this.state.selectedIndex != 1 ? 0.5 : 1 }
            ]}
          >
            {this.ls("paymentMethod")}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderContent() {
    return (
      <Animated.View
        style={[
          styles.animatedViewStyle,
          { marginLeft: this.animatedLeftMargin }
        ]}
      >
        <View style={styles.childContainerStyle}>
          <PaymentHistory
            onPress={() => this.props.navigation.navigate("allSubscription")}
            onForgotPwd={() => this.props.navigation.navigate("forgotPwd")}
          />
        </View>
        <View style={styles.childContainerStyle}>
          <PaymentMethod
            onSuccessful={() => {
              this.props.navigation.navigate("Home")
              this.setState({ selectedIndex: 2 })
            }}
            onPrivacyPress={() =>
              this.props.navigation.navigate("privacyPolicy")
            }
            onTermsPress={() => this.props.navigation.navigate("termsPrivacy")}
          />
        </View>
      </Animated.View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={this.ls("paymentsTitle")}
          leftButton
          onLeftPress={() => this.props.navigation.goBack()}
        />
        {this.renderSlider()}
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    width: screenWidth,
    height: "100%"
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
