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
import { createEmployee, updateEmployee } from '../../api/business'
import moment from 'moment'
import AppContext from '../../Utils/Context'
import { useContext } from 'react'
import { useEffect } from 'react'

export default function AddEmployeeScene ({ navigation, route }) {
  const item = route?.params?.item
  const {
    _getProfile,
    _getCountries,
    cities,
    states,
    adminProfile
  } = useContext(AppContext)
  // State
  const [state, setState] = useState({
    name: '',
    pay_frequency: '',
    first_name: item?.personal_information?.first_name || '',
    last_name: item?.personal_information?.last_name || '',
    phone: item?.contact?.phone || '',
    mobile: item?.contact?.mobile || '',
    email: item?.contact?.email || '',
    date_of_birth: item?.personal_information?.date_of_birth || '',
    address_line_one: item?.address_information?.address_line_one || '',
    address_line_two: item?.address_information?.address_line_two || '',
    city: item?.address_information?.city || '',
    country: '',
    zipcode: '',
    photo: item?.personal_information?.profile_image || '',
    profile_image: item?.personal_information?.profile_image || '',
    position: item?.work_information?.position || '',
    price: item?.work_information?.hourly_rate?.toString() || '',
    gender: item?.personal_information?.gender || '',
    loading: false
  })

  useEffect(() => {
    // _getCountries()
  }, [])

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
          city: getCityTValue(city)
        },
        work_information: {
          position,
          hourly_rate: Number(price)
        }
      }
      if (item) {
        await updateEmployee(item?.id, formData, token)
      } else {
        await createEmployee(formData, token)
      }
      handleChange('loading', false)
      navigation.navigate('home')
      Toast.show(`Employee has been added!`)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error?.response?.data)
      const showWError =
        error.response?.data?.error &&
        Object.values(error.response?.data?.error)
      if (error?.response?.data?.subscription) {
        Toast.show(`Error: ${error?.response?.data?.subscription}`)
      } else if (showWError.length > 0) {
        Toast.show(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        Toast.show(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  const getCityTValue = value => {
    const filtered = cities?.filter(e => e.name === value)
    return filtered.length > 0 ? filtered[0].id : ''
  }

  const renderPersonalInfoInput = () => {
    return Forms.fields('employeePersonalInfo')?.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          text={state[fields.key]}
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
          text={state[fields.key]}
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
          text={state[fields.key]}
          // ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={(text, isValid) => handleChange(fields.key, text)}
        />
      )
    })
  }

  const getDropdownItem = list => {
    const newList = []
    list?.forEach(element => {
      newList.push({ label: element?.name, value: element?.name })
    })
    return newList
  }

  const getStateText = (list, value) => {
    const filtered = list?.filter(e => e?.name === value || e?.id === value)
    return filtered?.length > 0 ? filtered[0]?.name : ''
  }

  console.warn('city', city)
  const renderAddressInfo = () => {
    return Forms?.fields('employeeAddress')?.map(fields => {
      if (fields.key === 'city') {
        return (
          <PrimaryTextInput
            text={getStateText(cities, city)}
            dropdown={true}
            items={getDropdownItem(cities)}
            label={'City'}
            key='city'
            // placeholder='City'
            onChangeText={(text, isValid) => handleChange('city', text)}
          />
        )
      } else {
        return (
          <PrimaryTextInput
            {...fields}
            text={state[fields.key]}
            // ref={o => (this[fields.key] = o)}
            key={fields.key}
            onChangeText={(text, isValid) => handleChange(fields.key, text)}
          />
        )
      }
    })
  }

  const renderFooterButton = () => {
    return (
      <Button
        title={item ? Strings.update : Strings.submit}
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
          <Text style={styles.title}>{"Address"}</Text>
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
          title={item ? Strings.updateEmployee : Strings.addEmployee}
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
