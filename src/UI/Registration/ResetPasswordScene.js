import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { BaseScene, PrimaryTextInput, Button, Forms, Header } from '../Common'
import { Fonts, Colors } from '../../res'

const screenWidth = Dimensions.get('window').width

export default class ResetPasswordScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
  }

  setForms (field) {
    this.forms = Forms.fields('login')
  }

  renderTextInput () {
    return (
      <View>
        <PrimaryTextInput
          onChangeText={text => this.isFormValid(text, 'password')}
          ref={o => (this.password = o)}
          label='Create New Password'
          style={{ width: screenWidth }}
        />
        <PrimaryTextInput
          onChangeText={text => this.isFormValid(text, 'confirmPassword')}
          ref={o => (this.confirmPassword = o)}
          label='Confirm New Password'
          correctPassword={this.state.passwordValidation}
          style={{ width: screenWidth }}
        />
      </View>
    )
  }

  renderFooterButton () {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('registration')}
        title={this.ls('submit')}
        style={styles.footerButton}
      />
    )
  }

  renderCancelButton () {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20
        }}
        onPress={() => this.props.navigation.goBack()}
      >
        <Text style={styles.cancelText}>{this.ls('cancel')}</Text>
      </TouchableOpacity>
    )
  }

  renderContent () {
    return (
      <View style={styles.childContainer}>
        <Text style={styles.title}>{this.ls('passwordReset')}</Text>
        <View style={{ height: '10%' }} />
        {this.renderTextInput()}
        {this.renderFooterButton()}
        {this.renderCancelButton()}
      </View>
    )
  }

  render () {
    return (
      <ImageBackground
        source={this.images('splashBg').source}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Image
            source={this.images('appLogo').source}
            style={{ height: 30, alignSelf: 'center' }}
            resizeMode='contain'
          />
          {this.renderContent()}
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60
  },
  title: {
    ...Fonts.poppinsRegular(26),
    color: Colors.BLACK,
    textAlign: 'center',
    marginTop: 30
  },
  childContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: '20%'
  },
  footerButton: {
    marginTop: '15%'
  },
  cancelText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG
  }
})
