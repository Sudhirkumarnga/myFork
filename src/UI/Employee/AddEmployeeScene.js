import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native'
import { Header, PrimaryTextInput, Forms, Button } from '../Common'
import { Fonts, Colors, Images } from '../../res'
import Strings from '../../res/Strings'
import ImagePicker from 'react-native-image-crop-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createEmployee } from '../../api/business'
import moment from 'moment'

export default function AddEmployeeScene ({ navigation }) {
  // State
  const [state, setState] = useState({
    name: '',
    pay_frequency: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    address_line_one: '',
    address_line_two: '',
    city: '',
    country: '',
    zipcode: '',
    profile_image: '',
    photo: null,
    loading: false
  })

  const {
    loading,
    first_name,
    last_name,
    phone,
    mobile,
    date_of_birth,
    address_line_one,
    address_line_two,
    city,
    profile_image,
    photo,
    price,
    gender,
    email,
    position
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
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
          handleChange('photo', response.data)
          handleChange('uploading', false)
          Toast.show('Profile Add Successfully')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const handleSubmit = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const formData = {
        personal_information: {
          profile_image: photo,
          first_name,
          last_name,
          date_of_birth: moment(date_of_birth).format('YYYY-MM-DD'),
          gender
        },
        contact: {
          email,
          mobile,
          phone
        },
        address_information: {
          address_line_one,
          address_line_two,
          city: 1
        },
        work_information: {
          position,
          hourly_rate: Number(price)
        }
      }
      console.warn('token', token)
      console.warn('formData', formData)
      const res = await createEmployee(formData, token)
      console.warn('createAdminProfile', res?.data)
      handleChange('loading', false)
      navigation.navigate('home')
      Toast.show(`Employee has been added!`)
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

  const renderPersonalInfoInput = () => {
    return Forms.fields('employeePersonalInfo')?.map(fields => {
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

  const renderWorkInfo = () => {
    return Forms?.fields('employeeWorkInfo')?.map(fields => {
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
    return Forms?.fields('employeeContact')?.map(fields => {
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

  const renderAddressInfo = () => {
    return Forms?.fields('employeeAddress')?.map(fields => {
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

  const renderFooterButton = () => {
    return (
      <Button
        title={Strings.submit}
        style={styles.footerButton}
        loading={loading}
        onPress={handleSubmit}
      />
    )
  }

  const renderContent = () => {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.childContainer}>
          <TouchableOpacity style={styles.imageView} onPress={_uploadImage}>
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
          </TouchableOpacity>
          <Text style={styles.title}>{Strings.personalInfo}</Text>
          {renderPersonalInfoInput()}
          <Text style={styles.title}>{Strings.contact}</Text>
          {renderEmployeeContactInput()}
          <Text style={styles.title}>{Strings.addressInfo}</Text>
          {renderAddressInfo()}
          <Text style={styles.title}>{Strings.workInfo}</Text>
          {renderWorkInfo()}
          {renderFooterButton()}
        </View>
      </ScrollView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <View style={styles.container}>
        <Header
          leftButton
          onLeftPress={() => navigation.goBack()}
          title={Strings.addEmployee}
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
    marginVertical: '5%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 24
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
