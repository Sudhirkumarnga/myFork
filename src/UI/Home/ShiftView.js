import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { BaseScene, Button } from "../Common"
import { Fonts, Colors } from "../../res"

export default class ShiftView extends BaseScene {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderClockButton() {
    return <Button title={this.ls("clockIn")} style={{ marginTop: 30 }} />
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View>
            <Text style={styles.title}>{this.ls("upcomingShift")}</Text>
            <Text style={styles.description}>{this.ls("worksiteNumber")}</Text>
            <Text
              style={[
                styles.description,
                { fontSize: 14, color: Colors.HOME_DES }
              ]}
            >
              {"Location:"}
            </Text>
          </View>
          <Image {...this.images("calendar")} style={styles.image} />
        </View>
        {this.renderClockButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedede",
    borderRadius: 10,
    padding: 15
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
  }
})
