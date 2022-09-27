import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { Header, Fab } from '../Common'
import { Colors, Fonts } from '../../res'
import Strings from '../../res/Strings'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllWorksites } from '../../api/business'

export default function AllWorksiteScene ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    allWorksites: []
  })
  const { loading, allWorksites } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getAllWorksites()
    }, [])
  )

  const _getAllWorksites = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getAllWorksites(token)
      console.warn('getAllWorksites', res?.data)
      handleChange('loading', false)
      handleChange('allWorksites', res?.data?.results)
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
  console.warn('allWorksites', allWorksites)
  const renderContent = () => {
    return (
      <ScrollView style={styles.childContainer}>
        <Text style={styles.title}>{Strings.listWorksites}</Text>
        {allWorksites?.map(item => (
          <View style={styles.cellContainer}>
            <View>
              <Text style={styles.cellTitle}>
                {item?.personal_information?.name}
              </Text>
              <Text style={styles.description}>
                {item?.personal_information?.location}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('worksiteDetail', { item })}
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

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={Colors.BACKGROUND_BG} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={Strings.worksites}
        onLeftPress={() => navigation.goBack()}
        leftButton
      />
      {renderContent()}
      <Fab onPress={() => navigation.navigate('addWorksite')} />
    </View>
  )
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