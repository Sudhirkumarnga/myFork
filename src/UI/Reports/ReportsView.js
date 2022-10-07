import React from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
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

export default function ReportsView ({ navigation, route }) {
  const title = route?.params?.title

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
        {[0, 0, 0].map((item, index) => (
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
                {'Employee Name:'}
              </Text>
              <Text style={styles.description}>{'Shad Harris'}</Text>
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
                  <Text style={styles.title}>{'Total Hours:'}</Text>
                  <Text style={styles.description}>{'40'}</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{'Total Compensation:'}</Text>
                  <Text style={styles.description}>{'$200.00'}</Text>
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
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
  }
})
