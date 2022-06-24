import React from "react"
import { View, Text, StyleSheet, Image, FlatList } from "react-native"
import { BaseScene, Button } from "../Common"
import { Fonts, Colors } from "../../res"

export default class ActiveEmpView extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderEmployeeCell() {
    return (
      <View style={{ padding: 20 }}>
        <Image />
        <View>
          <Text style={styles.employeeName}>John Doe</Text>
          <Text style={styles.employeeWorksite}>Worksite 1</Text>
        </View>
      </View>
    )
  }

  renderUpperView() {
    return (
      <View style={styles.upperView}>
        <Text style={styles.title}>{this.ls("activeEmployees")}</Text>
        <Image
          {...this.images("arrowDown")}
          style={[this.images("arrowDown").style, { tintColor: "black" }]}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderUpperView()}
        <FlatList
          data={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }]}
          renderItem={() => this.renderEmployeeCell()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 0.5,
    borderColor: "#bfefec"
  },
  upperView: {
    backgroundColor: "#dedede",
    borderRadius: 10,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR
  },
  footerButton: {
    marginTop: "15%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 10
  },
  image: {
    tintColor: Colors.BUTTON_BG,
    width: 30,
    height: 30
  },
  employeeName: {
    ...Fonts.poppinsRegular(14)
  },
  employeeWorksite: {
    ...Fonts.poppinsRegular(12),
    color: Colors.HOME_DES
  }
})
