import React from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image
} from 'react-native'
import { Fonts, Colors } from '../../res'
import Sample from '../../res/Images/common/sample.png'
import { Header, Button } from '../Common'

export default function EmployeesView ({ navigation }) {
  return (
    <View style={styles.container}>
      <Header
        leftButton
        title={'View Employee'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ width: '90%' }}
      >
        <Image source={Sample} style={styles.picture} />
        <Text style={styles.hourly}>John Doe</Text>
        <View style={styles.textView}>
          <Text style={styles.job}>Date of birth:</Text>
          <Text style={styles.title}>6/16/1985</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Email Address:</Text>
          <Text style={styles.title}>johndoe@gmail.com</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Phone Number:</Text>
          <Text style={styles.title}>+1122334455</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Address:</Text>
          <Text style={styles.title}>Street number 1. New York </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Position:</Text>
          <Text style={styles.title}>Cleaner</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Hourly Rate:</Text>
          <Text style={styles.title}>$10/hr</Text>
        </View>
        <Button
          style={[styles.footerWhiteButton]}
          title={'Message'}
          icon={'messages'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          isWhiteBg
          color={Colors.GREEN_COLOR}
        />
        <Button
          style={[styles.footerWhiteButton]}
          onPress={()=>navigation.navigate('addEmployee')}
          title={'Edit'}
          icon={'edit'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          isWhiteBg
          color={Colors.GREEN_COLOR}
        />
        <Button
          style={[styles.footerWhiteButton, { marginBottom: 30 }]}
          title={'Delete Employee'}
          icon={'delete'}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: Colors.GREEN_COLOR,
            resizeMode: 'contain'
          }}
          isWhiteBg
          color={Colors.GREEN_COLOR}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: Colors.WHITE
  },
  picture: {
    width: 100,
    marginTop: 20,
    height: 100,
    borderRadius: 10,
    marginBottom: 20
  },
  title: {
    ...Fonts.poppinsRegular(14),
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
    ...Fonts.poppinsRegular(16),
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
    color: Colors.TEXT_COLOR
  },
  message: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
  },
  textView: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20
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
  },
  footerWhiteButton: {
    marginTop: '5%',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
