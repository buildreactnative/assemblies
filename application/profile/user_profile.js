import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {profileFixture} from '../fixtures/users';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

class UserProfile extends React.Component{
  render(){
    let titleConfig = {title: 'Profile', tintColor: 'white'}
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
        />
        <View style={styles.topProfileContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: profileFixture.avatar}} style={styles.avatar}/>
          </View>
          <View style={styles.topProfileInfo}>
            <Text style={styles.name}>{profileFixture.username}</Text>
            <Text style={styles.location}>{profileFixture.city}, {profileFixture.state}</Text>
          </View>
        </View>
        <View style={styles.formField}>
          <Text style={styles.formName}>My Technologies</Text>
          <TouchableOpacity>
            <Icon name="ios-arrow-forward" size={30} color='#ccc' />
          </TouchableOpacity>
        </View>
        <View style={styles.formField}>
          <Text style={styles.formName}>Settings</Text>
          <TouchableOpacity style={styles.forwardButton}>
            <Icon name="ios-arrow-forward" size={30} color='#ccc' />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.inactive,
  },
  topProfileContainer:{
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  avatar:{
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#777',
  },
  topProfileInfo:{
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
  },
  location:{
    fontSize: 20,
    fontWeight: '300',
  },
  formField:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginVertical: 25,
  },
  forwardButton:{

  },
  formName:{
    fontWeight: '300',
    fontSize: 20,
  },
  logoutButton: {
    position: 'absolute',
    left: 20,
  },
  logoutText:{
    fontSize: 20,
    color: 'red',
  },
}

module.exports = UserProfile;
