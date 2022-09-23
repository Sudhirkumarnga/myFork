import React, { Component } from "react"
import { Images, Strings, Theme } from "../../res"

import {
  View,
  Text,
  BackHandler,
  Platform,
  InteractionManager
} from "react-native"

let appImages = null
let appStrings = null
let appTheme = null

class BaseComponent extends Component {
  constructor() {
    super()
    appImages = Images
    appStrings = Strings
    appTheme = Theme
  }

  images(k) {
    return appImages[k]
  }

  ls(k) {
    return appStrings[k]
  }

  theme() {
    return appTheme
  }
}

export default BaseComponent
