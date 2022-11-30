import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList
} from 'react-native'
import {
  BaseScene,
  Header,
  PrimaryTextInput,
  Button,
  DateSelectionView
} from '../Common'
import { Fonts, Colors, Images, Strings } from '../../res'
import MessageCell from './MessageCell'
import database from '@react-native-firebase/database'
import AppContext from '../../Utils/Context'

export default function MessagesScene ({ navigation }) {
  const context = useContext(AppContext)
  const { user } = context
  const [state, setState] = useState({
    loading: false,
    List: [],
    allList: [],
    unread: [],
    searchText: ''
  })

  const { loading, allList, unread, List, searchText } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getMessages()
    })
    navigation.addListener('blur', () => {
      handleChange('List', [])
      handleChange('allList', [])
    })
  }, [])

  const snapshotToArray = snapshot =>
    Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }))

  const getMessages = async () => {
    try {
      handleChange('loading', true)
      database()
        .ref(`Messages`)
        .on('value', snapshot => {
          if (snapshot.val()) {
            const messages = snapshotToArray(snapshot.val())
            handleChange('allList', messages)
            unreadList(messages)
            handleChange('loading', false)
            handleChange('List', messages)
          } else {
            handleChange('loading', false)
          }
        })
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error)
    }
  }

  const sortByDate = data => {
    return data?.sort(function (a, b) {
      return (
        new Date(
          b?.messages && b?.messages?.length > 0
            ? b?.messages[b?.messages?.length - 1]?.timeStamp
            : b?.timeStamp
        ) -
        new Date(
          a?.messages && a?.messages?.length > 0
            ? a?.messages[a?.messages?.length - 1]?.timeStamp
            : a?.timeStamp
        )
      )
    })
  }

  const unreadList = messages => {
    const unread = messages?.filter(
      item =>
        (item?.receiverId === user?.id && item?.receiverRead > 0) ||
        (item?.senderId === user?.id && item?.senderRead > 0)
    )
    handleChange('unread', unread)
  }

  const sortByUser = data => {
    return data?.filter(
      item => item?.senderId === user?.id || item?.receiverId === user?.id
    )
  }

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = allList?.filter(entry =>
        entry?.type === 'group'
          ? entry?.name?.includes(value)
          : entry?.senderId !== user?.id
          ? entry?.sender?.personal_information?.first_name?.includes(value)
          : entry?.receiver?.personal_information?.first_name?.includes(value)
      )
      handleChange('List', filtered)
    } else {
      handleChange('List', allList)
    }
  }

  const renderNewMessage = () => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingHorizontal: 20,
          padding: 10
        }}
        onPress={() => navigation.navigate('newMessage')}
      >
        <Text style={styles.cancelText}>{Strings.newMessage}</Text>
      </TouchableOpacity>
    )
  }

  const renderSearchInput = () => {
    return (
      <PrimaryTextInput
        label={Strings.searchConversation}
        key={'searchText'}
        value={searchText}
        onChangeText={value => filtered('searchText', value)}
        rightIcon={{ ...Images.search }}
      />
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.childContainer}>
        {renderSearchInput()}
        {renderNewMessage()}
        {loading && <ActivityIndicator size='small' color={Colors.BUTTON_BG} />}
        <FlatList
          data={sortByUser(sortByDate(List))}
          numColumns={1}
          style={{ width: '100%' }}
          noIndent={true}
          keyExtractor={item => item?.timeStamp}
          ListEmptyComponent={() => (
            <View
              style={{
                width: '100%',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  marginTop: 20,
                  ...Fonts.poppinsRegular(14),
                  color: Colors.BLACK
                }}
              >
                You have no messages
              </Text>
            </View>
          )}
          renderItem={({ item, index }) => {
            return (
              <MessageCell
                key={index}
                user={user}
                item={item}
                navigation={navigation}
              />
            )
          }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        leftIcon={{ ...Images.bar }}
        leftButton
        title={Strings.messagesTitle}
        onLeftPress={() =>
          navigation.toggleDrawer({
            side: 'left',
            animated: true
          })
        }
        rightIcon={{ ...Images.bell }}
        onRightPress={() => navigation.navigate('Notifications')}
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
    ...Fonts.poppinsRegular(22),
    color: Colors.TEXT_COLOR,
    marginTop: 20
  },
  childContainer: {
    flex: 1,
    paddingVertical: 15
  },
  footerButton: {
    width: '90%',
    marginTop: '15%'
  },
  description: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR,
    textAlign: 'left',
    marginTop: 20,
    lineHeight: 24
  },
  cancelText: {
    ...Fonts.poppinsRegular(14),
    color: Colors.BUTTON_BG,
    fontWeight: '500'
  }
})
