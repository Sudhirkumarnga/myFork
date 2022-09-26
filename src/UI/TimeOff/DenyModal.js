import React from "react"
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Text,
  Dimensions
} from "react-native"
import { Colors, Images, Fonts } from "../../res"
import { Button, BaseComponent, PrimaryTextInput } from "../Common"
const { width, height } = Dimensions.get("window")

class DenyModal extends BaseComponent {
  constructor(props) {
    super()
    this.state = {
      visible: props.visible
    }
  }

  componentDidMount() {}

  renderSeparator() {
    return <View style={styles.separator} />
  }

  renderButton() {
    return (
      <View style={styles.footerButtonsContainer}>
        <Button style={styles.footerSkipButton} title={this.ls("send")} />
      </View>
    )
  }

  renderCancelButton() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this.props.onRequestClose}
      >
        <Text style={styles.cancelText}>{this.ls("cancel")}</Text>
      </TouchableOpacity>
    )
  }

  renderMessageInput() {
    return (
      <PrimaryTextInput
        ref={o => (this["message"] = o)}
        label={this.ls("reasonForDeny")}
        onChangeText={() => {}}
        inputStyle={{ height: 80, width: "100%", marginTop: 20 }}
        multiline
      />
    )
  }

  renderCross() {
    return (
      <TouchableOpacity
        onPress={this.props.onRequestClose}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        <Image {...this.images("cross")} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.container}>
          <View style={styles.modalView}>
            {this.renderCross()}
            <Text style={styles.title}>{this.ls("message")}</Text>
            {this.renderMessageInput()}
            {this.renderButton()}
            {this.renderCancelButton()}
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red"
  },
  modalView: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "absolute",
    justifyContent: "center"
  },
  title: {
    ...Fonts.poppinsMedium(22),
    textAlign: "left",
    color: Colors.BLACK
  },
  cancelText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20
  }
})
export default DenyModal
