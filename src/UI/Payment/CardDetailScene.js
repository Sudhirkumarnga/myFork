import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native"
import { BaseScene, Header, PrimaryTextInput, Forms, Button } from "../Common"
import { Fonts, Colors } from "../../res"
import CardInput from "./CardInput"
const { height, width } = Dimensions.get("window")

export default class CardDetailScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
    // this.isFormValid = this.isFormValid.bind(this)
  }

  setForms(field) {
    this.taskForm = Forms.fields("cardHolder")
  }

  renderCardHolderInput() {
    return this.taskForm.map(fields => {
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

  renderFooterButtons() {
    return (
      <View style={{ padding: 20, paddingTop: 0 }}>
        <Button style={styles.footerButton} title={this.ls("update")} />
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.childContainer}>
          <Text style={styles.title}>{this.ls("cardHolderDets")}</Text>
          {this.renderCardHolderInput()}
          <Text style={styles.title}>{this.ls("cardDets")}</Text>
          <CardInput />
          {this.renderFooterButtons()}
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
          <Header title={this.ls("cardDets")} leftButton />
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
    marginTop: 15
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  }
})
