import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Button,
  DateSelectionView
} from '../Common'
import { Fonts, Colors } from '../../res'
import MessageCell from './MessageCell'
export default class MessagesScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      env: ''
    }
  }

  renderNewMessage () {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingHorizontal: 20,
          padding: 10
        }}
        onPress={() => this.props.navigation.navigate('newMessage')}
      >
        <Text style={styles.cancelText}>{this.ls('newMessage')}</Text>
      </TouchableOpacity>
    )
  }

  renderDatesInput () {
    return <DateSelectionView />
  }

  renderSearchInput () {
    return (
      <PrimaryTextInput
        ref={o => (this['search'] = o)}
        label={this.ls('searchConversation')}
        onChangeText={() => {}}
        rightIcon={{ ...this.images('search') }}
      />
    )
  }

  renderButton () {
    return (
      <Button
        title={this.ls('sendReq')}
        style={styles.footerButton}
        onPress={this.props.onPress}
      />
    )
  }

  renderContent () {
    return (
      <View style={styles.childContainer}>
        {this.renderSearchInput()}
        {this.renderNewMessage()}
        <MessageCell
          onPress={() => this.props.navigation.navigate('MessageChat')}
        />
        <MessageCell
          onPress={() => this.props.navigation.navigate('MessageChat')}
        />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          leftIcon={{ ...this.images('bar') }}
          leftButton
          title={this.ls('messagesTitle')}
          onLeftPress={() =>
            this.props.navigation.toggleDrawer({
              side: 'left',
              animated: true
            })
          }
          rightIcon={{ ...this.images('bell') }}
        />
        {this.renderContent()}
      </View>
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
    marginTop: 20
  },
  childContainer: {
    flex: 1,
    paddingVertical: 15
  },
  footerButton: {
    width: '90%',
    marginTop: '15%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 24
  },
  cancelText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    fontWeight: '500'
  }
})
