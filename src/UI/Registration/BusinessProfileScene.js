import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Forms,
  AvatarView,
  Button
} from '../Common'
import { Fonts, Colors } from '../../res'

export default class BusinessProfileScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
    // this.isFormValid = this.isFormValid.bind(this)
  }

  setForms (field) {
    this.forms = Forms.fields('businessInfo')
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

  renderEmergencyTextInput () {
    return Forms.fields('businessAddress').map(fields => {
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

  renderFooterButton () {
    return (
      <Button
        title={this.ls('submit')}
        style={styles.footerButton}
        onPress={() => this.onSubmit()}
      />
    )
  }

  onSubmit = () => {
    this.props.navigation.navigate('home')
  }

  renderContent () {
    return (
      <ScrollView style={{ flex: 1, paddingBottom: 30 }}>
        <View style={styles.childContainer}>
          <AvatarView />
          <Text style={styles.title}>{this.ls('businessInfo')}</Text>
          {this.renderTextInput()}
          <Text style={styles.title}>{this.ls('addressInfo')}</Text>
          {this.renderEmergencyTextInput()}
          {this.renderFooterButton()}
        </View>
      </ScrollView>
    )
  }

  render () {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.container}>
          <Header
            onLeftPress={() => this.props.navigation.goBack()}
            title={'Create Profile'}
            leftButton
          />
          {this.renderContent()}
        </View>
      </KeyboardAvoidingView>
    )
  }
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
  }
})
