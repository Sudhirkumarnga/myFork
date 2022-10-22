import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { BaseScene, Button } from '../Common'
import { Fonts, Colors } from '../../res'
import AppContext from '../../Utils/Context'

export default class ActiveEmpView extends BaseScene {
  static contextType = AppContext
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
  }

  handleChange = (key, value) => {
    this.setState(pre => ({ ...pre, [key]: value }))
  }

  renderEmployeeCell (item) {
    return (
      <View style={{ padding: 20 }}>
        <Image />
        <View>
          <Text style={styles.employeeName}>{item?.name}</Text>
          <Text style={styles.employeeWorksite}>{item?.worksite?.name}</Text>
        </View>
      </View>
    )
  }

  renderUpperView () {
    const { isActive } = this.state
    return (
      <TouchableOpacity
        onPress={() => this.handleChange('isActive', !isActive)}
        style={styles.upperView}
      >
        <Text style={styles.title}>{this.ls('activeEmployees')}</Text>
        <Image
          {...this.images('arrowDown')}
          style={[
            this.images('arrowDown').style,
            {
              tintColor: 'black',
              transform: [{ rotate: isActive ? '180deg' : '0deg' }]
            }
          ]}
        />
      </TouchableOpacity>
    )
  }

  renderBottomView (upcomingShiftData) {
    return (
      <View style={styles.bottomView}>
        <Text style={styles.title}>
          {this.ls('payPeriod')} {upcomingShiftData?.total_hours}h
        </Text>
      </View>
    )
  }

  render () {
    const { isActive } = this.state
    const { upcomingShiftData } = this.context
    return (
      <>
        <View style={styles.container}>
          {this.renderUpperView()}
          {isActive && (
            <FlatList
              scrollEnabled={false}
              data={upcomingShiftData?.active_employees}
              renderItem={({ item }) => this.renderEmployeeCell(item)}
            />
          )}
        </View>
        {this.renderBottomView(upcomingShiftData)}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 0.5,
    borderColor: '#bfefec'
  },
  upperView: {
    backgroundColor: '#dedede',
    borderRadius: 10,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  bottomView: {
    backgroundColor: '#dedede',
    borderRadius: 10,
    marginBottom: 40,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR
  },
  footerButton: {
    marginTop: '15%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 10
  },
  image: {
    tintColor: Colors.BUTTON_BG,
    width: 30,
    height: 30
  },
  employeeName: {
    ...Fonts.poppinsRegular(14)
  },
  employeeWorksite: {
    ...Fonts.poppinsRegular(12),
    color: Colors.HOME_DES
  }
})
