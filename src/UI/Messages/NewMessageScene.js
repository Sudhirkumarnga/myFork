import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native'
import { Header, PrimaryTextInput } from '../Common'
import { Fonts, Strings, Images, Colors } from '../../res'
import userProfile from '../../res/Images/common/sample.png'
import groupIcon from '../../res/Svgs/group.svg'
import { SvgXml } from 'react-native-svg'
import { useFocusEffect } from '@react-navigation/native'
import { getAllEmployee } from '../../api/business'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database'
import AppContext from '../../Utils/Context'
import { ActivityIndicator } from 'react-native'

const screenWidth = Dimensions.get('window').width

export default function NewMessageScene ({ navigation }) {
  const { user, adminProfile } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    allEmployee: [],
    List: [],
    searchText: ''
  })
  const { loading, searchText, allEmployee, List } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      _getAllEmployee()
    }, [])
  )
  // console.warn('allEmployee',allEmployee);
  const _getAllEmployee = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getAllEmployee(token)
      console.warn('getAllEmployee', res?.data)
      handleChange('loading', false)
      handleChange('allEmployee', res?.data?.results)
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

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = allEmployee?.filter(entry =>
        entry?.senderId !== user?.id
          ? entry?.personal_information?.first_name?.includes(value)
          : entry?.personal_information?.first_name?.includes(value)
      )
      handleChange('List', filtered)
    } else {
      handleChange('List', allEmployee)
    }
  }

  const createMessageList = item => {
    const id = `${user?.id}_${item?.id}`
    const rid = `${item?.id}_${user?.id}`
    const db = database()
    db.ref('Messages/' + id).once('value', snapshot => {
      if (snapshot.val()) {
        let value = {
          sender: { ...user, ...adminProfile },
          senderId: user?.id,
          id: id,
          timeStamp: Date.now(),
          receiverRead: 0,
          receiverId: item.id,
          receiver: item
        }
        database()
          .ref('Messages/' + id)
          .update(value)
          .then(res => {
            navigation.navigate('MessageChat', { messageuid: id })
          })
          .catch(err => {
            Toast.show('Something went wrong!')
          })
      } else {
        db.ref('Messages/' + rid).once('value', snapshot => {
          if (snapshot.val()) {
            let value = {
              sender: user,
              senderId: user?.id,
              id: rid,
              timeStamp: Date.now(),
              receiverRead: 0,
              receiverId: item.id,
              receiver: item
            }
            database()
              .ref('Messages/' + rid)
              .update(value)
              .then(res => {
                navigation.navigate('MessageChat', { messageuid: rid })
              })
              .catch(err => {
                Toast.show('Something went wrong!')
              })
          } else {
            let value = {
              sender: user,
              senderId: user?.id,
              id: id,
              timeStamp: Date.now(),
              receiverRead: 0,
              receiverId: item.id,
              receiver: item
            }
            database()
              .ref('Messages/' + id)
              .update(value)
              .then(res => {
                navigation.navigate('MessageChat', { messageuid: id })
              })
              .catch(err => {
                Toast.show('Something went wrong!')
              })
          }
        })
      }
    })
  }

  const renderSearchInput = () => {
    return (
      <PrimaryTextInput
        label={Strings.searchConversation}
        value={searchText}
        onChangeText={value => filtered('searchText', value)}
        rightIcon={{ ...Images.search }}
      />
    )
  }

  console.warn('allEmployee', allEmployee)
  const renderContent = () => {
    return (
      <View style={styles.childContainerStyle}>
        {renderSearchInput()}
        <View style={{ width: '90%', marginTop: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: Colors.TEXT_INPUT_BG,
              paddingBottom: 10
            }}
            onPress={() => navigation.navigate('GroupMessageScene')}
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
        {loading && <ActivityIndicator size='small' color={Colors.BUTTON_BG} />}
        <FlatList
          data={List}
          style={{ width: '90%', marginTop: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => createMessageList(item)}
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
                source={
                  item?.personal_information?.profile_image
                    ? { uri: item?.personal_information?.profile_image }
                    : userProfile
                }
                style={{
                  borderRadius: 5,
                  width: 50,
                  height: 50,
                  marginRight: 20
                }}
              />
              <Text style={{ ...Fonts.poppinsRegular(12) }}>
                {item?.personal_information?.first_name +
                  ' ' +
                  item?.personal_information?.last_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={Strings.newMessage}
        leftButton
        onLeftPress={() => navigation.goBack()}
      />
      {renderContent()}
    </View>
  )
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
