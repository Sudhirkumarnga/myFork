import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { BaseComponent, Button } from "../Common"
import { Fonts, Colors } from "../../res"
import DenyModal from "./DenyModal"

const data = [
  {
    title: "Employee name:",
    des: "John Doe"
  },
  {
    title: "Date submitted:",
    des: "April 28, 2022"
  },
  {
    title: "Description:",
    des: "Lorem ipsum dolor sitameconsecteturadipi scing"
  }
]

export default class EmpRequestLeave extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      denyModalVisible: false,
      data: [
        {
          title: "Employee name:",
          des: "John Doe"
        }
      ]
    }
  }

  renderRequestCell() {
    return (
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderColor: Colors.PAYMENT_CELL_BORDER
        }}
      >
        {data.map(item => {
          return (
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.des}</Text>
            </View>
          )
        })}
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title={this.ls("approve")}
          style={styles.footerButton}
          onPress={() => {}}
        />
        <Button
          title={this.ls("deny")}
          style={styles.footerWhiteButton}
          onPress={() => {
            this.setState({ denyModalVisible: true })
          }}
          isWhiteBg
          textStyle={{ color: Colors.BUTTON_BG }}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <DenyModal
          visible={this.state.denyModalVisible}
          onRequestClose={() => this.setState({ denyModalVisible: false })}
        />
        <FlatList
          data={[1, 2, 3]}
          renderItem={({ item }) => this.renderRequestCell(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    ...Fonts.poppinsRegular(12),
    color: Colors.HOME_DES
  },
  childContainer: {
    flex: 1
  },
  footerButton: {
    width: "45%",
    marginVertical: 20,
    height: 40
  },
  footerWhiteButton: {
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG,
    width: "45%",
    marginVertical: 20,
    height: 40
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 2
  }
})
