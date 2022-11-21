import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native'
import NotificationIcon from '../../res/Images/common/notificationIcon.png'
import { Icon, CheckBox } from 'react-native-elements'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { Images } from '../../res'
import { useFocusEffect } from '@react-navigation/native'
import AppContext from '../../Utils/Context'
import Header from '../Common/Header'
import { Fonts } from '../../res/Theme'
import Colors from '../../res/Theme/Colors'
import { readNotification } from '../../api/auth'

const Notifications = ({ navigation }) => {
  const { notifications, _getNotification } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false,
    readed: [],
    unreaded: []
  }) // Karachi

  const { loading, unreaded, readed } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      if (notifications?.length > 0) {
        const readed = notifications?.filter(e => e.is_read === true)
        const unreaded = notifications?.filter(e => e.is_read === false)
        handleChange('readed', readed)
        handleChange('unreaded', unreaded)
      } else {
        handleChange('readed', [])
        handleChange('unreaded', [])
      }
    }, [notifications])
  )

  const _readNotification = async id => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      await readNotification(id, token)
      handleChange('loading', false)
      _getNotification()
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  const _renderItem = (item, index) => {
    return (
      <View key={index} style={styles.list}>
        <View style={styles.listView}>
          <View style={[styles.iconBox]}>
            <Image
              source={item?.image ? { uri: item?.image } : NotificationIcon}
              style={styles.itemImage}
            />
          </View>
          <View
            style={{
              width: '70%',
              marginLeft: 10,
              alignItems: 'flex-start'
            }}
          >
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  // fontFamily: FONT1REGULAR,
                  color: Colors.BLACK,
                  width: '70%',
                  fontSize: 13
                }}
              >
                {item?.description}
              </Text>
              <View style={styles.optionView}>
                {!item?.is_read && <View style={styles.dot} />}
                <TouchableOpacity>
                  <Text style={[styles.smallText]}>
                    {moment(item?.created_at).fromNow()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {!item?.is_read && (
              <View style={styles.checkedBoxView}>
                <CheckBox
                  title={''}
                  checkedIcon={
                    <Icon
                      name={'checkbox-marked'}
                      type={'material-community'}
                      color={Colors.BACKGROUND_BG}
                    />
                  }
                  textStyle={styles.forgotText}
                  containerStyle={[styles.checkedBox]}
                  uncheckedIcon={
                    <Icon
                      name={'checkbox-blank-outline'}
                      type={'material-community'}
                      color={Colors.BLUR_TEXT}
                    />
                  }
                  onPress={() => _readNotification(item?.id)}
                  checked={item?.read}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header
        leftButton
        title={'Notifications'}
        rightIcon={{ ...Images.bell }}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.listContainer}>
        <View style={styles.newContainer}>
          <View style={styles.newView}>
            <Text style={styles.listheading}>New</Text>
            <View
              style={{
                width: 20,
                height: 20,
                marginLeft: 15,
                marginTop: -5,
                backgroundColor: Colors.RED_COLOR,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: Colors.WHITE, marginTop: -1 }}>
                {unreaded?.length}
              </Text>
            </View>
          </View>
          <Text style={styles.markasall}>Mark as read</Text>
        </View>
        {loading && <ActivityIndicator color={Colors.BACKGROUND_BG} />}
        <FlatList
          data={unreaded}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => _renderItem(item, index)}
        />
        <View style={[{ alignItems: 'flex-start', width: '90%' }]}>
          <Text style={styles.listheading}>Reviewed</Text>
        </View>
        <FlatList
          data={readed}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => _renderItem(item, index)}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: colors.background
  },
  mainBody: {
    width: '90%',
    flex: 1,
    marginTop: 20,
    alignItems: 'center'
  },
  scroll: {
    flex: 1
    // backgroundColor: colors.background
  },
  center: {
    alignItems: 'center'
  },
  newContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20
  },
  newView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  dot: {
    width: 8,
    height: 8,
    // backgroundColor: colors.redAlert,
    borderRadius: 10,
    marginRight: 8
  },
  smallText: {
    ...Fonts.poppinsRegular(10)
    // fontFamily: FONT1MEDIUM,
    // color: colors.white
  },
  markasall: {
    // fontFamily: FONT1REGULAR,
    ...Fonts.poppinsRegular(14),
    color: Colors.BLUR_TEXT,
    textTransform: 'uppercase'
  },
  checkedBox: {
    backgroundColor: 'transparent',
    marginRight: -15
  },
  countText: {
    ...Fonts.poppinsRegular(14),
    // fontFamily: FONT1REGULAR,
    // color: colors.white,
    fontSize: 13
  },
  count: {
    width: 25,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    // backgroundColor: colors.secondary,
    borderRadius: 25
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkedBoxView: {
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 0
  },
  listheading: {
    ...Fonts.poppinsRegular(18)
    // color: colors.white,
    // fontFamily: FONT1BOLD
  },
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  optionView: {
    flexDirection: 'row',
    // width: '20%',
    alignItems: 'center'
  },
  titleStyle: {
    // color: colors.white,
    // fontFamily: FONT1BOLD
  },
  list: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10
  },
  listContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    marginTop: -10,
    zIndex: -1
  },
  rowList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listContnet: {
    padding: 20
  },
  listView: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 10,
    paddingBottom: 10
  },
  listImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8
  },
  socialBox: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 8,
    // backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: 'contain'
  }
})
export default Notifications
