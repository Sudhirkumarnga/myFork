import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native"
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer"
import { BaseComponent } from "../UI/Common"
import { Colors, Fonts } from "../res"

class CustomDrawer extends BaseComponent {
  state = {
    name: "",
    email: ""
  }

  renderInfoSection() {
    return (
      <View style={styles.userInfoSection}>
        <Image
          {...this.images("appLogo")}
          style={{
            tintColor: Colors.BUTTON_BG,
            width: "60%",
            resizeMode: "contain"
          }}
        />
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.toggleDrawer({
              side: "left",
              animated: true
            })
          }
        >
          <Image {...this.images("cross")} />
        </TouchableOpacity>
      </View>
    )
  }

  renderDrawerCell(label, icon, name) {
    const imageName = `drawer_${icon}`
    return (
      <DrawerItem
        label={label}
        labelStyle={styles.drawerText}
        style={styles.drawerRow}
        onPress={() =>
          !!name &&
          this.props.navigation.navigate("ConsultationScene", {
            isDrawer: true
          })
        }
        icon={color => <Image {...this.images(imageName)} />}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderInfoSection()}
        <DrawerContentScrollView {...this.props}>
          <DrawerItemList {...this.props} />
        </DrawerContentScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  userInfoSection: {
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "20%"
  },
  imageInfo: {
    justifyContent: "center",
    alignItems: "center"
  },

  drawerRow: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  drawerText: {
    ...Fonts.poppinsMedium(18),
    marginRight: -10
  }
})

export default CustomDrawer
