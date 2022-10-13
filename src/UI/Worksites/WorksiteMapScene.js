import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native'
import { Header, Button } from '../Common'
import { Colors, Fonts } from '../../res'
import PrimaryTextInput from '../Common/PrimaryTextInput'
import Strings from '../../res/Strings'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { deleteWorksite } from '../../api/business'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'

const { width, height } = Dimensions.get('window')
const mapStyle = [
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
]
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.0922
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default function WorksiteMapScene ({ navigation, route }) {
  const worksiteData = route?.params?.item
  // Geolocation.setRNConfiguration({
  //   skipPermissionRequests: false
  // })
  var mapRef = useRef(null)
  const [state, setState] = useState({
    loading: false
  })

  const { currentLocation, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    requestGeolocationPermission()
  }, [])

  async function requestGeolocationPermission () {
    try {
      if (Platform.OS === 'ios') {
        getCurrentLocation()
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'CleanR Geolocation Permission',
          message: 'CleanR needs access to your current location.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation()
      } else {
        console.log('Geolocation permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const getCurrentLocation = async () => {
    // geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        const region = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        handleChange('currentLocation', region)
        mapRef && mapRef?.current?.animateToRegion(region)
      },
      error => console.log('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    Geolocation.watchPosition(position => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)
      const region = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setState(pre => ({ ...pre, initialRegion: region }))
      mapRef && mapRef?.current?.animateToRegion(region)
    })
  }

  console.warn('currentLocation', currentLocation)
  return (
    <View style={styles.container}>
      <Header
        onLeftPress={() => navigation.goBack()}
        title={Strings.worksites}
        leftButton
      />
      <View style={{ width: '100%', height: '75%' }}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={currentLocation}
          // onPress={props => onMapPress(props.nativeEvent.coordinate)}
          onRegionChange={() => console.log('')}
          ref={mapRef}
        >
          {currentLocation && (
            <Marker
              title={'My Location'}
              style={{ alignItems: 'center' }}
              // onPress={() => handleClickFood(truck)}
              coordinate={{
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude
              }}
            />
          )}
        </MapView>
      </View>
      <View style={{ height: '20%', width: '100%', padding: 20 }}>
        <Text style={{ ...Fonts.poppinsRegular(14), color: Colors.BLUR_TEXT }}>
          Street Address:{' '}
          <Text style={{ color: Colors.TEXT_COLOR }}>
            {worksiteData?.location}
          </Text>
        </Text>
        <Text
          style={{
            marginTop: 5,
            ...Fonts.poppinsRegular(14),
            color: Colors.BLUR_TEXT
          }}
        >
          Distance: <Text style={{ color: Colors.TEXT_COLOR }}>{'5 mi'}</Text>
        </Text>
      </View>
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
  title: {
    ...Fonts.poppinsMedium(22),
    color: Colors.TEXT_COLOR,
    marginBottom: 10,
    marginTop: 20
  },
  childContainer: {
    width: '90%'
  },
  footerButton: {
    marginTop: '5%',
    width: '100%'
  },
  footerWhiteButton: {
    marginTop: '5%',
    width: '100%',
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: Colors.BUTTON_BG
  },
  description: {
    ...Fonts.poppinsRegular(12),
    color: '#818080',
    textAlign: 'left',
    marginTop: 10
  },
  cellContainer: {
    marginVertical: 10,
    width: '100%'
  },
  cellTitle: {
    ...Fonts.poppinsRegular(14),
    color: Colors.TEXT_COLOR
  },
  map: {
    height: '100%',
    ...StyleSheet.absoluteFillObject
  }
})
