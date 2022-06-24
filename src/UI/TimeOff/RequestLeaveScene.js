import React from "react"
import { View, FlatList, StyleSheet } from "react-native"
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Button,
  DateSelectionView
} from "../Common"
import { Fonts, Colors } from "../../res"
import EmpRequestLeave from "./EmpRequestLeave"
import DenyModal from "./DenyModal"

export default class RequestLeaveScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      env: ""
    }
  }

  renderTitleInput() {
    return (
      <PrimaryTextInput
        ref={o => (this["title"] = o)}
        label={this.ls("title")}
        onChangeText={() => {}}
      />
    )
  }

  renderDescription() {
    return (
      <PrimaryTextInput
        ref={o => (this["description"] = o)}
        label={this.ls("description")}
        onChangeText={() => {}}
        inputStyle={{ height: 80 }}
        multiline
      />
    )
  }

  renderDatesInput() {
    return <DateSelectionView />
  }

  renderTypeInput() {
    return (
      <PrimaryTextInput
        ref={o => (this["leaveType"] = o)}
        label={this.ls("leaveType")}
        onChangeText={() => {}}
        dropdown
        items={[
          { label: "Paid", value: "Paid" },
          { label: "Unpaid", value: "Unpaid" },
          { label: "Sick", value: "Sick" }
        ]}
      />
    )
  }

  renderButton() {
    return (
      <Button
        title={this.ls("sendReq")}
        style={styles.footerButton}
        onPress={this.props.onPress}
      />
    )
  }

  renderContent() {
    if (this.state.env == "employee") {
      return (
        <View style={styles.childContainer}>
          {this.renderTitleInput()}
          {this.renderTypeInput()}
          {this.renderDatesInput()}
          {this.renderDescription()}
          {this.renderButton()}
        </View>
      )
    } else {
      return (
        <EmpRequestLeave
          onDenyPress={() => {
            console.log("hello")
            this.setState({ denyModalVisible: true })
          }}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={{ ...this.images("bar") }}
          leftButton
          title={this.ls("timeOffReq")}
          onLeftPress={() =>
            this.props.navigation.toggleDrawer({
              side: "left",
              animated: true
            })
          }
          rightIcon={{ ...this.images("bell") }}
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
    ...Fonts.poppinsRegular(22),
    color: Colors.TEXT_COLOR,
    marginTop: 20
  },
  childContainer: {
    flex: 1,
    paddingVertical: 15
  },
  footerButton: {
    width: "90%",
    marginTop: "15%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  }
})
