import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native"
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Forms,
  AvatarView,
  Button
} from "../Common"
import { Fonts, Colors } from "../../res"
const { height, width } = Dimensions.get("window")

export default class AddEmployeeScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
    // this.isFormValid = this.isFormValid.bind(this)
  }

  setForms(field) {
    this.personalforms = Forms.fields("employeePersonalInfo")
    this.employeeContact = Forms.fields("employeeContact")
    this.address = Forms.fields("employeeAddress")
    this.employeeWorkInfo = Forms.fields("employeeWorkInfo")
  }

  renderPersonalInfoInput() {
    return this.personalforms.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
        />
      )
    })
  }

  renderWorkInfo() {
    return this.employeeWorkInfo.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
        />
      )
    })
  }

  renderEmployeeContactInput() {
    return this.employeeContact.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
        />
      )
    })
  }

  renderAddressInfo() {
    return this.address.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
        />
      )
    })
  }

  renderFooterButton() {
    return (
      <Button
        title={this.ls("submit")}
        style={styles.footerButton}
        onPress={() => this.onSubmit()}
      />
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.childContainer}>
          <Text style={styles.title}>{this.ls("personalInfo")}</Text>
          {this.renderPersonalInfoInput()}
          <Text style={styles.title}>{this.ls("contact")}</Text>
          {this.renderEmployeeContactInput()}
          <Text style={styles.title}>{this.ls("addressInfo")}</Text>
          {this.renderAddressInfo()}
          <Text style={styles.title}>{this.ls("workInfo")}</Text>
          {this.renderWorkInfo()}
          {this.renderFooterButton()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={styles.container}>
          <Header title={this.ls("addEmployee")} />
          {this.renderContent()}
        </View>
      </KeyboardAvoidingView>
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
    margin: 20
  },
  childContainer: {
    flex: 1
  },
  footerButton: {
    marginTop: "5%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  }
})
