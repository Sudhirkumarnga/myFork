import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BaseScene } from '../Common'
import { Colors } from '../../res'
import { SvgXml } from 'react-native-svg'

export default class SplashScene extends BaseScene {
  componentDidMount () {
    setTimeout(() => {
      this.props.navigation.navigate('AuthLoading')
    }, 3000)
  }
  render () {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND_BG }}>
        <View style={styles.container}>
          <SvgXml xml={this.images('splash').source} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
