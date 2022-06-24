import React, { Component } from "react"
import { Colors, Strings, Images, Fonts } from "../../res"
import BaseComponent from "./BaseComponent"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"

class AvatarView extends BaseComponent {
  renderUserImage(styles) {
    const { source, style } = Images.userPlaceHolder
    const imageStyle = [styles.userImageStyle, style]
    const image = this.props.image

    if (!!this.props.image && this.props.userImage) {
      return <Image source={image} style={[imageStyle]} resizeMode="cover" />
    } else {
      return <Image source={source} style={imageStyle} resizeMode="contain" />
    }
  }

  renderEditContainer(styles) {
    return (
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={this.props.onEditImageTapped}
      >
        <Image {...Images.camera} />
        <Text style={styles.uploadText}>{this.ls("uploadPhoto")}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.userImage && this.renderUserImage(styles)}
        {this.renderEditContainer(styles)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {},
  container: {
    width: 102,
    height: 102,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    backgroundColor: Colors.DARK_GREY,
    borderRadius: 10,
    alignSelf: "center"
  },
  uploadText: {
    ...Fonts.poppinsRegular(10),
    alignSelf: "center",
    color: Colors.GREEN_COLOR,
    marginTop: 5
  },
  infoContainer: {
    marginLeft: 10
  },
  editIconContainer: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute"
  },
  userImageStyle: {
    borderRadius: 5
  }
})

export default AvatarView
