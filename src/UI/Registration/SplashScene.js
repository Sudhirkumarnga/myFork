import React, { Component } from "react"
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native"
import { BaseScene, Button } from "../Common"
import { Fonts, Colors } from "../../res"

export default class SplashScene extends BaseScene {
  render() {
    return (
      <ImageBackground
        source={this.images("splashBg").source}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Image source={this.images("appLogo").source} />
          <Text style={styles.description}>{this.ls("splashDescription")}</Text>
          <Button
            title={"Continue"}
            isWhiteBg
            style={{ marginTop: "30%" }}
            onPress={() => this.props.navigation.navigate("chooseEnv")}
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
    marginVertical: 30
  }
})
