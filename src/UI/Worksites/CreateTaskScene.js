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
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Forms,
  WorksiteForms,
  Button
} from "../Common"
import { Fonts, Colors } from "../../res"
const { height, width } = Dimensions.get("window")

export default class CreateTaskScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
    // this.isFormValid = this.isFormValid.bind(this)
  }

  setForms(field) {
    this.taskForm = WorksiteForms.fields("addTask")
  }

  renderTaskInfoInput() {
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
      <View style={{ padding: 20 }}>
        <Button
          style={[styles.footerWhiteButton]}
          isWhiteBg
          icon={"upload"}
          title={this.ls("uploadMedia")}
        />
        <Button
          style={[styles.footerWhiteButton]}
          title={this.ls("edit")}
          icon={"edit"}
          isWhiteBg
          textStyle={{ color: Colors.BUTTON_BG }}
        />
        <Button style={styles.footerButton} title={this.ls("create")} />
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.childContainer}>
          <Text style={styles.title}>{this.ls("worksiteNumber")}</Text>
          {this.renderTaskInfoInput()}
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
          <Header title={this.ls("createTask")} leftButton />
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
  },
  footerWhiteButton: {
    marginTop: "5%",
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
