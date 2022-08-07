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
import { Fonts } from '../../res'
import Colors from '../../res/Theme/Colors'
import userProfile from '../../res/Images/common/sample.png'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import groupIcon from '../../res/Svgs/group.svg'
import { SvgXml } from 'react-native-svg'

const screenWidth = Dimensions.get('window').width

export default class GroupMessageScene extends BaseScene {
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
      <>
        <PrimaryTextInput
          ref={o => (this['search'] = o)}
          label={'Search for people'}
          onChangeText={() => {}}
          rightIcon={{ ...this.images('search') }}
        />
        <PrimaryTextInput
          ref={o => (this['search'] = o)}
          label={'Group name'}
          onChangeText={() => {}}
        />
      </>
    )
  }

  renderContent () {
    return (
      <View style={styles.childContainerStyle}>
        {this.renderSearchInput()}
        <View style={{ width: '90%', marginTop: 10 }}></View>
        <Text
          style={{ ...Fonts.poppinsRegular(18), width: '90%', marginTop: 10 }}
        >
          Suggested
        </Text>
        <FlatList
          data={[0, 0, 0]}
          style={{ width: '90%', marginTop: 20 }}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderBottomColor: Colors.TEXT_INPUT_BG
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={userProfile}
                  style={{ width: 50, height: 50, marginRight: 20 }}
                />
                <Text style={{ ...Fonts.poppinsRegular(12) }}>John Doe</Text>
              </View>
              <BouncyCheckbox
                size={25}
                fillColor={Colors.BACKGROUND_BG}
                unfillColor={Colors.WHITE}
                // disableBuiltInState
                iconStyle={{
                  borderColor: Colors.BLACK,
                  borderRadius: 1
                }}
                // iconInnerStyle={{ borderRadius: 0 }}
                // style={{ marginVertical: 20 }}
                // onPress={() => handleChange('isChecked', !isChecked)}
              />
            </View>
          )}
        />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          title={'Group message'}
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
