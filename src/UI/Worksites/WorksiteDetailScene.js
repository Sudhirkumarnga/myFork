import React from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { BaseScene, Header, Button } from "../Common"
import { Colors, Fonts } from "../../res"
import PrimaryTextInput from "../Common/PrimaryTextInput"
const { width } = Dimensions.get("window")

export default class WorksiteDetailScene extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {
      info: [
        { title: "Worksite Name:", description: "Worksite number 1" },
        { title: "Worksite Location:", description: "Worksite Location" },
        { title: "Worksite Location:", description: "Worksite Location" },
        { title: "Description:", description: "Worksite description" },
        { title: "Worksite Location:", description: "Worksite Location" },
        {
          title: "Notes:",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua."
        },
        { title: "Monthly rate:", description: "Monthly rate info" },
        { title: "Cleaning rate by day:", description: "Day selected" },
        { title: "Desired time:", description: "Desired time:" }
      ]
    }
  }

  renderButtons() {
    return (
      <View>
        <Button style={styles.footerButton} title={this.ls("createTask")} />
        <Button
          style={[styles.footerWhiteButton]}
          title={this.ls("edit")}
          icon={"edit"}
          isWhiteBg
          textStyle={{ color: Colors.BUTTON_BG }}
        />
        <Button
          style={[styles.footerWhiteButton]}
          isWhiteBg
          icon={"delete"}
          title={this.ls("deleteWorksite")}
        />
      </View>
    )
  }

  renderWorksiteInfo() {
    return (
      <View style={styles.childContainer}>
        <Text style={styles.title}>{this.ls("worksiteInfo")}</Text>
        {this.state.info.map((item, index) => {
          return (
            <View style={styles.cellContainer}>
              <Text style={styles.description}>{item.title}</Text>
              <Text style={styles.cellTitle}>{item.description}</Text>
              {item.title.includes("day") && (
                <PrimaryTextInput
                  style={{ width }}
                  dropdown
                  items={[{ value: "Sunday", label: "Sunday" }]}
                />
              )}
            </View>
          )
        })}
      </View>
    )
  }

  renderContactInfo() {
    return (
      <View style={styles.childContainer}>
        <Text style={styles.title}>{this.ls("contactInfo")}</Text>
        <View style={styles.cellContainer}>
          <Text style={styles.description}>{"Name"}</Text>
          <Text style={styles.cellTitle}>{"John doe"}</Text>
        </View>
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView>
        <View style={styles.childContainer}>
          {this.renderWorksiteInfo()}
          {this.renderContactInfo()}
          {this.renderButtons()}
        </View>
      </ScrollView>
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
    marginBottom: 10
  },
  childContainer: {
    flex: 1,
    padding: 15
  },
  footerButton: {
    marginTop: "5%",
    width: "100%"
  },
  footerWhiteButton: {
    marginTop: "5%",
    width: "100%",
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  },
  description: {
    ...Fonts.poppinsRegular(12),
    color: "#818080",
    textAlign: "left",
    marginTop: 10
  },
  cellContainer: {
    marginVertical: 10
  },
  cellTitle: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  }
})
