import React from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import { Fonts, Colors } from '../../res'
import Sample from '../../res/Images/common/sample.png'

export default function EmployeeListScene ({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.hourly}>Hourly rate</Text>
      <FlatList
        scrollEnabled={false}
        style={{ width: '100%' }}
        data={[
          { id: 1 },
          { id: 2 },
          { id: 2 },
          { id: 2 },
          { id: 1 },
          { id: 2 },
          { id: 2 },
          { id: 2 }
        ]}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('employeesView')}
            style={styles.listContainer}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={Sample}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  marginRight: 10
                }}
              />
              <View>
                <Text style={styles.title}>John Doe</Text>
                <Text style={styles.job}>Housekeeper</Text>
                <Text style={styles.location}>Location:</Text>
              </View>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <Text style={styles.title}>$10/hr</Text>
              <Text style={styles.message}>Message</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.WHITE
  },
  listContainer: {
    backgroundColor: Colors.TEXT_INPUT_BG,
    width: '100%',
    height: 70,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    ...Fonts.poppinsRegular(13),
    textTransform: 'uppercase',
    textAlign: 'right',
    width: '100%',
    marginBottom: 10,
    color: Colors.BLUR_TEXT
  },
  message: {
    ...Fonts.poppinsRegular(13),
    color: Colors.BLUR_TEXT
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
    marginTop: 20,
    lineHeight: 24
  }
})
