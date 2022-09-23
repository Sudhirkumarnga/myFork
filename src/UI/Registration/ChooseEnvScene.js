import React, { Component } from "react"
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native"
import { BaseScene, Button } from "../Common"
import { Fonts, Colors } from "../../res"
import { AsyncHelper } from "../../Utils"

export default class ChooseEnvScene extends BaseScene {
  updateEnv(env) {
    AsyncHelper.addEnv(env)
      .then(res => {
        this.props.navigation.navigate("registration")
      })
      .catch()
  }

  render() {
    return (
      <ImageBackground
        source={this.images("splashBg").source}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Image source={this.images("appLogo").source} />
          <Text style={styles.description}>{"I am a"}</Text>
          <Button
            title={this.ls("buinessAdmin")}
            isWhiteBg
            style={{ marginTop: "10%" }}
            onPress={() => this.updateEnv("admin")}
          />
          <Button
            title={this.ls("employee")}
            isWhiteBg
            style={{ marginTop: "5%" }}
            onPress={() => this.updateEnv("employee")}
          />
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  description: {
    ...Fonts.poppinsRegular(20),
    color: "white",
    textAlign: "center",
    marginTop: "30%"
  }
})
