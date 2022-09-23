import { Platform } from "react-native"

const Fonts = {
  poppinsRegular: (s = 12) => {
    return {
      fontFamily: "Poppins-Regular",
      fontSize: s
    }
  },
  poppinsMedium: (s = 12) => {
    return {
      fontFamily: "Poppins-Medium",
      fontSize: s
    }
  }
}

module.exports = {
  ...Fonts
}
