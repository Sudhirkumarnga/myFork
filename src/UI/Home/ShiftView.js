import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { BaseScene, Button } from '../Common'
import { Fonts, Colors, Images, Strings } from '../../res'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUpcomingShift } from '../../api/employee'
import Toast from 'react-native-simple-toast'
import { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export default function ShiftView ({}) {
  const [state, setState] = useState({
    loading: false
  })

  const { loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getUpcomingShift()
    }, [])
  )

  const _getUpcomingShift = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getUpcomingShift(token)
      console.warn('getUpcomingShift', res?.data)
      handleChange('loading', false)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error?.response?.data)
      const showWError = Object.values(error.response?.data?.error)
      if (showWError.length > 0) {
        Toast.show(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        Toast.show(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  const renderClockButton = () => {
    return <Button title={Strings.clockIn} style={{ marginTop: 30 }} />
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View>
          <Text style={styles.title}>{Strings.upcomingShift}</Text>
          <Text style={styles.description}>{Strings.worksiteNumber}</Text>
          <Text
            style={[
              styles.description,
              { fontSize: 14, color: Colors.HOME_DES }
            ]}
          >
            {'Location:'}
          </Text>
        </View>
        <Image {...Images.calendar} style={styles.image} />
      </View>
      {renderClockButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dedede',
    borderRadius: 10,
    padding: 15
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
    resizeMode: 'contain',
    width: 30,
    height: 30
  }
})
