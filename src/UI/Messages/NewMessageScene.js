import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native'
import { BaseScene, Header, PrimaryTextInput } from '../Common'
import { Fonts, Colors } from '../../res'
import userProfile from '../../res/Images/common/sample.png'
import groupIcon from '../../res/Svgs/group.svg'
import { SvgXml } from 'react-native-svg'

const screenWidth = Dimensions.get('window').width

export default class NewMessageScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    console.log(this.state.selectedIndex)
    this.animatedLeftMargin = new Animated.Value(0)
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

  renderContent () {
    return (
      <View style={styles.childContainerStyle}>
        {this.renderSearchInput()}
        <View style={{ width: '90%', marginTop: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: Colors.TEXT_INPUT_BG,
              paddingBottom: 10
            }}
            onPress={() => this.props.navigation.navigate('GroupMessageScene')}
          >
            <SvgXml xml={groupIcon} />
            <Text
              style={{
                color: Colors.BACKGROUND_BG,
                ...Fonts.poppinsRegular(12),
                marginLeft: 10
              }}
            >
              Group message
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{ ...Fonts.poppinsRegular(18), width: '90%', marginTop: 10 }}
        >
          Suggested
        </Text>
        <FlatList
          data={[0, 0, 0]}
          style={{ width: '90%', marginTop: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderBottomColor: Colors.TEXT_INPUT_BG
              }}
            >
              <Image
                source={userProfile}
                style={{ width: 50, height: 50, marginRight: 20 }}
              />
              <Text style={{ ...Fonts.poppinsRegular(12) }}>John Doe</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          title={this.ls('newMessage')}
          leftButton
          onLeftPress={() => this.props.navigation.goBack()}
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
    ...Fonts.poppinsRegular(18),
    color: 'white',
    textAlign: 'center',
    marginVertical: 10
  },
  sliderContainer: {
    flexDirection: 'row',
    width: screenWidth,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.BUTTON_BG
  },
  touchable: {
    borderBottomColor: Colors.WHITE,
    borderBottomWidth: 2,
    paddingHorizontal: 30
  },
  childContainerStyle: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  animatedViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth * 2,
    flex: 1,
    marginTop: 2,
    marginLeft: 0
  }
})
