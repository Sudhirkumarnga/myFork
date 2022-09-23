import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Colors } from '../../res'

export default function Fab ({ onPress }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: Colors.BLUR_TEXT,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}
      >
        <Icon name='plus' type='antdesign' color={Colors.WHITE} />
      </TouchableOpacity>
    </View>
  )
}
