import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Header } from '../Common'
import { Fonts, Images, Colors } from '../../res'

export default function ReportsScene ({ navigation }) {
  const reportList = [
    { title: 'Schedule Variances' },
    { title: 'Location Variances' },
    // { title: 'Employee Time-off Requests' },
    { title: 'Payroll Reports' },
    // { title: 'Mindset Reports' },
    // { title: 'Employee Skill Reports' },
    { title: 'Inspection' }
  ]
  return (
    <View style={styles.container}>
      <Header
        leftIcon={{ ...Images.bar }}
        leftButton
        title={'Reports'}
        onLeftPress={() =>
          navigation.toggleDrawer({
            side: 'left',
            animated: true
          })
        }
        onRightPress={() => navigation.navigate('Notifications')}
        rightIcon={{ ...Images.bell }}
      />
      <View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
        {reportList.map((report, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('ReportsView', { title: report.title })
            }
            style={{ width: '90%', marginBottom: 20 }}
          >
            <Text style={styles.description}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
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
    padding: 20
  },
  footerButton: {
    marginTop: '15%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left'
  }
})
