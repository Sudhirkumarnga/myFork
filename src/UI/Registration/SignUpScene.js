import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BaseScene, Button, Forms, PrimaryTextInput } from '../Common'
import { Fonts, Colors } from '../../res'
import { AsyncHelper } from '../../Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class LoginScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false,
      env: '',
      forms: Forms.fields('signUp')
    }
    this.isFormValid = this.isFormValid.bind(this)
  }

  async componentDidMount () {
    const env = await AsyncHelper.getEnv()
    this.setState({
      env,
      forms:
        env == 'employee' ? Forms.fields('signUpEmp') : Forms.fields('signUp')
    })
  }

  isFormValid () {
    let error = null
    this.state.forms.map(i => {
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

  onSubmit = () => {
    const { first_name, last_name, email, password, mobile } = this.state
    const payload = {
      name: first_name + ' ' + last_name,
      email,
      password,
      phone: mobile
    }
    console.log(payload)
    this.props.navigation.navigate('signupComplete', { values: payload })
  }

  handleChange = (key, value, isValid) => {
    this.setState(pre => ({ ...pre, [key]: value, isFormValid: isValid }))
  }

  renderTextInput () {
    return this.state.forms.map(fields => {
      return (
        <PrimaryTextInput
          {...fields}
          ref={o => (this[fields.key] = o)}
          key={fields.key}
          onChangeText={(text, isValid) =>
            this.handleChange(fields.key, text, isValid)
          }
        />
      )
    })
  }

  renderFooterButton () {
    return (
      <Button
        onPress={this.onSubmit}
        title={this.ls('next')}
        disabled={
          !this.state.isFormValid ||
          !this.state.first_name ||
          !this.state.last_name ||
          !this.state.email ||
          !this.state.password ||
          !this.state.mobile
        }
        style={styles.footerButton}
      />
    )
  }

  render () {
    console.warn('this.state', this.state)
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{
          //   height: Dimensions.get("window").height
          // }}
        >
          <Text style={styles.title}>{this.ls('signUp')}</Text>
          {/* <View style={{ height: "5%" }} /> */}
          {this.renderTextInput()}
          {/* {this.renderTermsView()} */}
          {this.renderFooterButton()}
        </KeyboardAwareScrollView>
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
  footerButton: {
    marginBottom: 20
  },
  forgotPwdText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    marginRight: 20
  },
  termsContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
    padding: 20
  },
  textStyle: {
    ...Fonts.poppinsRegular(12),
    marginLeft: 8,
    color: Colors.BLACK
  },
  linkStyle: {
    ...Fonts.poppinsRegular(12),
    color: Colors.BUTTON_BG
  }
})
