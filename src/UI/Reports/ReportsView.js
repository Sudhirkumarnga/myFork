import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import { Header } from '../Common'
import { Fonts, Images, Colors } from '../../res'
import { Button } from '../Common'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  inspectionReports,
  locationVarianceReports,
  payrollReports,
  scheduleVarianceReports
} from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import Fab from '../Common/Fab'
import PieChart from 'react-native-pie-chart'
import { Modal } from 'react-native'
import PrimaryTextInput from '../Common/PrimaryTextInput'
import moment from 'moment-timezone'

export default function ReportsView ({ navigation, route }) {
  const title = route?.params?.title
  const series = [123, 321, 123]
  const sliceColor = ['#23C263', '#EFF259', '#F84F31']
  const [state, setState] = useState({
    loading: false,
    visible: false,
    reports: [],
    from: '',
    to: ''
  })

  const { loading, visible, reports, from, to } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getReports()
    }, [])
  )

  const _getReportsByFilter = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const payload = `?from=${moment(from).format('YYYY-MM-DD')}&to=${moment(
        to
      ).format('YYYY-MM-DD')}`
      let res
      if (title === 'Schedule Variances') {
        res = await scheduleVarianceReports(payload, token)
      } else if (title === 'Location Variances') {
        res = await locationVarianceReports(payload, token)
      } else if (title === 'Payroll Reports') {
        res = await payrollReports(payload, token)
      } else if (title === 'Inspection') {
        res = await inspectionReports(payload, token)
      }
      if (res?.data) {
        handleChange('reports', res?.data?.results)
      }
      handleChange('loading', false)
      handleChange('visible', false)
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const _getReports = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      let res
      if (title === 'Schedule Variances') {
        res = await scheduleVarianceReports('', token)
      } else if (title === 'Location Variances') {
        res = await locationVarianceReports('', token)
      } else if (title === 'Payroll Reports') {
        res = await payrollReports('', token)
      } else if (title === 'Inspection') {
        res = await inspectionReports('', token)
      }
      if (res?.data) {
        handleChange('reports', res?.data?.results)
      }
      console.warn('res?.data?.response', res?.data)
      handleChange('loading', false)
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const handleClose = () => {
    handleChange('visible', false)
  }

  return (
    <View style={styles.container}>
      <Header
        back
        leftButton
        title={title + ' Reports'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ width: '100%' }}
      >
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            width: '90%',
            justifyContent: 'space-between'
          }}
        >
          <Menu
            style={{
              width: '45%',
              borderWidth: 1,
              borderColor: Colors.TEXT_INPUT_BORDER,
              borderRadius: 10
            }}
          >
            <MenuTrigger
              style={{
                width: '100%',
                height: 35,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={[
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '90%',
                    marginTop: 0
                  }
                ]}
              >
                <Text
                  style={{
                    color: Colors.BUTTON_BG1,
                    ...Fonts.poppinsRegular(12),
                    textTransform: 'capitalize'
                  }}
                >
                  {'Sort by'}
                </Text>
                <Icon
                  name='down'
                  size={12}
                  color={Colors.BUTTON_BG1}
                  style={{ marginLeft: 10 }}
                  type='antdesign'
                />
              </View>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                borderRadius: 10,
                marginTop: 35,
                width: '40%'
              }}
            >
              <MenuOption
                // onSelect={() => handleChange(`mode`, 'month')}
                text='A to Z'
              />
              <MenuOption
                // onSelect={() => handleChange(`mode`, 'month')}
                text='Z to A'
              />
              <MenuOption
                // onSelect={() => handleChange(`mode`, 'month')}
                text='Increasing'
              />
              <MenuOption
                // onSelect={() => handleChange(`mode`, 'month')}
                text='Decreasing'
              />
            </MenuOptions>
          </Menu>
          <Button
            backgroundColor={Colors.BUTTON_BG1}
            icon={'filter'}
            onPress={() => handleChange('visible', true)}
            style={{ height: 40, width: '48%', marginTop: 0 }}
            iconStyle={{ height: 18, width: 18 }}
            title={'Filter'}
          />
        </View>
        {title === 'Schedule Variances' && (
          <View style={{ width: '90%', marginBottom: 20, marginTop: 20 }}>
            <Text style={styles.description}>{'Totals'}</Text>
            <Text style={styles.title}>{'Actual Shift Duration:'}</Text>
            <Text style={styles.title}>{'Scheduled Shift Duration:'}</Text>
            <Text style={styles.title}>{'Variance:'}</Text>
          </View>
        )}
        {reports?.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: Colors.TEXT_INPUT_BG,
              padding: 10,
              width: '90%',
              marginTop: 10,
              marginBottom: 10,
              borderRadius: 10
            }}
          >
            <View style={{ marginVertical: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                {title === 'Schedule Variances' ? (
                  <Text style={styles.description}>{'Late Clock in'}</Text>
                ) : (
                  <View />
                )}
                <Text style={[styles.description, { marginTop: 0 }]}>
                  {'May 27th, 2022'}
                </Text>
              </View>
              <Text
                style={[
                  styles.title,
                  { marginTop: title === 'Schedule Variances' ? 0 : -20 }
                ]}
              >
                {title === 'Inspection' ? 'Worksite' : 'Employee Name:'}
              </Text>
              <Text style={styles.description}>
                {title === 'Inspection'
                  ? item?.worksite?.name
                  : item?.employee?.name}
              </Text>
            </View>
            {title === 'Schedule Variances' && (
              <>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Worksite:'}</Text>
                  <Text style={styles.description}>{'Worksite name'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Actual Time:'}</Text>
                  <Text style={styles.description}>{'5/28/2022 12:05:00'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Edited Time:'}</Text>
                  <Text style={styles.description}>{'5/28/2022 12:00:00'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Actual Shift Duration:'}</Text>
                  <Text style={styles.description}>{'6h22m'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>
                    {'Scheduled Shift Duration:'}
                  </Text>
                  <Text style={styles.description}>{'6h'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Variance:'}</Text>
                  <Text style={styles.description}>{'22m'}</Text>
                </View>
              </>
            )}
            {title !== 'Schedule Variances' && (
              <>
                <View style={{ marginVertical: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View>
                      <Text style={styles.title}>
                        {title === 'Inspection'
                          ? 'Inspection Report Name:'
                          : 'Total Hours:'}
                      </Text>
                      <Text style={styles.description}>
                        {title === 'Inspection' ? item?.name : '40'}
                      </Text>
                    </View>
                    {title === 'Inspection' && (
                      <PieChart
                        widthAndHeight={90}
                        doughnut={true}
                        coverRadius={0.7}
                        series={series}
                        sliceColor={sliceColor}
                      />
                    )}
                  </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View>
                      <Text style={styles.title}>
                        {title === 'Inspection'
                          ? 'Inspector'
                          : 'Total Compensation:'}
                      </Text>
                      <Text style={styles.description}>
                        {title === 'Inspection' ? 'Spencer' : '$200.00'}
                      </Text>
                    </View>
                    {title === 'Inspection' && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('InspectionDetails', { item })
                        }
                      >
                        <Text
                          style={{
                            ...Fonts.poppinsRegular(14),
                            color: Colors.BLUR_TEXT
                          }}
                        >
                          {'See Report'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={visible}
        transparent
        onDismiss={handleClose}
        onRequestClose={handleClose}
      >
        <View style={styles.centerMode}>
          <View style={styles.modal}>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={handleClose}>
                <Icon name='close' type='antdesign' />
              </TouchableOpacity>
            </View>
            <Text style={[styles.description, { ...Fonts.poppinsRegular(18) }]}>
              Filter
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ width: '50%' }}>
                <PrimaryTextInput
                  dateType={true}
                  text={from}
                  maxDate={new Date('2050/01/01')}
                  label='From'
                  key='from'
                  placeholder='From'
                  onChangeText={(text, isValid) => handleChange('from', text)}
                />
              </View>
              <View style={{ width: '50%' }}>
                <PrimaryTextInput
                  dateType={true}
                  maxDate={new Date('2050/01/01')}
                  text={to}
                  label='To'
                  key='to'
                  placeholder='To'
                  onChangeText={(text, isValid) => handleChange('to', text)}
                />
              </View>
            </View>
            <Button
              style={{ height: 40, marginTop: 20, width: '95%' }}
              onPress={_getReportsByFilter}
              disabled={!from || !to}
              // loading={loadingFeedback}
              title={'Apply filter'}
            />
            <Button
              style={{ height: 40 }}
              onPress={handleClose}
              isWhiteBg
              color={Colors.GREEN_COLOR}
              backgroundColor={'transparent'}
              title={'Cancel'}
            />
          </View>
        </View>
      </Modal>
      {title === 'Inspection' && (
        <Fab onPress={() => navigation.navigate('CreateInspection')} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },

  title: {
    ...Fonts.poppinsRegular(12),
    color: Colors.HOME_DES
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
    marginTop: 2
  },
  centerMode: {
    backgroundColor: Colors.MODAL_BG,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    width: '90%'
  }
})
