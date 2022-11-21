import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { BaseScene, Button, PrimaryTextInput, Forms } from '../Common'
import { Fonts, Colors } from '../../res'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../Utils/Context'
import { loginUser } from '../../api/auth'
import AsyncHelper from '../../Utils/AsyncHelper'

export default class LoginScene extends BaseScene {
  static contextType = AppContext
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false,
      loading: false,
      isPassInValid: false,
      email: '',
      password: ''
    }
    this.setForms()
    this.isFormValid = this.isFormValid.bind(this)
  }

  setForms (field) {
    this.forms = Forms.fields('login')
  }

  isFormValid () {
    let error = null
    this.forms.map(i => {
      if (!this[i.key].isValid()) {
        error = i.key
        return true
      }
      return false
    })
    if (error) {
      this.setState({ isFormValid: false })
      return false
    }
    this.setState({ isFormValid: true })
    return true
  }

  checkPass = value => {
    // const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    // if (regex.test(value)) {
    //   this.handleChange('isPassInValid', false)
    // } else {
    //   this.handleChange('isPassInValid', true)
    // }
  }

  handleChange = (key, value, isValid) => {
    if (key === 'password') {
      this.checkPass(value)
    }
    this.setState(pre => ({ ...pre, [key]: value, isFormValid: isValid }))
  }

  handleLogin = async () => {
    try {
      const env = await AsyncHelper.getEnv()
      const { setUser } = this.context
      this.handleChange('loading', true, true)
      const payload = {
        email: this.state.email,
        password: this.state.password
      }
      const res = await loginUser(payload)
      this.handleChange('loading', false, true)
      console.warn('signupUser', res?.data)
      if (env === 'admin' && res?.data?.user?.role !== 'Organization Admin') {
        alert('Please use business user')
        return
      }
      if (env === 'employee' && res?.data?.user?.role === 'Organization Admin') {
        alert('Please use employee user')
        return
      }
      await AsyncStorage.setItem('token', res?.data?.key)
      if (res?.data?.user) {
        setUser(res?.data?.user)
        await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user))
      }
      this.props.navigation.navigate('AuthLoading')
      Toast.show('Logged In up Successfully!')
    } catch (error) {
      console.warn('error', error)
      this.handleChange('loading', false, true)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  renderTextInput () {
    return this.forms.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          isPassInValid={this.state.isPassInValid}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={(text, isValid) =>
            this.handleChange(fields.key, text, isValid)
          }
        />
      )
    })
  }

  renderForgotPwd () {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          alignSelf: 'flex-end'
        }}
        onPress={this.props.onForgotPwd}
      >
        <Text style={styles.forgotPwdText}>{this.ls('forgotPwd')}</Text>
      </TouchableOpacity>
    )
  }

  renderFooterButton () {
    return (
      <Button
        title={this.ls('login')}
        disabled={
          !this.state.email || !this.state.password || this.state.isPassInValid
        }
        loading={this.state.loading}
        style={styles.footerButton}
        onPress={this.handleLogin}
      />
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.title}>{this.ls('welcomeBack')}</Text>
          <Text style={styles.description}>{this.ls('loginAccount')}</Text>
          {this.renderTextInput()}
          {this.state.isPassInValid && (
            <Text
              style={{
                color: Colors.INVALID_TEXT_INPUT,
                ...Fonts.poppinsRegular(12),
                width: '90%',
                marginLeft: '5%'
              }}
            >
              Password must be atleast 8 characters which contain at least one
              lowercase letter, one uppercase letter, and one numeric digit
            </Text>
          )}
          {this.renderForgotPwd()}
          {this.renderFooterButton()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  title: {
    ...Fonts.poppinsRegular(28),
    color: Colors.BLACK,
    textAlign: 'center',
    marginTop: '20%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    textAlign: 'center',
    color: Colors.BLUR_TEXT,
    marginVertical: 10
  },
  footerButton: {
    marginTop: '15%'
  },
  forgotPwdText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    marginRight: 20
  }
})
