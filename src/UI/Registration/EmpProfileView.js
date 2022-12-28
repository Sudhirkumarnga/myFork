import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native'
import { Fonts, Colors } from '../../res'
import Sample from '../../res/Images/common/sample.png'
import { Header, Button } from '../Common'
import moment from 'moment'
import AppContext from '../../Utils/Context'
import { useContext } from 'react'

export default function EmpProfileView ({ navigation }) {
  const { adminProfile } = useContext(AppContext)
  const [state, setState] = useState({
    loading: false
  })

  const { loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  return (
    <View style={styles.container}>
      <Header
        leftButton
        title={'My Profile'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ width: '90%' }}
      >
        <Image
          source={
            adminProfile?.personal_information?.profile_image
              ? { uri: adminProfile?.personal_information?.profile_image }
              : Sample
          }
          style={styles.picture}
        />
        <Text style={styles.hourly}>
          {adminProfile?.personal_information?.first_name}
        </Text>
        <Text style={styles.heading}>Personal information</Text>
        <View style={styles.textView}>
          <Text style={styles.job}>First Name:</Text>
          <Text style={styles.title}>
            {adminProfile?.personal_information?.first_name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Last Name:</Text>
          <Text style={styles.title}>
            {adminProfile?.personal_information?.last_name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Phone:</Text>
          <Text style={styles.title}>
            {adminProfile?.personal_information?.phone}{' '}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Gender:</Text>
          <Text style={styles.title}>
            {adminProfile?.personal_information?.gender}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Date of Birth:</Text>
          <Text style={styles.title}>
            {moment(adminProfile?.personal_information?.date_of_birth).format(
              'MM/DD/YYYY'
            )}
          </Text>
        </View>
        <Text style={styles.heading}>Emergency Contact</Text>
        <View style={styles.textView}>
          <Text style={styles.job}>First Name:</Text>
          <Text style={styles.title}>
            {adminProfile?.emergency_contact?.first_name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Last Name:</Text>
          <Text style={styles.title}>
            {adminProfile?.emergency_contact?.last_name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.job}>Phone:</Text>
          <Text style={styles.title}>
            {adminProfile?.emergency_contact?.phone}
          </Text>
        </View>
        <Button
          style={[styles.footerWhiteButton]}
          onPress={() => navigation.navigate('EmployeeProfileScene')}
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
  heading: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
    ...Fonts.poppinsRegular(20),
    color: Colors.TEXT_COLOR
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
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  }
})
