'use strict';
import React from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import NavigationBar from '../third_party/react-native-navbar/index';
import {DEV} from '../utilities/fixtures';
import _ from 'underscore';

let {
  AppRegistry,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Navigator,
} = React;

const DEFAULT_AVATAR = 'https://confluence.slac.stanford.edu/s/en_GB/5996/4a6343ec7ed8542179d6c78fa7f87c01f81da016.20/_/images/icons/profilepics/default.png';

class Message extends React.Component{
  render(){
    let {message, user} = this.props;
    // if (DEV) {console.log('MESSAGE PROPS', message, user);}
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>{
          if (this.props.user && ! this.props.isComment) {
            this.props.navigator.push({
              name      : 'Profile',
              user      : user,
              username  : user ? `${user.firstName} ${user.lastName}` : '',
              avatar    : user ? user.avatarUrl : DEFAULT_AVATAR,
            });
          }
        }}>
          <Image
            style={styles.icon}
            source={{uri: user ? user.avatarUrl : DEFAULT_AVATAR}}
          />
        </TouchableOpacity>
        <View style={styles.messageBox}>
          <View style={styles.row}>
            <Text style={styles.author}>{user ? `${user.firstName} ${user.lastName}` : message.senderName}</Text>
            <Text style={styles.sent}>{moment(new Date(parseInt(message.createdAt))).fromNow()}</Text>
          </View>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        </View>
      </View>
    )
  }
}
let styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  icon: {
    marginTop: 10,
    marginLeft: 13,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageBox: {
    flex: 1,
    alignItems: 'stretch',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    marginTop: 10
  },
  messageView: {
    backgroundColor: 'white',
    flex: 1,
    paddingRight: 15
  },
  messageText: {
    fontSize: 16,
    fontWeight: '300',
  },
  author:{
    fontSize: 12,
    fontWeight: '700'
  },
  sent:{
    fontSize: 12,
    fontWeight: '300',
    color: '#9B9B9B',
    marginLeft: 10,
    color: '#9B9B9B',
    fontWeight: '300',
    marginLeft: 10
  }
})
module.exports = Message;
