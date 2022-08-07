import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { BaseScene, Header, Button, Fab } from '../Common'
import { Colors, Fonts } from '../../res'

export default class AllWorksiteScene extends BaseScene {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: 'false'
    }
  }

  renderButton () {
    return <Button style={styles.footerButton} title={this.ls('subscribe')} />
  }

  renderContent () {
    return (
      <ScrollView style={styles.childContainer}>
        <Text style={styles.title}>{this.ls('listWorksites')}</Text>
        {[1, 2, 3, 1, 2, 3, 1, 2, 3].map(item => (
          <View style={styles.cellContainer}>
            <View>
              <Text style={styles.cellTitle}>Worksite no 1</Text>
              <Text style={styles.description}>Worksite location:</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('worksiteDetail')}
              style={{ justifyContent: 'flex-end' }}
            >
              <Text
                style={[
                  styles.cellTitle,
                  { color: Colors.BLUR_TEXT, ...Fonts.poppinsRegular(13) }
                ]}
              >
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <Header
          title={this.ls('worksites')}
          onLeftPress={() => this.props.navigation.goBack()}
          leftButton
        />
        {this.renderContent()}
        <Fab onPress={() => this.props.navigation.navigate('addWorksite')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.WHITE
  },
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR,
    marginVertical: 20,
    marginLeft: '5%'
  },
  childContainer: {
    width: '100%'
  },
  footerButton: {
    marginTop: '10%',
    width: '100%'
  },
  description: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT,
    textAlign: 'left',
    lineHeight: 24
  },
  cellContainer: {
    height: 70,
    borderBottomWidth: 0.8,
    margin: 10,
    borderColor: Colors.TEXT_INPUT_BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  cellTitle: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  }
})
