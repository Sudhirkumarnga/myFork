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

export default class LoginScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false
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

  onSubmit () {
    if (this.isFormValid()) {
      let params = {}
      this.forms.forEach(i => {
        if (this[i.key].isValid()) {
          params[i.key] = this[i.key].text()
        }
      })
      console.log(params)
    }
  }

  renderTextInput () {
    return this.forms.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={this.isFormValid}
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
        style={styles.footerButton}
        onPress={this.props.onPress}
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
