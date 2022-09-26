import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native'
import { Header, PrimaryTextInput, Forms, Button } from '../Common'
import { Fonts, Colors, Images } from '../../res'
import ImagePicker from 'react-native-image-crop-picker'
import Strings from '../../res/Strings'
import Toast from 'react-native-simple-toast'
import { createAdminProfile } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

export default function BusinessProfileScene ({ navigation }) {
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
    name,
    pay_frequency,
    first_name,
    last_name,
    phone,
    date_of_birth,
    address_line_one,
    address_line_two,
    city,
    country,
    zipcode,
    profile_image,
    photo
  } = state
  console.warn('state', state)

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
          console.warn('response', response)
          const uri = response.path
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          const photo = {
            uri: uploadUri,
            name: 'userimage1.png',
            type: response.mime
          }
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

  const handleProfile = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const formData = {
        business_information: {
          name,
          pay_frequency,
          profile_image: photo
        },
        personal_information: {
          first_name,
          last_name,
          phone,
          date_of_birth: moment(date_of_birth).format('YYYY-MM-DD')
          // gender: 'MALE'
        },
        business_address: {
          address_line_one,
          address_line_two,
          city: 1,
          state: 1,
          zipcode
        }
      }
      const res = await createAdminProfile(formData, token)
      console.warn('createAdminProfile', res?.data)
      handleChange('loading', false)
      navigation.navigate('home')
      Toast.show(`Your profile has been updated!`)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error.response)
      const showWError = Object.values(error.response?.data?.error)
      Toast.show(`Error: ${showWError[0]}`)
    }
  }

  const renderTextInput = () => {
    return Forms.fields('businessInfo').map((fields, index) => {
      if (index === 2) {
        return (
          <>
            <Text style={styles.title}>{Strings.personalInfo}</Text>
            <PrimaryTextInput
              {...fields}
              key={fields.key}
              onChangeText={(text, isValid) => handleChange(fields.key, text)}
            />
          </>
        )
      } else {
        return (
          <PrimaryTextInput
            {...fields}
            key={fields.key}
            onChangeText={(text, isValid) => handleChange(fields.key, text)}
          />
        )
      }
    })
  }

  const renderEmergencyTextInput = () => {
    return Forms.fields('businessAddress').map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
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
        disabled={
          !name ||
          !pay_frequency ||
          !first_name ||
          !last_name ||
          !phone ||
          !date_of_birth ||
          !address_line_one ||
          !address_line_two ||
          !city ||
          !country ||
          !zipcode ||
          !profile_image
        }
        loading={loading}
        style={styles.footerButton}
        onPress={handleProfile}
      />
    )
  }

  const onSubmit = () => {
    navigation.navigate('home')
  }

  const renderContent = () => {
    return (
      <ScrollView style={{ flex: 1, paddingBottom: 30 }}>
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
          <Text style={styles.title}>{Strings.businessInfo}</Text>
          {renderTextInput()}
          <Text style={styles.title}>{Strings.addressInfo}</Text>
          {renderEmergencyTextInput()}
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
          onLeftPress={() => navigation.goBack()}
          title={'Create Profile'}
          leftButton
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
    ...Fonts.poppinsRegular(22),
    color: Colors.TEXT_COLOR,
    margin: 20
  },
  childContainer: {
    flex: 1
  },
  footerButton: {
    marginTop: '5%',
    marginBottom: 20
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
