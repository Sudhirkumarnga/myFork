import React from "react"
import PropTypes from "prop-types"
import { View, Text, Alert, Platform, InteractionManager } from "react-native"
import BaseComponent from "./BaseComponent"

class BaseScene extends BaseComponent {
  constructor(props) {
    super(props)
    // this.showSpinner = this.showSpinner.bind(this)
    // this.handleError = this.handleError.bind(this)
  }

  onOfflineRetry() {
    if (__DEV__) {
      console.warn(
        "This is BaseScene, override onOfflineRetry method in customScene..."
      )
    }
    //this.showOffline(false)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>I am the BaseScene component, Super Class of all Scenes.</Text>
      </View>
    )
  }
}

export default BaseScene
