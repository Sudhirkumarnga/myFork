import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native'
import { Header, PrimaryTextInput, Forms, Button } from '../Common'
import { Fonts, Colors, Images } from '../../res'
import Strings from '../../res/Strings'
import WorksiteForms from '../Common/WorksiteForms'
import ImagePicker from 'react-native-image-crop-picker'
import { createWorksite } from '../../api/business'
import Toast from 'react-native-simple-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFS from 'react-native-fs';

export default function AddWorksiteScene ({ navigation }) {
  // State
  const [state, setState] = useState({
    name: '',
    location: '',
    description: '',
    notes: '',
    monthly_rates: '',
    clear_frequency_by_day: '',
    desired_time: '',
    number_of_workers_needed: '',
    supplies_needed: '',
    contact_person_name: '',
    contact_phone_number: '',
    show_dtails: true,
    profile_image: '',
    logo: null,
    loading: false
  })

  const {
    loading,
    name,
    location,
    description,
    notes,
    monthly_rates,
    clear_frequency_by_day,
    desired_time,
    number_of_workers_needed,
    supplies_needed,
    contact_person_name,
    contact_phone_number,
    show_dtails,
    logo,
    instruction_video
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const formData = {
        worksite_information: {
          name,
          location,
          description,
          notes,
          monthly_rates,
          clear_frequency_by_day,
          desired_time,
          number_of_workers_needed,
          supplies_needed
        },
        contact_person: {
          contact_person_name,
          contact_phone_number
        },
        show_dtails,
        logo,
        instruction_video
      }
      console.warn('formData', formData)
      const res = await createWorksite(formData, token)
      console.warn('createAdminProfile', res?.data)
      handleChange('loading', false)
      navigation.goBack()
      Toast.show(`Worksite has been added!`)
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
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange('uploading', false)
        } else {
          const uri = response.path
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          handleChange('profile_image', uploadUri)
          handleChange('logo', response.data)
          handleChange('uploading', false)
          Toast.show('Logo Added')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const _uploadVideo = async type => {
    handleChange('uploading', true)
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker
    OpenImagePicker({
      includeBase64: true,
      mediaType: 'video'
    })
      .then(async response => {
        if (!response.path) {
          handleChange('uploading', false)
        } else {
          const base64 = await RNFS.readFile(response.path, 'base64')
          console.warn('base64',base64);
          handleChange('instruction_video', base64)
          handleChange('uploading', false)
          Toast.show('Video Added')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const renderPersonalInfoInput = () => {
    return WorksiteForms.fields('addWorksite')?.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          // ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={(text, isValid) => handleChange(fields.key, text)}
        />
      )
    })
  }

  const renderEmployeeContactInput = () => {
    return WorksiteForms.fields('worksiteContact')?.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          // ref={o => (this[fields.key] = o)}
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
          onPress={_uploadImage}
          style={[styles.footerWhiteButton]}
          isWhiteBg
          icon={'upload'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          color={Colors.BUTTON_BG}
          title={Strings.uploadWorksiteLogo}
        />
        <Button
        onPress={_uploadVideo}
          style={[styles.footerWhiteButton]}
          isWhiteBg
          icon={'upload'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          color={Colors.BUTTON_BG}
          title={Strings.uploadVideo}
        />
        <Button
          
          style={[styles.footerWhiteButton]}
          isWhiteBg
          icon={'add'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          color={Colors.BUTTON_BG}
          title={Strings.createTask}
        />
        <Button
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
        />
        <Button
          onPress={handleSubmit}
          disabled={
            !name ||
            !location ||
            !description ||
            !notes ||
            !monthly_rates ||
            !clear_frequency_by_day ||
            !desired_time ||
            !number_of_workers_needed ||
            !supplies_needed ||
            !contact_person_name ||
            !contact_phone_number ||
            !logo
          }
          loading={loading}
          style={styles.footerButton}
          title={Strings.save}
        />
      </View>
    )
  }

  const renderShowDetails = () => {
    return (
      <View style={styles.termsContainer}>
        <TouchableOpacity
        // onPress={() =>
        //   this.setState({ termsConditions: !this.state.termsConditions })
        // }
        >
          <Image {...Images.checkbox} />
        </TouchableOpacity>
        <Text style={styles.textStyle}>{'Show details'}</Text>
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
          {/* <TouchableOpacity style={styles.imageView} onPress={_uploadImage}>
            {profile_image ? (
              <Image
                source={{ uri: profile_image }}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
            ) : (
              <>
                <Image {...Images.camera} />
                <Text style={styles.uploadText}>{Strings.uploadPhoto}</Text>
              </>
            )}
          </TouchableOpacity> */}
          <Text style={styles.title}>{'Worksite Information'}</Text>
          {renderPersonalInfoInput()}
          <Text style={styles.title}>{Strings.contactInfo}</Text>
          {renderEmployeeContactInput()}
          {renderShowDetails()}
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
          title={Strings.addWorksite}
          leftButton
          onLeftPress={() => navigation.goBack()}
        />
        {renderContent()}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  },
  termsContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 20
  },
  textStyle: {
    ...Fonts.poppinsRegular(12),
    marginLeft: 8,
    color: Colors.BLACK
  },
  uploadText: {
    ...Fonts.poppinsRegular(10),
    alignSelf: 'center',
    color: Colors.GREEN_COLOR,
    marginTop: 5
  },
  imageView: {
    width: 102,
    height: 102,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: Colors.DARK_GREY,
    borderRadius: 10,
    alignSelf: 'center'
  }
})
