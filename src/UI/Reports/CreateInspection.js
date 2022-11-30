import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Text } from "react-native"
import { Header } from "../Common"
import { Fonts, Images, Colors } from "../../res"
import { Button } from "../Common"
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu"
import { Icon } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  createInspectionReport,
  getWorksitesInspection,
  getWorksitesTasks,
  locationVarianceReports,
  payrollReports,
  scheduleVarianceReports
} from "../../api/business"
import { useFocusEffect } from "@react-navigation/native"
import ImagePicker from "react-native-image-crop-picker"
import { useCallback } from "react"
import Fab from "../Common/Fab"
import PrimaryTextInput from "../Common/PrimaryTextInput"
import Toast from "react-native-simple-toast"
import { Platform } from "react-native"

export default function CreateInspection({ navigation, route }) {
  const [state, setState] = useState({
    loading: false,
    allWorksites: [],
    worksiteTasks: [],
    areas: [],
    worksite: "",
    name: "",
    area_name: "",
    task: "",
    photo: "",
    loadingCreate: false
  })

  const {
    loading,
    area_name,
    task,
    worksiteTasks,
    allWorksites,
    name,
    worksite,
    areas,
    photo,
    loadingCreate
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getReports()
    }, [])
  )

  const _uploadImage = async type => {
    handleChange("uploading", true)
    let OpenImagePicker =
      type == "camera"
        ? ImagePicker.openCamera
        : type == ""
        ? ImagePicker.openPicker
        : ImagePicker.openPicker
    OpenImagePicker({
      cropping: true,
      includeBase64: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange("uploading", false)
        } else {
          const uri = response.path
          const uploadUri =
            Platform.OS === "ios" ? uri.replace("file://", "") : uri
          handleChange("profile_image", uploadUri)
          handleChange("photo", response.data)
          handleChange("uploading", false)
          Toast.show("Media uploaded")
        }
      })
      .catch(err => {
        handleChange("showAlert", false)
        handleChange("uploading", false)
      })
  }

  const _getReports = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const res = await getWorksitesInspection(token)
      const list = []
      res?.data?.response?.forEach(element => {
        if (element) {
          list.push({
            value: element?.id,
            label: element?.name
          })
        }
      })
      handleChange("allWorksites", list)
      handleChange("loading", false)
    } catch (error) {
      handleChange("loading", false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const _getWorksiteArea = async id => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const res = await getWorksitesTasks(id, token)
      const list = []
      res?.data?.response?.forEach(element => {
        if (element) {
          list.push({
            value: element?.id,
            label: element?.name
          })
        }
      })
      handleChange("worksiteTasks", list)
      handleChange("loading", false)
    } catch (error) {
      handleChange("loading", false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const _createInspectionReport = async () => {
    try {
      handleChange("loadingCreate", true)
      const token = await AsyncStorage.getItem("token")
      const payload = {
        name,
        worksite,
        areas,
        media: [{ file: photo }]
      }
      const res = await createInspectionReport(payload, token)
      handleChange("loadingCreate", false)
      handleChange("name", "")
      handleChange("worksite", "")
      handleChange("areas", [])
      handleChange("photo", "")
      Toast.show(`Inspection report has been created`)
    } catch (error) {
      handleChange("loadingCreate", false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const getWorksiteText = (data, id) => {
    const filtered = data?.filter(e => e.value === id)
    return (filtered?.length > 0 && filtered[0]?.label) || ""
  }

  return (
    <View style={styles.container}>
      <Header
        back
        leftButton
        title={"Create Inspection Report"}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ width: "100%" }}
      >
        <PrimaryTextInput
          text={name}
          style={{ marginTop: 20 }}
          label="Inspection report name"
          key="name"
          placeholder="Inspection report name"
          onChangeText={(text, isValid) => handleChange("name", text)}
        />
        <PrimaryTextInput
          dropdown={true}
          text={getWorksiteText(allWorksites, worksite)}
          items={allWorksites}
          label={getWorksiteText(allWorksites, worksite) || "Worksite name"}
          key="worksite"
          placeholder="Worksite name"
          onChangeText={(text, isValid) => {
            handleChange("worksite", text)
            _getWorksiteArea(text)
          }}
        />
        <PrimaryTextInput
          text={area_name}
          label="Area name"
          key="area_name"
          placeholder="Area name"
          onChangeText={(text, isValid) => handleChange("area_name", text)}
        />
        <PrimaryTextInput
          dropdown={true}
          text={getWorksiteText(worksiteTasks, task)}
          items={worksiteTasks}
          label={getWorksiteText(worksiteTasks, task) || "Task name"}
          key="task"
          placeholder="Task name"
          onChangeText={(text, isValid) => {
            handleChange("task", text)
          }}
        />
        <Button
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: Colors.GREEN_COLOR
          }}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: "contain"
          }}
          icon={"upload"}
          onPress={_uploadImage}
          isWhiteBg
          color={Colors.GREEN_COLOR}
          backgroundColor={"transparent"}
          title={"Upload media"}
        />
        <Button
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: Colors.GREEN_COLOR
          }}
          onPress={() => {
            handleChange("areas", [...areas, { area_name, tasks: [task] }])
            handleChange("area_name", "")
            handleChange("task", "")
          }}
          disabled={!area_name || !task}
          isWhiteBg
          color={Colors.GREEN_COLOR}
          backgroundColor={"transparent"}
          title={"+ Add area"}
        />
        <Button
          style={{
            height: 40,
            marginTop: 50
          }}
          loading={loadingCreate}
          disabled={(!name || areas.length === 0, !photo)}
          onPress={_createInspectionReport}
          title={"Create"}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },

  title: {
    ...Fonts.poppinsRegular(12),
    color: Colors.HOME_DES
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
    marginTop: 2
  }
})
