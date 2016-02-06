import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'underscore';
import {profileFixture} from '../fixtures/users';
import NavigationBar from 'react-native-navbar';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ListView,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  NativeModules,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Profile extends React.Component{
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    )
  }
  render(){
    let {username, avatar,} = this.props;
    let titleConfig = {title: `${username}'s Profile`, tintColor: 'white'};
    let back = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={back}
        />
        <ScrollView style={styles.profileContainer}>
          <View style={{height: 120, alignItems: 'center'}}>
            <Image source={{uri: avatar}} style={styles.avatar}/>
          </View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.location}>{profileFixture.city}, {profileFixture.state}</Text>
          <View style={styles.newMessageContainer}>
            <Icon name="chatbubbles" size={40} style={styles.chatBubble} color={Colors.brandPrimary}/>
            <Text style={styles.sendMessageText}>Send a Message</Text>
          </View>
          <View style={styles.break}></View>
          <Text style={styles.technologies}>Technologies</Text>
          <Text style={styles.technologyList}>{profileFixture.technologies.join(', ')}</Text>
          <Text style={styles.technologies}>Assemblies</Text>
          <View style={{flexDirection: 'row'}}>

          {profileFixture.assemblies.map((assembly, idx) => {
            return (
              <View key={idx} style={{backgroundColor: assembly.background, height: 150, width: (deviceWidth / 2) - 20, padding: 20, margin: 10,}}>
                <Text style={{color: 'white', margin: 20, fontSize: 20, fontWeight: '300'}}>{assembly.name}</Text>
              </View>
            )
          })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonText: {
    color: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 20,
  },
  username: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '300',
    padding: 8,
  },
  location: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '300',
  },
  newMessageContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assemblies:{

  },
  break:{
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 1,
    width: deviceWidth - 20,
  },
  chatBubble:{
    padding: 10,
  },
  sendMessageText: {
    fontSize: 18,
    padding: 5,
  },
  technologies:{
    textAlign: 'left',
    fontSize: 22,
    paddingHorizontal: 20,
    paddingBottom: 4,
    paddingTop: 20,
  },
  technologyList:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },

  inputBox: {
    height: 60,
    backgroundColor: '#F3EFEF',
    flexDirection: 'row',
    marginBottom: 50,
  },

  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
})

module.exports = Profile;
