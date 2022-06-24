import AsyncStorage from "@react-native-async-storage/async-storage"

export default class AsyncHelper {
  static async addEnv(value) {
    try {
      await AsyncStorage.setItem("appEnv", value)
    } catch (e) {
      // saving error
    }
  }

  static async getEnv() {
    return await AsyncStorage.getItem("appEnv").then(res1 => {
      return res1
    })
  }
}
