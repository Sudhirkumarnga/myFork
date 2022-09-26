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
import { Colors, Fonts } from "../../res"
import { BaseComponent, Button } from "../Common"
const { width, height } = Dimensions.get("window")

class SubscriptionModal extends BaseComponent {
  constructor(props) {
    super()
    this.state = {
      visible: true
    }
  }

  componentDidMount() {}

  renderSeparator() {
    return <View style={styles.separator} />
  }

  renderButtons() {
    return (
      <Button
        style={styles.footerButton}
        title={"Subscribe"}
        onPress={this.props.onRequestClose}
      />
    )
  }

  renderCloseButton() {
    return (
      <TouchableOpacity
        onPress={this.props.onRequestClose}
        style={{ position: "absolute", right: 10, top: 13 }}
      >
        <Image {...this.images("close")} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent
        animationType="fade"
        onRequestClose={this.props.onRequestClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={this.props.onRequestClose}
        >
          <View style={styles.modalView}>
            <View>
              <Text style={styles.title}>{"Basic Offer"}</Text>
              <Text style={styles.description}>
                {
                  "Lorem ipsum dolor $9.99 per yearsit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"
                }
              </Text>
              {this.renderButtons()}
              {this.renderCloseButton()}
            </View>
          </View>
        </TouchableOpacity>
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
    alignItems: "center"
  },
  modalView: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "absolute",
    justifyContent: "center"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    textAlign: "left",
    color: Colors.LIGHT_TEXT_COLOR,
    marginVertical: 20
  },
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR,
    marginTop: 10
  },
  footerButton: {
    width: "100%",
    marginTop: 15
  }
})
export default SubscriptionModal
