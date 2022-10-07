import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer'
import { BaseComponent } from '../UI/Common'
import { Colors, Fonts } from '../res'

class CustomDrawer extends BaseComponent {
  state = {
    name: '',
    email: ''
  }

  renderInfoSection () {
    return (
      <View style={styles.userInfoSection}>
        <Image
          {...this.images('appLogo')}
          style={{
            tintColor: Colors.BUTTON_BG,
            width: '40%',
            resizeMode: 'contain'
          }}
        />
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.toggleDrawer({
              side: 'left',
              animated: true
            })
          }
        >
          <Image {...this.images('cross')} />
        </TouchableOpacity>
      </View>
    )
  }

  renderDrawerCell (label, icon, name) {
    const imageName = `drawer_${icon}`
    return (
      <DrawerItem
        label={label}
        labelStyle={styles.drawerText}
        style={styles.drawerRow}
        onPress={() =>
          !!name &&
          this.props.navigation.navigate('ConsultationScene', {
            isDrawer: true
          })
        }
        icon={color => <Image {...this.images(imageName)} />}
      />
    )
  }

  render () {
    const list = [
      { title: 'My Profile', icon: `profile`, route: 'BusinessProfileView' },
      { title: 'Employee list', icon: `list`, route: 'EmployeeListScene' },
      { title: 'Worksites', icon: `worksites`, route: 'AllWorksiteScene' },
      { title: 'Report', icon: `report`, route: 'ReportsScene' },
      { title: 'Timer off Requests', icon: `timer`, route: 'RequestLeaveScene' },
      { title: 'Settings', icon: `settings`, route: 'Settings' }
    ]
    return (
      <View style={{ flex: 1 }}>
        {this.renderInfoSection()}
        {list.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              this.props.navigation.navigate(item.route, {
                isDrawer: true
              })
            }
            style={styles.drawerRow}
          >
            <Image
              {...this.images(item.icon)}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginRight: 10
              }}
            />
            <Text style={styles.drawerText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  userInfoSection: {
    paddingTop: 30,
    flexDirection: 'row',
    width: '85%',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '20%'
  },
  imageInfo: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  drawerRow: {
    height: 54,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%'
  },
  drawerText: {
    ...Fonts.poppinsRegular(16),
    marginRight: -10
  }
})

export default CustomDrawer
