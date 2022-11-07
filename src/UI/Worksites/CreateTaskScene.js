import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Header, PrimaryTextInput, WorksiteForms, Button } from '../Common'
import { Fonts, Colors, Strings } from '../../res'
import ImagePicker from 'react-native-image-crop-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createTask } from '../../api/business'

export default function CreateTaskScene ({ navigation, route }) {
  const worksiteData = route?.params?.worksiteData
  // State
  const [state, setState] = useState({
    name: '',
    description: '',
    notes: '',
    criticality: '',
    frequency_of_task: '',
    files: null,
    loading: false,
    photos: []
  })

  const {
    loading,
    name,
    criticality,
    description,
    notes,
    frequency_of_task,
    files,
    photos
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const formData = {
        worksite: worksiteData?.id,
        name,
        criticality,
        description,
        notes,
        frequency_of_task
      }
      const obj = {}

      photos.length > 0 &&
        photos.forEach((element, index) => {
          obj['file' + index + 1] = element
        })
      formData.files = obj
      console.warn('formData', formData)
      const res = await createTask(formData, token)
      console.warn('createAdminProfile', res?.data)
      handleChange('loading', false)
      navigation.navigate('AllWorksiteScene')
      Toast.show(`Task has been created!`)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error?.response?.data)
      const showWError = Object.values(error.response?.data?.error)
      if (showWError.length > 0) {
        Toast.show(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        Toast.show(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  const _uploadImage = async type => {
    handleChange('uploading', true)
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker
    OpenImagePicker({
      cropping: true,
      multiple: true,
      includeBase64: true
    })
      .then(async response => {
        if (!response.length) {
          handleChange('uploading', false)
        } else {
          const photos = []
          for (let i = 0; i < response.length; i++) {
            const element = response[i]
            photos.push(element.data)
            handleChange('uploading', false)
          }
          handleChange('photos', photos)
          Toast.show('Media Added')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const renderTaskInfoInput = () => {
    return WorksiteForms.fields('addTask').map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          key={fields.key}
          onChangeText={(text, isValid) => handleChange(fields.key, text)}
        />
      )
    })
  }

  const renderFooterButtons = () => {
    return (
      <View style={{ padding: 20 }}>
        <Button
          style={[styles.footerWhiteButton]}
          onPress={_uploadImage}
          isWhiteBg
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          color={Colors.BUTTON_BG}
          icon={'upload'}
          title={Strings.uploadMedia}
        />
        {/* <Button
          style={[styles.footerWhiteButton]}
          title={Strings.edit}
          icon={'edit'}
          isWhiteBg
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          color={Colors.BUTTON_BG}
        /> */}
        <Button
          style={styles.footerButton}
          loading={loading}
          onPress={handleSubmit}
          disabled={
            !name ||
            !description ||
            !criticality ||
            !notes ||
            !frequency_of_task ||
            photos.length === 0
          }
          title={Strings.create}
        />
      </View>
    )
  }

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.childContainer}>
          <Text style={styles.title}>{worksiteData?.personal_information?.name}</Text>
          {renderTaskInfoInput()}
          {renderFooterButtons()}
        </View>
      </KeyboardAwareScrollView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <View style={styles.container}>
        <Header
          title={Strings.createTask}
          onLeftPress={() => navigation.goBack()}
          leftButton
        />
        {renderContent()}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.WHITE
  },
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR,
    margin: 20
  },
  childContainer: {
    flex: 1
  },
  footerButton: {
    marginTop: '5%',
    width: '100%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 24
  },
  footerWhiteButton: {
    marginTop: '5%',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
