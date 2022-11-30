import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useContext, useState } from "react"
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native"
import Toast from "react-native-simple-toast"
import { getAllEmployee } from "../../api/business"
import { Fonts, Colors } from "../../res"
import Sample from "../../res/Images/common/sample.png"
import Button from "../Common/Button"
import { Switch } from "react-native-switch"
import AppContext from "../../Utils/Context"
import moment from "moment-timezone"
import { Modal } from "react-native"
import { Icon } from "react-native-elements"
import Strings from "../../res/Strings"
import PrimaryTextInput from "../Common/PrimaryTextInput"

export default function MyEarningsListScene({ navigation }) {
  const { earnings, _getEarnings } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    allEmployee: [],
    visible: false,
    name: "",
    date: null
  })
  const { loading, visible, isDisplay, name, date } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getEarnings()
    }, [])
  )

  const hideModal = () => {
    handleChange("selectedEvent", null)
    handleChange("visible", false)
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 20
        }}
      >
        <View>
          <Text style={styles.title1}>
            Total amount earned: ${earnings?.total_earned}
          </Text>
        </View>
      </View>
      {loading && (
        <View style={{ marginBottom: 10, width: "100%", alignItems: "center" }}>
          <ActivityIndicator color={Colors.BACKGROUND_BG} size={"small"} />
        </View>
      )}
      <FlatList
        scrollEnabled={false}
        style={{ width: "100%" }}
        data={earnings?.worksites}
        renderItem={({ item, index }) => (
          <View style={styles.listContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={styles.title}>{item?.worksite}</Text>
                  <Text style={[styles.job, { ...Fonts.poppinsRegular(10) }]}>
                    {moment(item?.created_at).fromNow()}
                  </Text>
                </View>
                <Text style={[styles.job, { marginVertical: 5 }]}>
                  Amount clocked: {item?.amount_clocked}
                </Text>
                <Text style={styles.job}>Earned: ${item?.earned}</Text>
              </View>
            </View>
          </View>
        )}
      />
      <Modal
        visible={visible}
        transparent
        onDismiss={hideModal}
        onRequestClose={hideModal}
      >
        <View style={styles.centerMode}>
          <View style={styles.modal}>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity onPress={hideModal}>
                <Icon name="close" type="antdesign" />
              </TouchableOpacity>
            </View>
            <Text style={styles.titleHead}>{"Filter Payroll"}</Text>
            <PrimaryTextInput
              text={name}
              key="name"
              label="Enter employee name"
              onChangeText={(text, isValid) => handleChange("name", text)}
            />
            <PrimaryTextInput
              text={date}
              dateType={true}
              key="date"
              label="Choose Date"
              onChangeText={(text, isValid) => handleChange("date", text)}
            />
            <Button
              style={[styles.footerWhiteButton]}
              onPress={() => {
                // navigation.navigate('addEvents', { selectedEvent })
                // hideModal()
              }}
              title={"Apply filter"}
              color={Colors.BUTTON_BG}
            />
            <Button
              style={[styles.footerWhiteButton, { borderWidth: 0 }]}
              onPress={() => {
                hideModal()
              }}
              isWhiteBg
              title={"Cancel"}
              color={Colors.BUTTON_BG}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.WHITE
  },
  listContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.TEXT_INPUT_BORDER,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  },
  titleHead: {
    ...Fonts.poppinsRegular(18),
    color: Colors.TEXT_COLOR
  },
  title1: {
    ...Fonts.poppinsRegular(16),
    color: Colors.TEXT_COLOR
  },
  location: {
    ...Fonts.poppinsRegular(12),
    color: Colors.TEXT_COLOR
  },
  job: {
    ...Fonts.poppinsRegular(12),
    color: Colors.BLUR_TEXT
  },
  hourly: {
    ...Fonts.poppinsRegular(13),
    textTransform: "uppercase",
    textAlign: "right",
    width: "100%",
    marginBottom: 10,
    color: Colors.BLUR_TEXT
  },
  dateText: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
  },
  displayText: {
    ...Fonts.poppinsRegular(13),
    color: Colors.TEXT_COLOR
  },
  message: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
  },
  childContainer: {
    flex: 1,
    padding: 20
  },
  footerButton: {
    marginTop: "15%"
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: "left",
    marginTop: 20,
    lineHeight: 24
  },
  inputStyle: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    color: Colors.TEXT_INPUT_COLOR,
    paddingHorizontal: 15,
    ...Fonts.poppinsRegular(14),
    borderWidth: 1,
    backgroundColor: Colors.TEXT_INPUT_BG,
    borderColor: Colors.TEXT_INPUT_BORDER
  },
  inputText: {
    color: Colors.TEXT_INPUT_COLOR,
    ...Fonts.poppinsRegular(14)
  },
  footerWhiteButton: {
    marginTop: "5%",
    height: 40,
    width: "90%",
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  },
  centerMode: {
    backgroundColor: Colors.MODAL_BG,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    width: "90%"
  }
})
