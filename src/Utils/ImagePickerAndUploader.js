import ImagePicker from "react-native-image-crop-picker"

export default class ImagePickerAndUploader {
  static pickAndUpload(config, purpose) {
    console.log(config)
    let options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200
    }

    return new Promise((resolve, reject) => {
      ImagePicker.openPicker(config)
        .then(responseData => {
          const response = { image: responseData }
          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
