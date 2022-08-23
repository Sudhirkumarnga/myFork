import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-big-calendar'
import Colors from '../../res/Theme/Colors'
import { Fonts } from '../../res/Theme'
import Header from '../Common/Header'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import { Icon } from 'react-native-elements'
import Button from '../Common/Button'
import moment from 'moment'

const events = [
  {
    title: 'Meeting',
    color: 'red',
    start: new Date(2022, 7, 7, 1, 11),
    end: new Date(2022, 7, 7, 5, 5)
  },
  {
    title: 'Coffee break',
    color: '#FDB48B',
    start: new Date(1660310074280),
    end: new Date(1660391914280)
  },
  {
    title: 'Meeting2',
    color: '#FFDF8B',
    start: new Date(1660286328269),
    end: new Date(1660309328269)
  },
  {
    title: 'Coffee break 2',
    color: '#FDB48B',
    start: new Date(1660310074280),
    end: new Date(1660391914280)
  }
]

export default function Scheduler () {
  const [state, setState] = useState({
    mode: 'week'
  })
  const [current, setCurrent] = React.useState(moment())
  const { mode } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const renderEvent = (event, touchableOpacityProps) => (
    <TouchableOpacity
      {...touchableOpacityProps}
      style={{ backgroundColor: event.color, borderRadius: 5 }}
    >
      <Text style={{ ...Fonts.poppinsMedium(9) }}>{`${event.title}`}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header leftButton title={'Scheduler'} />
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          marginBottom: 20,
          marginTop: 10
        }}
      >
        <View style={{ width: '50%' }}>
          <Menu style={{ marginBottom: 20, marginTop: 10 }}>
            <MenuTrigger style={{ width: '100%' }}>
              <View
                style={[
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 100,
                    marginTop: 0
                  }
                ]}
              >
                <Text style={{ ...Fonts.poppinsMedium(18) }}>
                  {current.format('MMM YYYY')}
                </Text>
                <Icon
                  name='down'
                  size={12}
                  color={Colors.BLACK}
                  style={{ marginLeft: 10 }}
                  type='antdesign'
                />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                // onSelect={() => handleChange(`mode`, 'month')}
                text='Aug 2022'
              />
            </MenuOptions>
          </Menu>
          <Menu>
            <MenuTrigger style={{ width: '100%' }}>
              <View
                style={[
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 100,
                    marginTop: 0
                  }
                ]}
              >
                <Text
                  style={{
                    ...Fonts.poppinsRegular(14),
                    textTransform: 'capitalize'
                  }}
                >
                  {mode ? mode + ' view' : 'Select Type'}
                </Text>
                <Icon
                  name='down'
                  size={12}
                  color={Colors.BLACK}
                  style={{ marginLeft: 10 }}
                  type='antdesign'
                />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => handleChange(`mode`, 'month')}
                text='Month View'
              />
              <MenuOption
                onSelect={() => handleChange(`mode`, 'week')}
                text='Week View'
              />
              <MenuOption
                onSelect={() => handleChange(`mode`, 'day')}
                text='Day View'
              />
            </MenuOptions>
          </Menu>
        </View>
        <View style={{ width: '50%' }}>
          <Button
            backgroundColor={Colors.BLUR_TEXT}
            style={{ height: 40 }}
            title={'Filter'}
          />
          {mode !== 'month' && (
            <Button
              backgroundColor={Colors.BLUR_TEXT}
              style={{ height: 40 }}
              title={'Publish All'}
            />
          )}
        </View>
      </View>

      <Calendar
        bodyContainerStyle={{ width: '100%' }}
        showAdjacentMonths
        sortedMonthView
        calendarContainerStyle={{ width: '100%', marginTop: 10 }}
        // headerContentStyle={{
        //   width: '100%',
        //   color:Colors.BLACK,
        //   alignItems: 'flex-start',
        //   justifyContent: 'flex-start'
        // }}
        // moreLabel={'Special Notes'}
        // dayHeaderStyle={{
        //   backgroundColor:Colors.BACKGROUND_BG,
        //   width: '100%',
        //   alignItems: 'flex-start',
        //   justifyContent: 'flex-start'
        // }}
        renderEvent={renderEvent}
        mode={mode}
        date={current.toDate()}
        events={events}
        height={600}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    height: '100%'
  },
  logo: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  titleText: {
    color: Colors.WHITE,
    ...Fonts.poppinsMedium(18),
    alignSelf: 'center',
    width: '70%',
    textAlign: 'center'
  },
  headerCommon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageLogo: {
    height: 300,
    width: 128,
    resizeMode: 'contain'
  }
})
