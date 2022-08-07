import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native'
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Forms,
  WorksiteForms,
  Button
} from '../Common'
import { Fonts, Colors } from '../../res'
const { height, width } = Dimensions.get('window')

export default class AddWorksiteScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isFormValid: false
    }
    this.setForms()
    // this.isFormValid = this.isFormValid.bind(this)
  }

  setForms (field) {
    this.personalforms = WorksiteForms.fields('addWorksite')
    this.employeeContact = Forms.fields('employeeContact')
    this.address = Forms.fields('employeeAddress')
    this.employeeWorkInfo = Forms.fields('employeeWorkInfo')
  }

  renderPersonalInfoInput () {
    return this.personalforms.map(fields => {
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

  renderEmployeeContactInput () {
    return this.employeeContact.map(fields => {
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

  renderFooterButtons () {
    return (
      <View style={{ padding: 20 }}>
        <Button
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
          title={this.ls('uploadWorksiteLogo')}
        />
        <Button
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
          title={this.ls('uploadVideo')}
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
          title={this.ls('createTask')}
        />
        <Button
          style={[styles.footerWhiteButton]}
          title={this.ls('edit')}
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
        <Button style={styles.footerButton} title={this.ls('save')} />
      </View>
    )
  }

  renderShowDetails () {
    return (
      <View style={styles.termsContainer}>
        <TouchableOpacity
          onPress={() =>
            this.setState({ termsConditions: !this.state.termsConditions })
          }
        >
          <Image {...this.images('checkbox')} />
        </TouchableOpacity>
        <Text style={styles.textStyle}>{'Show details'}</Text>
      </View>
    )
  }

  renderContent () {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.childContainer}>
          <Text style={styles.title}>{this.ls('personalInfo')}</Text>
          {this.renderPersonalInfoInput()}
          <Text style={styles.title}>{this.ls('contactInfo')}</Text>
          {this.renderEmployeeContactInput()}
          {this.renderShowDetails()}
          {this.renderFooterButtons()}
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
            title={this.ls('addWorksite')}
            leftButton
            onLeftPress={() => this.props.navigation.goBack()}
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
  }
})
