import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Toast from 'react-native-simple-toast'
import { getAllEmployee } from '../../api/business'
import { Fonts, Colors } from '../../res'
import Sample from '../../res/Images/common/sample.png'
import Button from '../Common/Button'
import { Switch } from 'react-native-switch'
import AppContext from '../../Utils/Context'
import moment from 'moment-timezone'

export default function EmployeeListScene ({ navigation }) {
  const { earnings, _getEarnings } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    allEmployee: []
  })
  const { loading, allEmployee, isDisplay } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getEarnings()
    }, [])
  )

  console.warn('earnings', earnings)

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 20
        }}
      >
        <View>
          <Text style={styles.title1}>Payroll hours: 220h</Text>
          <Text style={styles.dateText}>{moment().format("DD MMMM, YYYY")}</Text>
        </View>
        <Button
          backgroundColor={Colors.BUTTON_BG1}
          icon={'filter'}
          iconStyle={{ height: 18, width: 18 }}
          style={{ height: 40, width: 100, marginTop: 0 }}
          title={'Filter'}
        />
      </View>
      <View
        style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}
      >
        <Text style={styles.displayText}>Display earnings</Text>
        <Switch
          value={isDisplay}
          onValueChange={val => handleChange('isDisplay', val)}
          disabled={false}
          activeText={'On'}
          inActiveText={'Off'}
          circleSize={20}
          barHeight={20}
          circleBorderWidth={0}
          backgroundActive={'#14C771'}
          backgroundInactive={'#CCCCCC'}
          circleActiveColor={'#fff'}
          circleInActiveColor={'#fff'}
          changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
          innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }} // style for inner animated circle for what you (may) be rendering inside the circle
          outerCircleStyle={{ padding: 3 }} // style for outer animated circle
          renderActiveText={false}
          containerStyle={{ marginLeft: 10 }}
          renderInActiveText={false}
          switchLeftPx={2.1} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
          switchRightPx={2.1} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
          switchWidthMultiplier={2.2} // multiplied by the `circleSize` prop to calculate total width of the Switch
          switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
        />
      </View>
      <Text style={styles.hourly}>Hours Earnings</Text>
      {loading && (
        <View style={{ marginBottom: 10, width: '100%', alignItems: 'center' }}>
          <ActivityIndicator color={Colors.BACKGROUND_BG} size={'small'} />
        </View>
      )}
      <FlatList
        scrollEnabled={false}
        style={{ width: '100%' }}
        data={earnings}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('employeesView', { item })}
            style={styles.listContainer}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={
                  item?.profile_image ? { uri: item?.profile_image } : Sample
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  marginRight: 10
                }}
              />
              <View>
                <Text style={styles.title}>{item?.name}</Text>
                <Text style={styles.job}>{item?.position}</Text>
                <Text
                  style={styles.location}
                >{`Hourly rate: $${item?.hourly_rate}/hr`}</Text>
              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Text style={[styles.title, { marginRight: 20 }]}>
                  {item?.total_hours + 'h'}
                </Text>
                <Text style={styles.title}>
                  {!isDisplay ? 'N/A' : '$' + item?.earning}
                </Text>
              </View>
              <Text style={styles.message}>View Details</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.WHITE
  },
  listContainer: {
    backgroundColor: Colors.TEXT_INPUT_BG,
    width: '100%',
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  },
  title1: {
    ...Fonts.poppinsRegular(16),
    color: Colors.TEXT_COLOR
  },
  location: {
    ...Fonts.poppinsRegular(12),
    color: Colors.TEXT_COLOR
  },
  job: {
    ...Fonts.poppinsRegular(12),
    color: Colors.BLUR_TEXT
  },
  hourly: {
    ...Fonts.poppinsRegular(13),
    textTransform: 'uppercase',
    textAlign: 'right',
    width: '100%',
    marginBottom: 10,
    color: Colors.BLUR_TEXT
  },
  dateText: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
  },
  displayText: {
    ...Fonts.poppinsRegular(13),
    color: Colors.TEXT_COLOR
  },
  message: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
  },
  childContainer: {
    flex: 1,
    padding: 20
  },
  footerButton: {
    marginTop: '15%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 24
  }
})