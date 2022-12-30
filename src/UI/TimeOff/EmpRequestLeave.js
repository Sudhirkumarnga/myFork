import React from "react"
import { View, FlatList, StyleSheet, Text } from "react-native"
import { BaseComponent, Button } from "../Common"
import { Fonts, Colors } from "../../res"
import DenyModal from "./DenyModal"
import moment from "moment"

export default class EmpRequestLeave extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      denyModalVisible: false,
      leaveItem: null,
      data: [
        {
          title: "Employee name:",
          des: "John Doe"
        }
      ]
    }
  }

  renderRequestCell(leaveItem) {
    const data = [
      {
        title: "Employee name:",
        des: leaveItem?.Employee_name
      },
      {
        title: "Date submitted:",
        des: moment.utc(leaveItem?.created_at).local().fromNow()
      },
      {
        title: "Dates requested:",
        des:
          moment.utc(leaveItem?.from_date).local().format("YYYY-MM-DD") +
          " - " +
          moment.utc(leaveItem?.to_date).local().format("YYYY-MM-DD")
      },
      {
        title: "Description:",
        des: leaveItem?.description
      }
    ]
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
        {this.renderButtons(leaveItem)}
      </View>
    )
  }

  renderButtons(leaveItem, handleChange) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title={
            leaveItem?.status === "APPROVED" ? "Approved" : this.ls("approve")
          }
          disabled={
            this.props.loadingApprove ||
            leaveItem?.status === "APPROVED" ||
            leaveItem?.status === "DENY"
          }
          style={styles.footerButton}
          onPress={() => this.props.UpdateRequest(leaveItem?.id, "APPROVED")}
        />
        <Button
          title={leaveItem?.status === "DENY" ? "Denied" : this.ls("deny")}
          color={Colors.BUTTON_BG}
          style={styles.footerWhiteButton}
          disabled={
            this.props.loadingApprove ||
            leaveItem?.status === "APPROVED" ||
            leaveItem?.status === "DENY"
          }
          onPress={() => {
            this.props.handleChange("denyModalVisible", true, true)
            this.props.handleChange("leaveItem", leaveItem, true)
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
          visible={this.props.denyModalVisible}
          handleChange={this.props.handleChange}
          UpdateRequest={this.props.UpdateRequest}
          leaveItem={this.props.leaveItem}
          admin_note={this.props.admin_note}
          loadingApprove={this.props.loadingApprove}
          onRequestClose={() => this.setState({ denyModalVisible: false })}
        />
        <FlatList
          data={this.props.leaveRequest || []}
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
    width: "48%",
    marginVertical: 20,
    height: 40
  },
  footerWhiteButton: {
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG,
    width: "48%",

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
