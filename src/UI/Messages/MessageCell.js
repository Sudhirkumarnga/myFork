import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Fonts } from '../../res'
import userProfile from '../../res/Images/common/sample.png'
import { BaseComponent } from '../Common'

class MessageCell extends BaseComponent {
  renderTime () {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 10,
          top: 8
        }}
      >
        <Text style={styles.yearText}>9:15 PM</Text>
      </View>
    )
  }

  renderMessage () {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        <Text style={styles.yearText}>
          Lorem ipsum dolor sit amet, enter consectetur adipiscing elit...
        </Text>
      </View>
    )
  }

  renderTitle () {
    return <Text style={styles.title}>{'John Doe'}</Text>
  }

  render () {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <Image
          source={userProfile}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            resizeMode: 'cover'
          }}
        />
        <View style={{ alignItems: 'flex-start', flex: 0.8 }}>
          {this.renderTitle()}
          {this.renderMessage()}
        </View>
        {this.renderTime()}
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderBottomWidth: 1.5,
    borderColor: Colors.DARK_GREY,
    flexDirection: 'row',
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around'
  },
  title: {
    ...Fonts.poppinsRegular(16),
    color: Colors.BLACK
  },
  depedentContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    flex: 0.5
  },
  amount: {
    ...Fonts.poppinsMedium(26),
    color: Colors.TEXT_COLOR
  },
  yearText: {
    ...Fonts.poppinsRegular(12),
    color: Colors.LIGHT_TEXT_COLOR,
    marginTop: 5
  }
})

export default MessageCell
